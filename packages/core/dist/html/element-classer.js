export function removeClasses(el, classes) {
    if (el && classes?.length) {
        let list = typeof classes == 'string' ? classes.split(' ') : classes;
        el.classList.remove(...list);
    }
}
export function addClasses(el, classes) {
    if (el && classes?.length) {
        let list = typeof classes == 'string' ? classes.split(' ') : classes;
        el.classList.add(...list);
    }
}
//# sourceMappingURL=element-classer.js.map