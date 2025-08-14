
// Minimal JSDOM-friendly adapter (layout-free). getScreenCTM often returns null;

import { BrowserDomAdapter } from "./dom-browser-adapter";

// we fall back to the current zoom matrix (identity unless you call setZoomTransform).
export class JsdomAdapter extends BrowserDomAdapter {
  getScreenCTM(el: SVGGraphicsElement) {
    try { return super.getScreenCTM(el); } catch { return null; }
  }
}