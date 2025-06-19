export class FileinputCall {
    constructor(doc = document) {
        this.doc = doc;
        this.el = null;
    }
    call(opts) {
        this.init(opts);
        return new Promise((resolve) => {
            this.el.onchange = () => {
                const files = this.el.files;
                this.destroy(); // Clean up after selection
                resolve(files);
            };
            this.el.click();
        });
    }
    init(opts) {
        this.destroy();
        this.el = this.doc.createElement('input');
        this.el.type = 'file';
        // Hide the input element
        this.el.style.display = 'none';
        // Append to the document to ensure the file picker works in all browsers
        this.doc.body.appendChild(this.el);
        // Allowed options for the file input element
        const allowedOptions = [
            'multiple',
            'accept',
            'capture',
            'webkitdirectory',
        ];
        if (opts) {
            allowedOptions.forEach((key) => {
                if (opts[key] !== undefined) {
                    this.el[key] = opts[key];
                }
            });
        }
    }
    destroy() {
        if (this.el && this.el.parentElement) {
            this.el.parentElement.removeChild(this.el);
            this.el = null;
        }
    }
}
export function saveAs(blob, filename, globalWindow = window) {
    const a = globalWindow.document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    a.download = filename;
    a.rel = 'noopener';
    a.href = globalWindow.URL.createObjectURL(blob);
    const timeout = 40 * 1000;
    globalWindow.setTimeout(() => URL.revokeObjectURL(a.href), timeout);
    globalWindow.setTimeout(() => a.click(), 0);
}
//# sourceMappingURL=file.js.map