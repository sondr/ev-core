import { CgElement, findElement, progressiveImageLoad } from '../dom/utils';
import { _PLATFORM } from '../platform';
import { _CLASSNAMES, _EVENT_ACTIONS, _HTML } from '../constants';
import { Thumbnails } from './thumbnails';
const styleDict = {
    color: { key: 'color', type: 'color', sel: ':before' },
    hover: { key: 'hover', type: 'color', sel: ':hover>i:before' },
    background: { key: 'background', type: 'background', sel: undefined },
    backgroundHover: { key: 'backgroundHover', type: 'background', sel: ':hover' }
};
export class Carousel {
    constructor(gallery, fullScreen) {
        this.running = false;
        this.fullScreen = fullScreen;
        this.gallery = gallery;
        this.btnsEntries = Object.entries(this.gallery.options.Carousel.btns).filter(e => e[1]);
        this.init();
        if (this.gallery.options.Carousel.thumbnails)
            this.activateThumbnails();
    }
    get Element() {
        return this.element;
    }
    get CarouselElement() {
        return this.carouselElement;
    }
    get Thumbnails() {
        this.activateThumbnails();
        return this.thumbnails;
    }
    get Media() {
        return this.gallery.media;
    }
    get getActiveIndex() {
        return this.activeIndex;
    }
    get DescriptionElement() {
        return this.descriptionElement;
    }
    //     public Add_Media(media: IMedia){
    // this.gallery.
    //     }
    activateThumbnails() {
        if (!this.thumbnails)
            this.thumbnails = new Thumbnails(this);
    }
    init() {
        let carouselElement = this.gallery.container.classList.contains(_CLASSNAMES.carousel) ?
            this.gallery.container : findElement(this.gallery.container, `.${_CLASSNAMES.carousel}`); // or create one
        let listelement = carouselElement ? findElement(carouselElement, _HTML.Tags.ul) : undefined;
        let lastTouchStartEvent;
        this.descriptionElement = new CgElement({
            classes: _CLASSNAMES.description,
            //styles: this.gallery.options!.Carousel!.color
        });
        let container = {
            element: carouselElement,
            styles: this.gallery.options.Carousel.padding ? { values: [['padding', this.gallery.options.Carousel.padding]] } : undefined,
            children: [
                {
                    element: listelement, tagName: _HTML.Tags.ul,
                    children: this.gallery.media.map(el => ({
                        element: el.containerElement
                    }))
                },
                this.createButtons(),
                this.descriptionElement
            ],
            eventListeners: [
                {
                    action: _EVENT_ACTIONS.touchStart, handler: event => { lastTouchStartEvent = event; }
                },
                {
                    action: _EVENT_ACTIONS.touchEnd, handler: event => {
                        if (lastTouchStartEvent.touches.length == 1) {
                            const distance = lastTouchStartEvent.changedTouches[0].pageX - event.changedTouches[0].pageX;
                            if (Math.abs(distance) > 75)
                                this.cycle(distance > 0 ? 1 : -1);
                        }
                        lastTouchStartEvent = null;
                    }
                }
            ]
        };
        if (!this.fullScreen) {
            container.eventListeners = container.eventListeners.concat([{
                    action: _EVENT_ACTIONS.mouseEnter, handler: event => {
                        event.stopPropagation();
                        this.buttonContainer.element.classList.remove(_CLASSNAMES.hidden);
                    }
                },
                {
                    action: _EVENT_ACTIONS.mouseLeave, handler: event => {
                        event.stopPropagation();
                        this.buttonContainer.element.classList.add(_CLASSNAMES.hidden);
                    }
                }]);
        }
        else {
            container.eventListeners = container.eventListeners.concat([
                {
                    action: _EVENT_ACTIONS.click, handler: (event) => {
                        if (this.gallery.options.Fullscreen.closeOnClick)
                            this.fullScreen.close();
                    }
                }
            ]);
        }
        container = {
            element: this.gallery.container, children: [container]
        };
        this.element = new CgElement(container);
        this.carouselElement = this.element.children.find(e => e.Element.classList.contains(_CLASSNAMES.carousel));
        if (this.gallery.media.length <= 0)
            return;
        this.activeIndex = this.gallery.media.findIndex(image => image.containerElement.classList.contains(_CLASSNAMES.active));
        //if (this.activeIndex == -1)
        this.set_active(this.activeIndex == -1 ? 0 : this.activeIndex);
        if (this.gallery.options.Carousel.autoplay)
            this.play();
    }
    createButtons() {
        let chevronColorStyles = this.MakeStylesObject({ entries: this.btnsEntries, childs: [styleDict.color.key] });
        let btnStyles = this.MakeStylesObject({ entries: this.btnsEntries, container: [styleDict.background.key], childs: [styleDict.backgroundHover.key, styleDict.hover.key] });
        this.buttonContainer = {
            //classes: `${_CLASSNAMES.btnContainer} ${_CLASSNAMES.hidden}`,
            removeOnDispose: true,
            classes: `${_CLASSNAMES.btnContainer}`,
            children: [
                // LEFT CLICK
                {
                    classes: `${_CLASSNAMES.btn} ${_CLASSNAMES.left}`,
                    eventListeners: [{ action: _EVENT_ACTIONS.click, handler: e => { e.stopPropagation(); this.cycle(-1); } }],
                    styles: btnStyles,
                    children: [{
                            tagName: _HTML.Tags.i, classes: `${_CLASSNAMES.chevron} ${_CLASSNAMES.left}`,
                            styles: chevronColorStyles
                        }]
                },
                // RIGHT CLICK
                {
                    classes: `${_CLASSNAMES.btn} ${_CLASSNAMES.right}`,
                    eventListeners: [{ action: _EVENT_ACTIONS.click, handler: e => { e.stopPropagation(); this.cycle(1); } }],
                    styles: btnStyles,
                    children: [{
                            tagName: _HTML.Tags.i, classes: `${_CLASSNAMES.chevron} ${_CLASSNAMES.right}`,
                            styles: chevronColorStyles
                        }]
                }
            ]
        };
        return this.buttonContainer;
    }
    MakeStylesObject(values) {
        if (!values)
            return undefined;
        values.container = values.container || [];
        values.childs = values.childs || [];
        if (values.container.length == 0 && values.childs.length == 0)
            return undefined;
        //let values = values.entries.filter(e => values)
        const converter = (entry) => {
            const val = styleDict[entry[0]];
            return {
                id: val.sel,
                values: [[val.type, entry[1]]]
            };
        };
        let t = values.entries.filter(e => values.container.includes(e[0])).map(converter)
            .map(e => e.values);
        return {
            values: values.container && values.container.length > 0 ? values.entries.filter(e => values.container.includes(e[0])).map(converter)
                .map(e => e.values)[0] : undefined,
            childValues: values.childs && values.childs.length > 0 ? values.entries.filter(e => values.childs.includes(e[0])).map(converter) : undefined
        };
    }
    togglePlay() {
        if (this.running)
            this.stop();
        else
            this.play();
    }
    play() {
        if (this.running)
            return;
        _PLATFORM.global.clearInterval(this.intervalTimer);
        this.intervalTimer = _PLATFORM.global.setInterval(() => {
            if (!this.gallery.options.Carousel.autoplayRepeat && this.activeIndex == this.gallery.media.length - 1)
                _PLATFORM.global.clearInterval(this.intervalTimer);
            this.cycle(1, true);
        }, this.gallery.options.Carousel.slideInterval);
        this.running = true;
    }
    stop() {
        _PLATFORM.global.clearInterval(this.intervalTimer);
        this.running = false;
    }
    cycle(count, continuePlay) {
        if (this.gallery.media.length <= 0)
            return;
        count = count % this.gallery.media.length;
        let index = this.activeIndex + count;
        if (index >= this.gallery.media.length)
            index -= this.gallery.media.length;
        if (index < 0)
            index += this.gallery.media.length;
        //CALLBACKS
        if (this.gallery.options.Carousel.Events.onCycle)
            this.gallery.options.Carousel.Events.onCycle(index, this.gallery.media[index].element);
        if (this.gallery.options.Carousel.Events.onPrev && count === -1)
            this.gallery.options.Carousel.Events.onPrev(index, this.gallery.media[index].element);
        if (this.gallery.options.Carousel.Events.onNext && count === 1)
            this.gallery.options.Carousel.Events.onNext(index, this.gallery.media[index].element);
        this.set_active(index, continuePlay);
    }
    set_active(index, continuePlay) {
        if (!continuePlay && this.running)
            this.stop(); // stopping loop
        if (index >= this.gallery.media.length)
            return;
        if (this.activeIndex != undefined)
            this.set_inactive(this.activeIndex);
        this.gallery.media[index].containerElement.classList.add(_CLASSNAMES.active);
        progressiveImageLoad(this.gallery.media[index]);
        if (this.fullScreen)
            this.fullScreen.setMediaInfo(this.gallery.media[index], index + 1, this.gallery.media.length, this);
        if (this.thumbnails)
            this.thumbnails.setActive(index, this.activeIndex);
        this.activeIndex = index;
    }
    set_interval(interval) {
        this.gallery.options.Carousel.slideInterval = interval;
        this.restart();
    }
    dispose() {
        //this.buttons.forEach(btnElement => btnElement.dispose());
        this.stop();
        if (this.thumbnails)
            this.thumbnails.dispose();
        if (this.element)
            this.element.dispose();
    }
    restart() {
        this.stop();
        this.play();
    }
    set_inactive(index) {
        if (index >= this.gallery.media.length || index < 0)
            return;
        this.gallery.media[index].containerElement.classList.remove(_CLASSNAMES.active);
    }
    set_all_inactive() {
        this.gallery.media.forEach(img => img.containerElement.classList.remove(_CLASSNAMES.active));
    }
}
//# sourceMappingURL=carousel.js.map