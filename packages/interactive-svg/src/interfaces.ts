/* ===========================
 * InteractiveSVG — Public Types & Interfaces
 * Short, clear comments for humans & LLMs.
 * =========================== */

/* ---------- Core marker model ---------- */

export const NS = "http://www.w3.org/2000/svg";

export type MarkerId = string;                     // Unique id per marker (DB key/UUID)
export type CoordSpace = "pct" | "vb";             // "pct" = 0–100% of viewBox, "vb" = raw viewBox units
export type ScaleMode  = "world" | "screen";       // "world" scales with zoom; "screen" keeps constant on-screen size

/** Shared fields for all markers (pure data, no DOM refs) */
export interface MarkerBase<D = unknown> {
  id: MarkerId;
  shape: "circle" | "square" | "triangle" | "rect" | "polygon" | "icon";
  coordSpace?: CoordSpace;
  scaleMode?: ScaleMode;
  className?: string;
  ariaLabel?: string;
  data?: D;                 // optional user payload (opaque to the lib)
}

/** Circle marker (center + radius) */
export interface CircleMarker<D = unknown> extends MarkerBase<D> {
  shape: "circle";
  x: number; y: number;                            // Center
  r: number;                                       // Radius (pct of width if coordSpace="pct")
}

/** Square marker (center + side) */
export interface SquareMarker<D = unknown> extends MarkerBase<D> {
  shape: "square";
  x: number; y: number;                            // Center
  size: number;                                    // Side (pct of min(vb.w, vb.h) if "pct")
}

/** Triangle marker (equilateral, center + size + orientation) */
export interface TriangleMarker<D = unknown> extends MarkerBase<D> {
  shape: "triangle";
  x: number; y: number;                            // Center
  size: number;                                    // Size (pct of min)
  orientation?: number;                            // Degrees, 0 = +X (default 0)
}

/** Rectangular area marker */
export interface RectMarker<D = unknown> extends MarkerBase<D> {
  shape: "rect";
  x: number; y: number;                            // Anchor
  width: number; height: number;                   // Dimensions
  anchor?: "center" | "top-left";                  // Default: "center"
}

/** Freeform polygon marker (closed) */
export interface PolygonMarker<D = unknown> extends MarkerBase<D> {
  shape: "polygon";
  points: Array<{ x: number; y: number }>;        // Points in CoordSpace units
}

/** Icon marker (<use href="#symbolId"> scaled to size) */
export interface IconMarker<D = unknown> extends MarkerBase<D> {
  shape: "icon";
  x: number; y: number;                            // Anchor (center)
  size: number;                                    // Box size (pct of min if "pct")
  symbolId: string;                                // <symbol id="..."> to reference
}

/** Union of all marker shapes */
export type Marker<D = unknown> =
  | CircleMarker<D> | SquareMarker<D> | TriangleMarker<D>
  | RectMarker<D>   | PolygonMarker<D>| IconMarker<D>;

/* ---------- Events & Records ---------- */

/** Payload for clicks on a marker */
export interface MarkerClick<D = unknown> {
  marker: Marker<D>;
  groupEl: SVGGElement;                            // Wrapper <g data-marker-id="..."> (canonical)
  shapeEl: SVGElement | null;                      // Exact child shape clicked (may be null)
  element: SVGGElement;                            // Back-compat alias of groupEl
  event: MouseEvent;                               // Native event
  vb:  { x: number; y: number };                   // Click in viewBox units
  pct: { x: number; y: number };                   // Click in 0–100% units
}

/** Payload for background SVG clicks */
export interface SvgClick {
  event: MouseEvent;                               // Native event
  vb:  { x: number; y: number };                   // Click in viewBox units
  pct: { x: number; y: number };                   // Click in 0–100% units
}

/** Live handle to a marker (data + element) */
export interface MarkerRecord<D = unknown> {
  id: MarkerId;                                    // Marker id
  readonly marker: Readonly<Marker> | null;        // Latest data (null if removed)
  readonly element: SVGGElement | null;            // Wrapper <g> (null if not mounted)
  shapes?: SVGElement[];                           // Optional snapshot of shapes (if requested)
  remove(): { id: MarkerId; marker: Marker | null; element: SVGGElement | null }; // Remove + return snapshot
}

/* ---------- Getters options ---------- */

export interface GetMarkerOptions {
  includeShapes?: boolean;                         // Also return geometry children
  selector?: string;                               // CSS selector for shapes (default: circle,rect,polygon,path,use)
}

export interface GetMarkersOptions extends GetMarkerOptions {
  strict?: boolean;                                // If true, include nulls for missing ids
}

/* ---------- Serialization options ---------- */

export interface SerializeOpts {
  filename?: string;                               // For downloadSVG only
  preserveZoom?: boolean;                          // Keep current transform (default false)
  stripInternalAttrs?: boolean;                    // Remove library data-* attrs (default true)
  includeStyle?: string | false;                   // Embed <style> content (default false)
}

/* ---------- DOM Adapter (environment abstraction) ---------- */

export interface DomAdapter {
  createElementNS(ns: string, tag: string): Element;                            // Create namespaced element
  createFragment(): DocumentFragment;                                           // Create fragment
  parseSVG(svgText: string): SVGSVGElement;                                     // Parse string to <svg>
  addEvent(el: EventTarget, type: string, fn: EventListenerOrEventListenerObject, opt?: any): void;    // addEventListener
  removeEvent(el: EventTarget, type: string, fn: EventListenerOrEventListenerObject, opt?: any): void; // removeEventListener
  getScreenCTM(el: SVGGraphicsElement): DOMMatrix | null;                       // Screen CTM (null in JSDOM)
  createDOMPoint(x: number, y: number): DOMPoint;                               // DOMPoint factory
  setAttribute(el: Element, name: string, value: string): void;                 // Safe setAttribute
}

/* ---------- Public API of InteractiveSVG (class implements this) ---------- */

/* ---------- Public API (chainable) ---------- */
export interface IInteractiveSVG<D = unknown> {
  readonly svg: SVGSVGElement;
  readonly markers: ReadonlyArray<Marker<D>>;

  loadSVG(svgText: string, opts?: LoadSvgOptions): this;
  clear(): this;

  addMarker(marker: Marker<D>): this;
  addMarkers(markers: Marker<D>[]): this;
  updateMarker(marker: Marker<D>): this;
  removeMarkerById(id: MarkerId): this;
  removeMarker(marker: Marker<D>): this;
  removeMarkers(markers: Marker<D>[]): this;
  clearMarkers(): this;

  getMarker(id: MarkerId, opts?: GetMarkerOptions): MarkerRecord<D> | null;
  getMarkers(ids: MarkerId[], opts?: GetMarkersOptions): (MarkerRecord<D> | null)[];
  getAllMarkers(opts?: GetMarkerOptions): MarkerRecord<D>[];

  getMarkerElement(id: MarkerId): SVGGElement | null;
  getMarkerShapes(id: MarkerId, selector?: string): SVGElement[];
  editMarkers(ids: MarkerId | MarkerId[], fn: (el: SVGGElement, id: MarkerId) => void): this;
  setMarkerClass(ids: MarkerId | MarkerId[], className: string, on?: boolean): this;
  setMarkerAttrs(ids: MarkerId | MarkerId[], attrs: Record<string,string>, selector?: string): this;

  onMarkerClick(cb: (p: MarkerClick<D>) => void): this;
  offMarkerClick(cb: (p: MarkerClick<D>) => void): this;
  onceMarkerClick(cb: (p: MarkerClick<D>) => void): this;

  onSvgClick(cb: (p: SvgClick) => void): this;
  offSvgClick(cb: (p: SvgClick) => void): this;
  onceSvgClick(cb: (p: SvgClick) => void): this;
  offAllListeners(): this;

  setDragging(isDragging: boolean): this;
  setZoomTransform(a:number,b:number,c:number,d:number,e:number,f:number): this;

  clientToSvg(clientX:number, clientY:number): DOMPoint;
  svgToPercent(x:number, y:number): { x:number; y:number };

  toSVGString(opts?: SerializeOpts): string;
  downloadSVG(opts?: SerializeOpts): void;

  destroy(): void;
}

export interface InteractiveSVGConstructorOptions<D = unknown> {
  viewBox?: string;
  adapter?: DomAdapter;
  styleHook?: (shapeEl: SVGElement, marker: Marker<D>) => void; // default: undefined (no-op)
  nonScalingStroke?: boolean;    // default: false
  cursorPointer?: boolean;       // default: false
}

export interface LoadSvgOptions {
  adoptViewBox?: boolean;               // apply incoming viewBox (default true)
  updateMarkers?: "none" | "reflow" | "remap-vb"; // default "reflow"
  radiusScale?: "width" | "height" | "min" | "avg"; // for remap-vb (default "min")
}