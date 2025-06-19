import { _CLASSNAMES, _EVENT_ACTIONS, _HTML, _TYPES } from '../constants';
import { CgElement, findElement } from '../dom/utils';
export class Thumbnails {
    constructor(carousel) {
        this.active = !!carousel.gallery.options.Carousel.thumbnails;
        this.carousel = carousel;
        this.model = this.init();
    }
    get isActive() {
        return this.active;
    }
    show() {
        this.model.Element.classList.add(_CLASSNAMES.active);
        this.active = true;
    }
    hide() {
        this.model.Element.classList.remove(_CLASSNAMES.active);
        this.active = false;
    }
    toggle() {
        if (this.active)
            this.hide();
        else
            this.show();
        //this.model.Element.classList.toggle(_CLASSNAMES.active);
    }
    init() {
        return new CgElement({
            removeOnDispose: true,
            parentElement: this.carousel.Element.Element,
            classes: `${_CLASSNAMES.thumbnailContainer} ${this.carousel.gallery.options.Carousel.thumbnails ? _CLASSNAMES.active : ''}`, children: [
                // {
                //     classes: `${_CLASSNAMES.btnContainer} ${_CLASSNAMES.left}`, children: [
                //         { classes: `${_CLASSNAMES.chevron} ${_CLASSNAMES.left}` }
                //     ]
                // },
                this.create_thumbnails(),
                // {
                //     classes: `${_CLASSNAMES.btnContainer} ${_CLASSNAMES.right}`, children: [
                //         { classes: `${_CLASSNAMES.chevron} ${_CLASSNAMES.right}` }
                //     ]
                // }
            ]
        });
    }
    setActive(index, lastActiveIndex) {
        if (typeof lastActiveIndex === _TYPES.number)
            this.thumbnailList.children[lastActiveIndex].Element.classList.remove(_CLASSNAMES.active);
        if (typeof index === _TYPES.number)
            this.thumbnailList.children[index].Element.classList.add(_CLASSNAMES.active);
    }
    create_thumbnails() {
        let thumbnailList = {
            //removeOnDispose: true,
            tagName: _HTML.Tags.ul,
            eventListeners: [
                {
                    action: _EVENT_ACTIONS.mouseDown, handler: e => {
                        e.preventDefault();
                        //console.log('mousedown', thumbnailList.element, e);
                    }
                },
                {
                    action: _EVENT_ACTIONS.mouseUp, handler: e => {
                        //console.log('mouseup', thumbnailList.element, e);
                    }
                },
                {
                    action: _EVENT_ACTIONS.touchStart, handler: e => {
                        thumbnailList.element.style.overflowX = 'auto';
                        //console.log('touchmove', thumbnailList.element, e);
                    }
                }
            ],
            children: []
        };
        this.carousel.gallery.media.forEach((item, index) => {
            let imgEl = findElement(item.containerElement, _HTML.Tags.img);
            if (!imgEl)
                return;
            thumbnailList.children.push({
                tagName: _HTML.Tags.li,
                classes: _CLASSNAMES.item, children: [{
                        tagName: _HTML.Tags.img,
                        attr: [
                            [_HTML.Attr.src, imgEl.src],
                            [_HTML.Attr.srcSet, imgEl.srcset],
                            [_HTML.Attr.width, imgEl.width ? String(imgEl.width) : ''],
                            [_HTML.Attr.height, imgEl.height ? String(imgEl.height) : ''],
                            [_HTML.Attr.alt, imgEl.alt],
                        ].filter(e => e[1]),
                        eventListeners: [{ action: _EVENT_ACTIONS.click, handler: e => { this.carousel.set_active(index); } }]
                    }]
            });
        });
        this.thumbnailList = new CgElement(thumbnailList);
        return this.thumbnailList;
    }
    dispose() {
        if (this.model)
            this.model.dispose();
        // const parentEl = this.model.Element.parentElement;
        // if (parentEl) parentEl.removeChild(this.model.Element);
    }
}
//# sourceMappingURL=thumbnails.js.map