export function addAttrs(el, attrs) {
    if (el && attrs) {
        Object.keys(attrs).forEach(k => {
            el.setAttribute(k, attrs[k]);
        });
    }
}
export function removeAttrs(el, attrs) {
    if (el && attrs) {
        Object.keys(attrs).forEach(k => {
            el.removeAttribute(k);
        });
    }
}
//# sourceMappingURL=element-attributer.js.map