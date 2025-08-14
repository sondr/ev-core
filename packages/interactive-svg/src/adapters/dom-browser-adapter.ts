import { DomAdapter } from "../interfaces";

export class BrowserDomAdapter implements DomAdapter {
  createElementNS(ns: string, tag: string) { return document.createElementNS(ns, tag); }
  createFragment() { return document.createDocumentFragment(); }
  parseSVG(svgText: string) {
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    return doc.documentElement as unknown as SVGSVGElement;
  }
  addEvent(el: EventTarget, type: string, fn: any, opt?: any) { el.addEventListener(type, fn, opt); }
  removeEvent(el: EventTarget, type: string, fn: any, opt?: any) { el.removeEventListener(type, fn, opt); }
  getScreenCTM(el: SVGGraphicsElement) { return el.getScreenCTM(); }
  createDOMPoint(x: number, y: number) { return new DOMPoint(x, y); }
  setAttribute(el: Element, name: string, value: string) { el.setAttribute(name, value); }
}