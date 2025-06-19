import { _DATA_SETS } from '../constants';
import { _PLATFORM } from '../platform';
import { _HTML } from '../constants';
//export function createElement(elementTagOrElement: string | HTMLElement, classes: string, textContent?: string, attr?: string[][]) {
export function createElement(createObject) {
    let element = typeof createObject.elementTagOrElement === 'string' ? _PLATFORM.DOM.createElement(createObject.elementTagOrElement) : createObject.elementTagOrElement;
    if (createObject.classes)
        element.className += `${createObject.classes}`;
    if (createObject.textContent)
        element.textContent = createObject.textContent;
    if (createObject.attr && Array.isArray(createObject.attr))
        createObject.attr.forEach(a => element.setAttribute(a[0], a[1]));
    return element;
}
export function convertToMediaObjects(elements) {
    return elements.map(convertToMediaObject);
}
export function convertToMediaObject(element) {
    const origin = Array.isArray(element) ? element[1] : undefined;
    const e = origin ? element[0] : element;
    //console.log("Dataset: ", element.dataset);
    const mediaElement = findElement(e, _HTML.Tags.img);
    return {
        origin: origin,
        containerElement: e,
        element: mediaElement,
        title: origin ? origin.dataset[_DATA_SETS.item.title] : e.dataset[_DATA_SETS.item.title],
        description: origin ? origin.dataset[_DATA_SETS.item.description] : e.dataset[_DATA_SETS.item.description],
        sizes: getImageSrcSet(mediaElement)
    };
}
export function getImageSrcSet(element) {
    let srcset;
    if (!element || !(srcset = element.dataset[_DATA_SETS.img.srcset]))
        return undefined;
    try {
        //element.rem
        return srcset
            .replace(/(?:\r\n|\r|\n)/g, ' ').replace(/ +(?= )/g, '').split(',')
            .map(srcs => {
            const splitted = srcs.trim().split(' ');
            return { w: Number.parseInt(splitted[1]), src: splitted[0] };
        }).sort((a, b) => a.w - b.w);
    }
    catch (e) {
        //console.log(e);
        return undefined;
    }
}
export class CgElement {
    constructor(opts) {
        if (!opts.tagName)
            opts.tagName = _HTML.Tags.div;
        this.parentElement = opts.parentElement;
        this.options = opts;
        if (this.options.styles) {
            const dynamicStyleClass = _PLATFORM.styleSheet.appendStyle(this.options.styles);
            if (!this.options.classes)
                this.options.classes = '';
            this.options.classes += ` ${dynamicStyleClass}`;
        }
        this.element = createElement({
            elementTagOrElement: opts.element || opts.tagName,
            classes: this.options.classes,
            textContent: this.options.textContent,
            attr: this.options.attr,
            //styles:opts!.styles
        });
        //if (!opts!.element)
        opts.element = this.element;
        this.children = this.mapChildren(opts.children);
        this.init();
    }
    get Element() {
        return this.element;
    }
    setParent(parent) {
        if (!parent)
            return;
        this.parentElement = parent;
        if (parent)
            parent.appendChild(this.element);
    }
    init() {
        if (this.options.eventListeners && this.options.eventListeners.length > 0) {
            this.options.eventListeners.forEach(el => {
                // if action passive listener el.action == 
                this.element.addEventListener(el.action, el.handler);
            });
        }
        this.setParent(this.parentElement);
    }
    mapChildren(children) {
        if (!children || !Array.isArray(children))
            return [];
        return children.map(child => {
            return this.appendChild(child);
        });
    }
    appendChild(child) {
        if (child instanceof CgElement) {
            if (!child.parentElement)
                child.setParent(this.element);
            return child;
        }
        child.parentElement = this.element;
        return new CgElement(child);
    }
    dispose(removeFromParent) {
        if (this.children && Array.isArray(this.children))
            this.children.forEach(child => {
                child.dispose(this.options.removeOnDispose);
                // if (child.element.parentElement == this.element)
                //     this.element.removeChild(child.element);
            });
        if (!this.options.eventListeners || this.options.eventListeners.length <= 0)
            return;
        this.options.eventListeners.forEach(el => this.element.removeEventListener(el.action, el.handler));
        //console.log(this.options.removeOnDispose, this.element);
        if ((removeFromParent === true || this.options.removeOnDispose) && this.parentElement)
            this.parentElement.removeChild(this.element);
    }
}
export function findElement(DOM, query) {
    let element = null;
    query = query.trim();
    try {
        if (query.split(" ").length == 1)
            switch (query.substr(0, 1)) {
                case '#':
                    element = DOM.getElementById ? DOM.getElementById(query.substr(1)) : DOM.querySelector(query);
                    break;
                case '.':
                    element = DOM.getElementsByClassName(query.substr(1)).item(0);
                    break;
                default:
                    element = DOM.getElementsByTagName(query).item(0);
                    break;
            }
        else
            element = DOM.querySelector(query);
    }
    catch (err) {
        console.log(err);
    }
    return element;
}
export function progressiveImageLoad(media) {
    if (!media || !media.sizes)
        return;
    // Make virtual cachce and check if img already there.
    let containerSize = { w: media.containerElement.offsetWidth, h: media.containerElement.clientHeight };
    const img = findElement(media.containerElement, _HTML.Tags.img);
    let sizeIndex = media.sizes.findIndex(e => e.w >= containerSize.w);
    if (sizeIndex === -1)
        sizeIndex = media.sizes.length - 1;
    if (media.currentSizeIndex && media.currentSizeIndex >= sizeIndex)
        return;
    if (img && img.src != media.sizes[sizeIndex].src) {
        media.currentSizeIndex = sizeIndex;
        //_PLATFORM.global.setTimeout(() => {
        img.src = media.sizes[sizeIndex].src;
        //}, 50);
    }
}
export function deepObjectAssign(o) {
    if (!o.sources.length)
        return o.target;
    const source = o.sources.shift();
    if (source === undefined)
        return o.target;
    if (isMergebleObject(o.target) && isMergebleObject(source)) {
        Object.keys(source).forEach((key) => {
            if (o.skipKeys && o.skipKeys.includes(key))
                return;
            if (isMergebleObject(source[key])) {
                if (!o.target[key])
                    o.target[key] = {};
                deepObjectAssign({ target: o.target[key], sources: [source[key]] });
            }
            else
                o.target[key] = source[key];
        });
    }
    return deepObjectAssign(o);
}
;
export function isObject(item) {
    return item !== null && typeof item === 'object';
}
;
export function isMergebleObject(item) {
    return isObject(item) && !Array.isArray(item);
}
;
export function getYoutubeImg(id, quality) {
    let resolutions = ['hq', 'sd', 'maxres'];
    if (typeof quality != 'number')
        quality = 1;
    else if (quality < 0)
        quality = 0;
    else if (quality > resolutions.length - 1)
        quality = resolutions.length - 1;
    return `https://img.youtube.com/vi/${id}/${resolutions[quality]}default.jpg`;
}
export function loadResource(element) {
    try {
        if (_PLATFORM.DOM && _PLATFORM.DOM.head)
            _PLATFORM.DOM.head.appendChild(element);
        return element;
    }
    catch (e) {
        //console.error('Couldnt load resource', element);
        return undefined;
    }
    //let script = createElement({ elementTagOrElement: 'script', attr: [['src', uri]] });
    //let script = _PLATFORM.DOM.createElement('script') as HTMLScriptElement;
    //script.src = 'https://www.youtube.com/player_api'
    //Find_Element(_PLATFORM.DOM, 'script')
}
//# sourceMappingURL=utils.js.map