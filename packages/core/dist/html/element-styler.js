export function addStyles(el, css) {
    if (el && css) {
        Object.keys(css).forEach(k => {
            el.style[k] = css[k];
        });
    }
}
export function removeStyles(el, css) {
    if (el && css) {
        Object.keys(css).forEach(k => {
            el.style[k] = undefined;
        });
    }
}
//# sourceMappingURL=element-styler.js.map