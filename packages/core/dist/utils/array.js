export function groupBy(arr, fn) {
    return arr.reduce((prev, curr) => {
        const groupKey = fn(curr);
        prev[groupKey] = prev[groupKey] || [];
        prev[groupKey].push(curr);
        return prev;
    }, {});
}
//# sourceMappingURL=array.js.map