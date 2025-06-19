class MimeType {
    constructor(type, exts) {
        this.type = type;
        this.exts = exts;
    }
}
class MimeGroup {
    constructor(name, types) {
        this.name = name;
        this.types = types;
    }
    findExtension(type) {
        return this.types.find(e => e.type == type)?.exts?.find(e => e);
    }
    findExtensions(type) {
        return this.types.find(e => e.type == type)?.exts;
    }
    findType(extension) {
        return this.types.find(t => t.exts.some(e => e == extension))?.type;
    }
}
export const imageMimeTypes = [
    new MimeType('image/gif', ['gif']),
    new MimeType('image/jpeg', ['jpeg', 'jpg']),
    new MimeType('image/png', ['png']),
    new MimeType('image/apng', ['apng']),
    new MimeType('image/tiff', ['tif', 'tiff']),
    new MimeType('image/vnd.wap.wbmp', ['wbmp']),
    new MimeType('image/x-icon', ['ico']),
    new MimeType('image/x-jng', ['jng']),
    new MimeType('image/x-ms-bmp', ['bmp']),
    new MimeType('image/svg+xml', ['svg']),
    new MimeType('image/webp', ['webp']),
    new MimeType('image/avif', ['avif'])
];
class MimeFinder {
    constructor() {
        this.image = new MimeGroup('image', imageMimeTypes);
    }
    findExtension(type) {
        return [this.image]
            .find(x => x.findExtension(type));
    }
    findExtensions(type) {
        return [this.image]
            .find(x => x.findExtensions(type));
    }
    findType(type) {
        return [this.image]
            .find(x => x.findType(type));
    }
}
export const mimes = new MimeFinder();
//# sourceMappingURL=mime-types.js.map