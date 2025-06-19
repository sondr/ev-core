import { addAttrs, removeAttrs } from "./element-attributer";
import { addClasses, removeClasses } from "./element-classer";
import { addEventListeners, removeEventListeners } from "./element-listening";
import { addStyles, removeStyles } from "./element-styler";
export class ElementManager {
    get counter() { return this._counter; }
    constructor(args) {
        this._counter = 0;
        this.setProperties(args);
    }
    setProperties(args) {
        this.el = args.el;
        this.css = args.css ?? {};
        this.classes = args?.classes ?? [];
        this.attrs = args?.attrs ?? {};
        this.data = args?.data;
    }
    get mutableProperties() {
        return {
            el: this.el,
            attrs: this.attrs,
            classes: this.classes,
            css: this.css,
            listeners: this.listeners,
            data: this.data,
        };
    }
    ;
    get properties() {
        return {
            attrs: Object.assign({}, this.attrs ?? {}),
            classes: this.classes?.slice() ?? [],
            css: Object.assign({}, this.css ?? {}),
            data: this.data
        };
    }
    setElement(el, cleanPrevious = true) {
        if (cleanPrevious) {
            this.remove();
        }
        this.el = el;
    }
    apply(cb, cleanPrevious = true) {
        let current = this.mutableProperties;
        if (cb) {
            cb(current);
        }
        if (cleanPrevious) {
            this.remove();
        }
        this.setProperties(current);
        this
            .applyListeners()
            .applyClass()
            .applyCss()
            .applyAttrs()
            .count();
        return this;
    }
    count() {
        this._counter++;
        return this;
    }
    remove() {
        return this
            .removeListeners()
            .removeClass()
            .removeCss()
            .removeAttrs();
    }
    dispose() {
        this.removeListeners();
        this.setProperties({
            el: undefined,
            attrs: {},
            classes: [],
            css: {},
            listeners: []
        });
    }
    removeListeners() {
        removeEventListeners(this.el, this.listeners);
        return this;
    }
    removeClass() {
        removeClasses(this.el, this.classes);
        return this;
    }
    removeCss() {
        removeStyles(this.el, this.css);
        return this;
    }
    removeAttrs() {
        removeAttrs(this.el, this.attrs);
        return this;
    }
    applyListeners() {
        addEventListeners(this.el, this.listeners);
        return this;
    }
    applyClass() {
        addClasses(this.el, this.classes);
        return this;
    }
    applyCss() {
        addStyles(this.el, this.css);
        return this;
    }
    applyAttrs() {
        addAttrs(this.el, this.attrs);
        return this;
    }
}
ElementManager.create = (args) => new ElementManager(args);
//# sourceMappingURL=element-manager.js.map