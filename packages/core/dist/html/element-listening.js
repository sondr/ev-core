export function removeEventListeners(el, events) {
    if (el && events?.length) {
        events.forEach(e => {
            el?.removeEventListener(e.key, e.event, e.options);
        });
    }
}
export function addEventListeners(el, events) {
    if (el && events?.length) {
        events.forEach(e => el.addEventListener(e.key, e.event, e.options));
    }
}
//# sourceMappingURL=element-listening.js.map