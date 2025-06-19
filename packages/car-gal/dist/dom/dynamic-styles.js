import { createElement, loadResource } from './utils';
const prependText = "cg-dyn";
export class DynamicStyle {
    constructor() {
        this.counter = 1;
        this.variables = [];
        this.attached = false;
        this.styleSheet = createElement({
            elementTagOrElement: 'style',
            attr: [
                ['type', 'text/css'],
                ['rel', 'stylesheet']
            ]
        });
        this.disposed = false;
    }
    get isDisposed() {
        return this.disposed;
    }
    appendStyle(styles) {
        if (!styles)
            return undefined;
        const name = prependText + this.counter++;
        if (!styles.values)
            styles.values = [];
        if (!styles.childValues)
            styles.childValues = [];
        this.variables.push({
            id: name,
            value: styles.values.filter(s => s.length === 2).map(s => `${s[0]}:${s[1].replace(';', '') + '!important;'}`).join(' '),
            childValues: styles.childValues.filter(e => e.id && e.values && e.values.length > 0).map(child => {
                return {
                    id: typeof child.id === 'string' ? `${name}${child.id}` : child.id.map(c => `${name}${c}`).join(', .'),
                    value: child.values.filter(e => e.length === 2).map(v => `${v[0]}:${v[1].replace(';', '') + '!important;'}`).join(' ')
                };
            })
        });
        return name;
    }
    overWriteStyle(selector, styles) {
    }
    findStyle(classString) {
    }
    buildSheet() {
        let sheetText = this.variables.map(v => {
            let s = '';
            if (v.childValues && v.childValues.length > 0)
                s = v.childValues.map(c => ` .${c.id}{${c.value}}`).join(' ');
            return `.${v.id}{${v.value}}${s}`;
        }).join(' ');
        this.styleSheet.innerText = sheetText;
        if (!this.attached)
            this.attachStylesheet();
    }
    attachStylesheet() {
        if (this.styleSheet)
            this.attached = !!loadResource(this.styleSheet);
    }
    dispose() {
        if (this.styleSheet && this.styleSheet.parentElement)
            this.styleSheet.parentElement.removeChild(this.styleSheet);
        //_PLATFORM.DOM.head.removeChild(this.styleSheet);
        this.styleSheet = undefined;
        this.disposed = true;
    }
}
//# sourceMappingURL=dynamic-styles.js.map