export function dateParse(value) {
    if (value == undefined) {
        return undefined;
    }
    if (value instanceof Date) {
        return value;
    }
    if (typeof value == 'string') {
        if (value.toLowerCase() == 'today') {
            return new Date();
        }
        let v = new Date(String(value));
        if (isValidDate(v)) {
            return v;
        }
    }
    let number = Number.parseInt(String(value));
    if (Number.isInteger(number)) {
        const d = new Date();
        d.setDate(d.getDate() + number);
        return d;
    }
    return undefined;
}
function isValidDate(date) {
    try {
        return Number.isInteger(date.getTime());
    }
    catch (e) {
        return false;
    }
}
//# sourceMappingURL=date.js.map