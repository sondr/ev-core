/* =========================================================================
 * InteractiveSVG — lean, merged implementation
 * - Clean layer structure: <svg><g data-zoom-root><defs/><g data-blueprint/><g data-marker-layer/></g></svg>
 * - Event delegation (2 listeners total)
 * - Screen/world scale markers
 * - Panzoom-friendly via setZoomTransform()
 * - Headless/JSDOM-friendly via DomAdapter
 * ========================================================================= */

import {
  IInteractiveSVG, DomAdapter, MarkerId, Marker, MarkerClick, SvgClick, GetMarkerOptions, MarkerRecord, GetMarkersOptions, SerializeOpts, CoordSpace, ScaleMode, LoadSvgOptions,
  NS,
  InteractiveSVGConstructorOptions
} from "./interfaces";
import { BrowserDomAdapter } from "./adapters/dom-browser-adapter";

export class InteractiveSVG<D = unknown> implements IInteractiveSVG<D> {
  readonly svg: SVGSVGElement;
  private adapter: DomAdapter;

  private zoomRoot!: SVGGElement;
  private defs!: SVGDefsElement;
  private blueprint!: SVGGElement;
  private markerLayer!: SVGGElement;

  private markerMap = new Map<MarkerId, Marker<D>>();
  private elementMap = new Map<MarkerId, SVGGElement>();

  private subMarkerClick = new Set<(p: MarkerClick) => void>();
  private subSvgClick = new Set<(p: SvgClick) => void>();

  private isDragging = false;
  private styleHook?: (el: SVGElement, m: Marker<D>) => void;
  private nonScalingStroke = false;
  private cursorPointer = false;

  private zoom = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  private get zoomK() { return Math.hypot(this.zoom.a, this.zoom.b) || 1; }

  constructor(host: SVGSVGElement | HTMLElement, opts?: InteractiveSVGConstructorOptions<D>) {
    this.adapter = opts?.adapter ?? new BrowserDomAdapter();

    this.styleHook = opts?.styleHook;
    this.nonScalingStroke = !!opts?.nonScalingStroke;
    this.cursorPointer = !!opts?.cursorPointer;

    if ((host as SVGSVGElement).tagName?.toLowerCase?.() === "svg") {
      this.svg = host as SVGSVGElement;
    } else {
      this.svg = this.adapter.createElementNS(NS, "svg") as SVGSVGElement;
      (host as HTMLElement).appendChild(this.svg);
    }

    if (!this.svg.getAttribute("viewBox")) {
      this.svg.setAttribute("viewBox", opts?.viewBox ?? "0 0 100 100");
    }
    this.svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    (this.svg.style as any).width = (this.svg.style as any).width || "100%";
    (this.svg.style as any).height = (this.svg.style as any).height || "100%";

    this.initDOM();
    this.bindEvents();
  }

  /* ---------- init ---------- */
  private initDOM() {
    this.zoomRoot = this.adapter.createElementNS(NS, "g") as SVGGElement;
    this.defs = this.adapter.createElementNS(NS, "defs") as SVGDefsElement;
    this.blueprint = this.adapter.createElementNS(NS, "g") as SVGGElement;
    this.markerLayer = this.adapter.createElementNS(NS, "g") as SVGGElement;

    this.adapter.setAttribute(this.zoomRoot, "data-zoom-root", "1");
    this.adapter.setAttribute(this.blueprint, "data-blueprint", "1");
    this.adapter.setAttribute(this.markerLayer, "data-marker-layer", "1");

    while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);
    this.svg.appendChild(this.zoomRoot);
    this.zoomRoot.appendChild(this.defs);
    this.zoomRoot.appendChild(this.blueprint);
    this.zoomRoot.appendChild(this.markerLayer);
  }

  private bindEvents() {
    const onClick = (ev: MouseEvent) => {
      if (this.isDragging) return;
      const target = ev.target as Element | null;
      if (!target) return;

      const groupEl = target.closest?.('g[data-marker-id]') as SVGGElement | null;
      if (groupEl) {
        ev.stopPropagation();
        const id = groupEl.getAttribute('data-marker-id') as MarkerId;
        const marker = this.markerMap.get(id);
        if (!marker) return;

        const p = this.clientToSvg(ev.clientX, ev.clientY);
        const payload: MarkerClick = {
          marker,
          groupEl,
          shapeEl: (target as any as SVGElement) ?? null,
          element: groupEl,
          event: ev,
          vb: { x: p.x, y: p.y },
          pct: this.svgToPercent(p.x, p.y),
        };
        this.subMarkerClick.forEach(cb => { try { cb(payload); } catch { } });
        return;
      }

      const p = this.clientToSvg(ev.clientX, ev.clientY);
      const bg: SvgClick = { event: ev, vb: { x: p.x, y: p.y }, pct: this.svgToPercent(p.x, p.y) };
      this.subSvgClick.forEach(cb => { try { cb(bg); } catch { } });
    };

    this.adapter.addEvent(this.svg, 'click', onClick);
    (this as any)._onClick = onClick;
  }

  /* ---------- blueprint loading with viewBox handling ---------- */
  loadSVG(svgText: string, opts: LoadSvgOptions = {}): this {
    const {
      adoptViewBox = true,
      updateMarkers = "reflow",
      radiusScale = "min",
    } = opts;

    const oldVB = {
      x: this.svg.viewBox.baseVal.x, y: this.svg.viewBox.baseVal.y,
      width: this.svg.viewBox.baseVal.width, height: this.svg.viewBox.baseVal.height
    };

    const parsed = this.adapter.parseSVG(svgText);
    const newVbStr = parsed.getAttribute('viewBox');
    let newVB = oldVB;

    if (adoptViewBox && newVbStr) {
      const [x, y, w, h] = newVbStr.trim().split(/\s+/).map(Number);
      newVB = { x, y, width: w, height: h };
      this.svg.setAttribute('viewBox', newVbStr);
    }

    // defs
    while (this.defs.firstChild) this.defs.removeChild(this.defs.firstChild);
    parsed.querySelectorAll('defs > *').forEach(n => this.defs.appendChild(n.cloneNode(true)));

    // blueprint
    while (this.blueprint.firstChild) this.blueprint.removeChild(this.blueprint.firstChild);
    const frag = this.adapter.createFragment();
    Array.from(parsed.childNodes).forEach(n => {
      if ((n as Element).tagName?.toLowerCase() === 'defs') return;
      frag.appendChild(n.cloneNode(true));
    });
    this.blueprint.appendChild(frag);

    if (updateMarkers === "none") return this;

    if (updateMarkers === "reflow") {
      for (const id of this.markerMap.keys()) this.updateMarker(this.markerMap.get(id)!);
      return this;
    }

    if (updateMarkers === "remap-vb") {
      for (const id of this.markerMap.keys()) {
        const m = this.markerMap.get(id)!;
        if ((m.coordSpace ?? "pct") === "vb") {
          const mm = this.remapMarkerVB(m, oldVB, newVB, radiusScale);
          this.markerMap.set(id, mm);
        }
      }
      for (const id of this.markerMap.keys()) this.updateMarker(this.markerMap.get(id)!);
    }

    return this;
  }

  /* ---------- clear everything (defs + blueprint + markers + zoom) ---------- */
  clear(): this {
    // defs
    while (this.defs.firstChild) this.defs.removeChild(this.defs.firstChild);
    // blueprint
    while (this.blueprint.firstChild) this.blueprint.removeChild(this.blueprint.firstChild);
    // markers
    this.clearMarkers();
    // reset zoom
    this.zoom = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
    this.zoomRoot.removeAttribute('transform');
    return this;
  }

  /* ---------- marker CRUD ---------- */
  addMarker(marker: Marker<D>): this {
    if (this.markerMap.has(marker.id)) throw new Error(`Marker exists: ${marker.id}`);
    const g = this.createWrapper(marker);
    g.appendChild(this.buildMarkerInner(marker));
    this.applyScreenScale(g, marker);
    this.markerLayer.appendChild(g);
    this.markerMap.set(marker.id, marker);
    this.elementMap.set(marker.id, g);
    return this;
  }

  addMarkers(markers: Marker<D>[]): this { markers.forEach(m => this.addMarker(m)); return this; }

  updateMarker(marker: Marker<D>): this {
    const g = this.elementMap.get(marker.id);
    if (!g) throw new Error(`Marker not found: ${marker.id}`);
    this.applyBaseAttrs(g, marker, /*preserve*/true);
    while (g.firstChild) g.removeChild(g.firstChild);
    g.appendChild(this.buildMarkerInner(marker));
    this.applyScreenScale(g, marker);
    this.markerMap.set(marker.id, marker);
    return this;
  }

  removeMarkerById(id: MarkerId): this {
    const el = this.elementMap.get(id);
    if (el?.parentNode) el.parentNode.removeChild(el);
    this.elementMap.delete(id);
    this.markerMap.delete(id);
    return this;
  }
  removeMarker(marker: Marker): this { return this.removeMarkerById(marker.id); }
  removeMarkers(markers: Marker[]): this { markers.forEach(m => this.removeMarkerById(m.id)); return this; }
  clearMarkers(): this { Array.from(this.markerMap.keys()).forEach(id => this.removeMarkerById(id)); return this; }

  /* ---------- getters: data + element ---------- */
  get markers(): ReadonlyArray<Marker<D>> { return Array.from(this.markerMap.values()); }

  private makeRecord(id: MarkerId, opts: GetMarkerOptions = {}): MarkerRecord | null {
    if (!this.markerMap.has(id)) return null;
    const self = this;
    const rec: MarkerRecord = {
      id,
      get marker() { return self.markerMap.get(id) ?? null; },
      get element() { return self.elementMap.get(id) ?? null; },
      remove: () => {
        const m = self.markerMap.get(id) ?? null;
        const el = self.elementMap.get(id) ?? null;
        self.removeMarkerById(id);
        return { id, marker: m, element: el };
      }
    };
    if (opts.includeShapes && rec.element) {
      rec.shapes = Array.from(rec.element.querySelectorAll<SVGElement>(opts.selector ?? 'circle,rect,polygon,path,use'));
    }
    return rec;
  }

  getMarker(id: MarkerId, opts: GetMarkerOptions = {}): MarkerRecord | null { return this.makeRecord(id, opts); }
  getMarkers(ids: MarkerId[], opts: GetMarkersOptions = {}): (MarkerRecord | null)[] {
    const out = ids.map(id => this.makeRecord(id, opts));
    return opts.strict ? out : out.filter(Boolean);
  }
  getAllMarkers(opts: GetMarkerOptions = {}): MarkerRecord[] {
    const res: MarkerRecord[] = [];
    for (const id of this.markerMap.keys()) {
      const r = this.makeRecord(id, opts);
      if (r) res.push(r);
    }
    return res;
  }

  /* ---------- element helpers ---------- */
  getMarkerElement(id: MarkerId): SVGGElement | null { return this.elementMap.get(id) ?? null; }

  getMarkerShapes(id: MarkerId, selector = 'circle,rect,polygon,path,use'): SVGElement[] {
    const el = this.elementMap.get(id); if (!el) return [];
    return Array.from(el.querySelectorAll<SVGElement>(selector));
  }

  editMarkers(ids: MarkerId | MarkerId[], fn: (el: SVGGElement, id: MarkerId) => void): this {
    (Array.isArray(ids) ? ids : [ids]).forEach(id => { const el = this.elementMap.get(id); if (el) fn(el, id); });
    return this;
  }

  setMarkerClass(ids: MarkerId | MarkerId[], className: string, on?: boolean): this {
    return this.editMarkers(ids, el => { if (on === undefined) el.classList.toggle(className); else el.classList.toggle(className, !!on); });
  }

  setMarkerAttrs(ids: MarkerId | MarkerId[], attrs: Record<string, string>, selector = 'circle,rect,polygon,path,use'): this {
    return this.editMarkers(ids, el => {
      el.querySelectorAll<SVGElement>(selector).forEach(shape => {
        for (const [k, v] of Object.entries(attrs)) shape.setAttribute(k, v);
      });
    });
  }

  /* ---------- events ---------- */
  onMarkerClick(cb: (p: MarkerClick<D>) => void): this {
    this.subMarkerClick.add(cb);
    return this;
  }
  offMarkerClick(cb: (p: MarkerClick<D>) => void): this {
    this.subMarkerClick.delete(cb);
    return this;
  }
  onceMarkerClick(cb: (p: MarkerClick<D>) => void): this {
    const wrap = (p: MarkerClick<D>) => { try { cb(p); } finally { this.subMarkerClick.delete(wrap); } };
    this.subMarkerClick.add(wrap);
    return this;
  }

  onSvgClick(cb: (p: SvgClick) => void): this {
    this.subSvgClick.add(cb);
    return this;
  }
  offSvgClick(cb: (p: SvgClick) => void): this {
    this.subSvgClick.delete(cb);
    return this;
  }
  onceSvgClick(cb: (p: SvgClick) => void): this {
    const wrap = (p: SvgClick) => { try { cb(p); } finally { this.subSvgClick.delete(wrap); } };
    this.subSvgClick.add(wrap);
    return this;
  }

  offAllListeners(): this {
    this.subMarkerClick.clear();
    this.subSvgClick.clear();
    return this;
  }

  setDragging(v: boolean): this { this.isDragging = !!v; return this; }

  /* ---------- zoom/pan ---------- */
  setZoomTransform(a: number, b: number, c: number, d: number, e: number, f: number): this {
    this.zoom = { a, b, c, d, e, f };
    this.zoomRoot.setAttribute('transform', `matrix(${a} ${b} ${c} ${d} ${e} ${f})`);
    this.refreshScreenScales();
    return this;
  }

  /* ---------- coordinates ---------- */
  clientToSvg(clientX: number, clientY: number): DOMPoint {
    const ctm = this.adapter.getScreenCTM(this.svg as unknown as SVGGraphicsElement);
    if (ctm) {
      const inv = ctm.inverse();
      const pt = this.adapter.createDOMPoint(clientX, clientY);
      return pt.matrixTransform(inv);
    }
    const rect = (this.svg as any).getBoundingClientRect?.();
    if (rect && rect.width && rect.height) {
      const vb = this.svg.viewBox.baseVal;
      const x = vb.x + ((clientX - rect.left) / rect.width) * vb.width;
      const y = vb.y + ((clientY - rect.top) / rect.height) * vb.height;
      return this.adapter.createDOMPoint(x, y);
    }
    const inv = this.inverse(this.zoom);
    const x = inv.a * clientX + inv.c * clientY + inv.e;
    const y = inv.b * clientX + inv.d * clientY + inv.f;
    return this.adapter.createDOMPoint(x, y);
  }

  svgToPercent(x: number, y: number) {
    const vb = this.svg.viewBox.baseVal;
    return { x: ((x - vb.x) / vb.width) * 100, y: ((y - vb.y) / vb.height) * 100 };
  }

  /* ---------- serialization ---------- */
  toSVGString(opts: SerializeOpts = {}): string {
    const { preserveZoom = false, stripInternalAttrs = true, includeStyle = false } = opts;

    const clone = this.svg.cloneNode(true) as SVGSVGElement;
    if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    if (!clone.getAttribute("xmlns:xlink")) clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

    const root = clone.querySelector('g[data-zoom-root]') as SVGGElement | null;
    if (!preserveZoom && root) root.removeAttribute('transform');

    if (!preserveZoom) {
      clone.querySelectorAll('g[data-screen]').forEach(wrap => {
        const base = (wrap as SVGGElement).getAttribute('data-base') || '';
        (wrap as SVGGElement).setAttribute('transform', base);
      });
    }

    if (stripInternalAttrs) {
      const rm = ['data-marker-id', 'data-zoom-root', 'data-blueprint', 'data-marker-layer', 'data-screen', 'data-base'];
      const walk = (el: Element) => { rm.forEach(a => el.removeAttribute(a)); Array.from(el.children).forEach(c => walk(c)); };
      walk(clone);
    }

    if (includeStyle) {
      const style = this.adapter.createElementNS(NS, 'style') as SVGStyleElement;
      style.textContent = typeof includeStyle === 'string' ? includeStyle : '';
      clone.insertBefore(style, clone.firstChild);
    }

    return new XMLSerializer().serializeToString(clone);
  }

  downloadSVG(opts: SerializeOpts = {}): void {
    if (typeof window === 'undefined') throw new Error("downloadSVG is browser-only. Use toSVGString() in Node.");
    const name = opts.filename || 'interactive.svg';
    const text = this.toSVGString(opts);
    const blob = new Blob([text], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  /* ---------- teardown ---------- */
  destroy(): void {
    const onClick = (this as any)._onClick as EventListener | undefined;
    if (onClick) this.adapter.removeEvent(this.svg, 'click', onClick);
    if (this.zoomRoot && this.zoomRoot.parentNode === this.svg) this.svg.removeChild(this.zoomRoot);
    this.markerMap.clear();
    this.elementMap.clear();
    this.subMarkerClick.clear();
    this.subSvgClick.clear();
  }

  /* =======================================================================
   * internals
   * ======================================================================= */
  private inverse(m: { a: number; b: number; c: number; d: number; e: number; f: number }) {
    const det = m.a * m.d - m.b * m.c || 1;
    return {
      a: m.d / det,
      b: -m.b / det,
      c: -m.c / det,
      d: m.a / det,
      e: (m.c * m.f - m.d * m.e) / det,
      f: (m.b * m.e - m.a * m.f) / det,
    };
  }

  private createWrapper(marker: Marker): SVGGElement {
    const g = this.adapter.createElementNS(NS, 'g') as SVGGElement;
    this.applyBaseAttrs(g, marker, /*preserve*/false);
    return g;
  }

  private applyBaseAttrs(g: SVGGElement, marker: Marker, preserve = false) {
    g.setAttribute('data-marker-id', marker.id);
    if (marker.ariaLabel) g.setAttribute('aria-label', marker.ariaLabel);
    g.setAttribute('tabindex', '0');
    if (!preserve) g.classList.add('marker');
    if (marker.className) {
      marker.className.split(/\s+/).filter(Boolean).forEach(cls => g.classList.add(cls));
    }
  }

  private buildMarkerInner(marker: Marker<D>): SVGGElement | SVGElement {
    const coord: CoordSpace = marker.coordSpace ?? 'pct';
    const scaleMode: ScaleMode = marker.scaleMode ?? 'world';
    const vb = this.svg.viewBox.baseVal;

    const toX = (x: number) => coord === 'pct' ? vb.x + (x / 100) * vb.width : x;
    const toY = (y: number) => coord === 'pct' ? vb.y + (y / 100) * vb.height : y;
    const wPct = (v: number) => (v / 100) * vb.width;
    const hPct = (v: number) => (v / 100) * vb.height;
    const mPct = (v: number) => (v / 100) * Math.min(vb.width, vb.height);

    const make = (tag: string) => this.adapter.createElementNS(NS, tag) as SVGElement;

    const wrapAt = (cx: number, cy: number) => {
      const wrap = this.adapter.createElementNS(NS, 'g') as SVGGElement;
      const base = `translate(${cx} ${cy})`;
      wrap.setAttribute('transform', base);
      wrap.setAttribute('data-base', base);
      return wrap;
    };

    switch (marker.shape) {
      case 'circle': {
        const cx = toX(marker.x), cy = toY(marker.y);
        const r = coord === 'pct' ? wPct(marker.r) : marker.r;
        const wrap = wrapAt(cx, cy);
        const el = make('circle');
        el.setAttribute('cx', '0'); el.setAttribute('cy', '0'); el.setAttribute('r', String(r));
        wrap.appendChild(el);
        if (scaleMode === 'screen') wrap.setAttribute('data-screen', '1');
        this.applyGeomDefaults(el, marker);
        return wrap;
      }
      case 'square': {
        const cx = toX(marker.x), cy = toY(marker.y);
        const size = coord === 'pct' ? mPct(marker.size) : marker.size;
        const wrap = wrapAt(cx, cy);
        const el = make('rect');
        const s2 = size / 2;
        el.setAttribute('x', String(-s2)); el.setAttribute('y', String(-s2));
        el.setAttribute('width', String(size)); el.setAttribute('height', String(size));
        wrap.appendChild(el);
        if (scaleMode === 'screen') wrap.setAttribute('data-screen', '1');
        this.applyGeomDefaults(el, marker);
        return wrap;
      }
      case 'triangle': {
        const cx = toX(marker.x), cy = toY(marker.y);
        const size = coord === 'pct' ? mPct(marker.size) : marker.size;
        const ang = ((marker.orientation ?? 0) * Math.PI) / 180;
        const R = size / Math.sqrt(3);
        const pts = [0, 120, 240].map(deg => {
          const t = ang + (deg * Math.PI) / 180;
          return `${R * Math.cos(t)},${R * Math.sin(t)}`;
        }).join(' ');
        const wrap = wrapAt(cx, cy);
        const el = make('polygon');
        el.setAttribute('points', pts);
        wrap.appendChild(el);
        if (scaleMode === 'screen') wrap.setAttribute('data-screen', '1');
        this.applyGeomDefaults(el, marker);
        return wrap;
      }
      case 'rect': {
        const x = toX(marker.x), y = toY(marker.y);
        const w = coord === 'pct' ? wPct(marker.width) : marker.width;
        const h = coord === 'pct' ? hPct(marker.height) : marker.height;
        const x0 = (marker.anchor ?? 'center') === 'center' ? x - w / 2 : x;
        const y0 = (marker.anchor ?? 'center') === 'center' ? y - h / 2 : y;
        const el = make('rect');
        el.setAttribute('x', String(x0)); el.setAttribute('y', String(y0));
        el.setAttribute('width', String(w)); el.setAttribute('height', String(h));
        this.applyGeomDefaults(el, marker);
        return el;
      }
      case 'polygon': {
        const el = make('polygon');
        const pts = marker.points.map(p => `${toX(p.x)},${toY(p.y)}`).join(' ');
        el.setAttribute('points', pts);
        this.applyGeomDefaults(el, marker);
        return el;
      }
      case 'icon': {
        const cx = toX(marker.x), cy = toY(marker.y);
        const size = coord === 'pct' ? mPct(marker.size) : marker.size;
        const wrap = wrapAt(cx, cy);
        const el = make('use');
        const s2 = size / 2;
        (el as any).setAttribute('href', `#${marker.symbolId}`);
        el.setAttribute('x', String(-s2)); el.setAttribute('y', String(-s2));
        el.setAttribute('width', String(size)); el.setAttribute('height', String(size));
        wrap.appendChild(el);
        if (scaleMode === 'screen') wrap.setAttribute('data-screen', '1');
        this.applyGeomDefaults(el, marker);
        return wrap;
      }
    }
  }

  private applyGeomDefaults(el: SVGElement, marker: Marker<D>) {
  if (this.nonScalingStroke) el.setAttribute('vector-effect', 'non-scaling-stroke');
  if (this.cursorPointer)   (el as any).style.cursor = 'pointer';
  if (this.styleHook)       this.styleHook(el, marker);
}

  private applyScreenScale(wrapper: SVGGElement, marker: Marker) {
    const pointLike = marker.shape === 'circle' || marker.shape === 'square' || marker.shape === 'triangle' || marker.shape === 'icon';
    if (!pointLike || (marker.scaleMode ?? 'world') !== 'screen') return;
    const base = wrapper.getAttribute('data-base') || '';
    const k = this.zoomK;
    wrapper.setAttribute('data-screen', '1');
    wrapper.setAttribute('transform', `${base} scale(${1 / k} ${1 / k})`);
  }

  private refreshScreenScales() {
    const k = this.zoomK;
    this.markerLayer.querySelectorAll<SVGGElement>('g[data-screen="1"]').forEach(wrap => {
      const base = wrap.getAttribute('data-base') || '';
      wrap.setAttribute('transform', `${base} scale(${1 / k} ${1 / k})`);
    });
  }

  private remapMarkerVB<M extends Marker>(
    m: M,
    oldVB: { x: number; y: number; width: number; height: number },
    newVB: { x: number; y: number; width: number; height: number },
    radiusScale: "width" | "height" | "min" | "avg" = "min",
  ): M {
    const sx = newVB.width / oldVB.width;
    const sy = newVB.height / oldVB.height;
    const tx = newVB.x - oldVB.x * sx;
    const ty = newVB.y - oldVB.y * sy;

    const mapX = (x: number) => x * sx + tx;
    const mapY = (y: number) => y * sy + ty;

    const sR = radiusScale === "width" ? sx
      : radiusScale === "height" ? sy
        : radiusScale === "avg" ? (sx + sy) / 2
          : Math.min(sx, sy);

    switch (m.shape) {
      case "circle": return { ...m, x: mapX(m.x), y: mapY(m.y), r: m.r * sR } as M;
      case "square": return { ...m, x: mapX(m.x), y: mapY(m.y), size: m.size * sR } as M;
      case "triangle": return { ...m, x: mapX(m.x), y: mapY(m.y), size: m.size * sR } as M;
      case "rect": return { ...m, x: mapX(m.x), y: mapY(m.y), width: m.width * sx, height: m.height * sy } as M;
      case "polygon": return { ...m, points: m.points.map(p => ({ x: mapX(p.x), y: mapY(p.y) })) } as M;
      case "icon": return { ...m, x: mapX(m.x), y: mapY(m.y), size: m.size * sR } as M;
    }
  }
}