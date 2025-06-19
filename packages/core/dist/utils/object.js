export function trimStrings(obj) {
    Object.keys(obj).forEach(key => {
        if (!obj[key]) {
            return;
        }
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].trim();
        }
        else if (typeof obj[key] === 'object') {
            trimStrings(obj[key]);
        }
    });
}
//# sourceMappingURL=object.js.map