export function urlCombine(...parts) {
    return parts.join("/").replace(/([^:]\/)\/+/g, "$1");
}
//# sourceMappingURL=url.js.map