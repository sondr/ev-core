export const kebabize = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase());

export function trimWhiteSpace(s: string, allOccurences: boolean = true) {
    return s.replace(new RegExp('\\s', allOccurences ? 'g' : undefined), "");
}