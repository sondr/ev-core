import { Fullscreen } from './module/fullscreen';
import { _CLASSNAMES, _EVENT_ACTIONS, _HTML, _TYPES, _DATA_SETS } from './constants';
import { Carousel } from './module/carousel';
import { PLATFORM, _PLATFORM } from './platform';
import { createElement, convertToMediaObjects, findElement, deepObjectAssign, progressiveImageLoad } from './dom/utils';
let galleryId = 1;
;
export class CarGal {
    constructor(config) {
        this.eventListeners = [];
        this.galleries = [];
        PLATFORM.create(config);
        //config.Events
        let instances = this.findGalleries(config);
        this.setup(instances);
    }
    findExternalImages() {
        return Array.from(_PLATFORM.DOM.getElementsByClassName(_CLASSNAMES.externalIncludeImage) || []);
    }
    findGalleries(config) {
        const instanceOptionsExist = config.instances && Array.isArray(config.instances) && config.instances.length > 0;
        let extMedia = this.findExternalImages();
        let galleries = [];
        // options by javascript instances
        if (instanceOptionsExist) {
            galleries = config.instances.map(instance => {
                if (typeof instance.container === _TYPES.string) {
                    instance.containerId = instance.container;
                    instance.container = findElement(_PLATFORM.DOM, instance.container);
                }
                return instance;
            }).filter(e => e.container);
        }
        if (config.autoInit)
            Array.prototype.push.apply(galleries, this.get_autoinit_galleries(galleries.map(g => g.container)));
        // Attach ExternalMedia
        galleries.forEach(g => {
            g.externalMedia = [];
            if (g.container.id)
                g.containerId = g.container.id;
            if (g.containerId) {
                for (let i = extMedia.length - 1; i >= 0; i--) {
                    let externalId = extMedia[i].dataset[_DATA_SETS.external.include];
                    if (externalId != g.containerId)
                        continue;
                    g.externalMedia.unshift(extMedia.splice(i, 1)[0]);
                }
            }
        });
        // Rest of external media push to gallery
        if (extMedia.length > 0) {
            let groupedById = [];
            //let groupedById: any = {};
            extMedia.forEach(media => {
                let id = media.dataset[_DATA_SETS.external.include];
                if (!id)
                    return;
                let group = groupedById.find(e => e.key == id);
                if (group)
                    group.media.push(media);
                else
                    groupedById.push({
                        key: id,
                        media: [media]
                    });
            });
            if (instanceOptionsExist)
                groupedById.forEach(group => {
                    let opts = config.instances.find(e => e.containerId == `#${group.key}`);
                    if (opts)
                        group.options = opts.options;
                });
            if (groupedById.length > 0)
                Array.prototype.push.apply(galleries, groupedById.map(group => ({
                    containerId: group.key,
                    externalMedia: group.media,
                    options: group.options
                })));
        }
        galleries.forEach(g => g.options = deepObjectAssign({ target: _PLATFORM.defaultOptions, sources: [g.options] }));
        // console.log(galleries);
        // console.log(extMedia);
        return galleries;
    }
    get_autoinit_galleries(excludeContainers = []) {
        let galleries = Array.from(_PLATFORM.DOM.getElementsByClassName(_CLASSNAMES.carouselContainer) || [])
            .filter(e => !excludeContainers.some(f => f === e)); // .includes(e));
        return galleries.map(containerElement => {
            return {
                container: containerElement,
                //options: JSON.parse(JSON.stringify(_PLATFORM.defaultOptions))
            };
        });
    }
    get_dataset_options(containerElement) {
        let opts = {
            enableFullScreen: false
        };
        return opts;
    }
    setup(instances) {
        if (!instances || instances.length <= 0)
            return;
        this.galleries = instances.map(instance => {
            let gallery = {
                id: galleryId++,
                options: instance.options,
                container: instance.container,
                media: instance.container ?
                    convertToMediaObjects(Array.from(instance.container.getElementsByClassName(_CLASSNAMES.item) || [])) :
                    [],
                externalMedia: convertToMediaObjects(instance.externalMedia.map(media => {
                    const removeFromDom = !!media.dataset[_DATA_SETS.external.removeFromDOM];
                    let element = removeFromDom ? media : media.cloneNode(true);
                    if (element.classList.contains(_CLASSNAMES.item))
                        return removeFromDom ? element : [element, media];
                    let wrapper = createElement({
                        elementTagOrElement: _HTML.Tags.li,
                        classes: _CLASSNAMES.item
                    });
                    wrapper.appendChild(element);
                    return removeFromDom ? wrapper : [wrapper, media];
                }))
            };
            instance.instance = gallery;
            //console.log("Media Sizes: ", gallery.media.filter(m => m.sizes));
            return gallery;
        });
        this.galleries.forEach((gallery, index) => {
            if (gallery.container)
                gallery.Carousel = new Carousel(gallery);
            if (gallery.options.enableFullScreen || !gallery.container)
                gallery.Fullscreen = new Fullscreen(gallery);
            this.attachGalleryEventListeners(gallery, index);
        });
        //building dyamic stylesheet
        _PLATFORM.styleSheet.buildSheet();
        this.attachGlobalEventListeners();
        if (_PLATFORM.configEvents.onLoaded)
            _PLATFORM.configEvents.onLoaded();
    }
    attachGlobalEventListeners() {
        let resizeEvent = {
            action: _EVENT_ACTIONS.resize, vars: {}, handler: (event) => {
                _PLATFORM.global.clearTimeout(resizeEvent.vars.timer);
                resizeEvent.vars.timer = _PLATFORM.global.setTimeout(() => {
                    this.updateGalleryImageSizes(event);
                }, 150);
            }
        };
        let keyboardEvent = {
            action: _EVENT_ACTIONS.keyup, vars: {}, handler: (event) => {
                if (!_PLATFORM.overlay.isActive || typeof this.fullscreenGalleryindex !== _TYPES.number)
                    return;
                let cycle;
                switch (event.keyCode) {
                    case 8:
                    case 27:
                        //_PLATFORM.overlay.close();
                        this.galleries[this.fullscreenGalleryindex].Fullscreen.close();
                        break;
                    case 37:
                        cycle = -1;
                        break;
                    case 39:
                        cycle = 1;
                        break;
                }
                if (cycle)
                    this.galleries[this.fullscreenGalleryindex].Fullscreen.Carousel.cycle(cycle);
            }
        };
        // let popstate: IEventListenerObject;
        // if (((window || {}).history || {}).pushState)
        //     popstate = {
        //         action: _EVENT_ACTIONS.popstate, vars: {}, options: false, handler: (event: Event) => {
        //             console.log("popstate pushed", event);
        //             window.history.pushState(null, <any>null, window.location.pathname);
        //             if (!_PLATFORM.overlay.isActive || typeof this.fullscreenGalleryindex !== _TYPES.number) return;
        //             event.stopPropagation(); event.preventDefault();
        //             _PLATFORM.overlay.close();
        //         }
        //     };
        this.eventListeners = [resizeEvent, keyboardEvent];
        this.eventListeners.forEach(el => {
            _PLATFORM.global.addEventListener(el.action, el.handler, el.options);
        });
    }
    updateGalleryImageSizes(e) {
        // let media: IMedia[] = Array.prototype.concat(...this.galleries.map(g =>
        //     [...(g.media || []), ...(g.externalMedia || []), ...((g.Fullscreen! || []).Media || [])]))
        //     .filter((e: IMedia) => e.sizes);
        // console.log(media);
        this.galleries.forEach(g => {
            [g.Carousel, (g.Fullscreen || {}).Carousel].filter(e => e).forEach(c => progressiveImageLoad(c.Media[c.getActiveIndex]));
        });
    }
    attachGalleryEventListeners(gallery, galleryIndex) {
        const imgCount = gallery.media.length;
        //gallery.container.addEventListener('click', (event) => gallery.Carousel!.togglePlay());
        //gallery.container.addEventListener('click', (event) => gallery.Fullscreen!.show(event));
        gallery.media.forEach((img, index) => {
            img.handler = () => {
                if (gallery.Carousel)
                    gallery.Carousel.stop();
                gallery.Fullscreen.show(index);
                this.fullscreenGalleryindex = galleryIndex;
            };
            img.containerElement.addEventListener(_EVENT_ACTIONS.click, img.handler);
        });
        gallery.externalMedia.filter(img => img.origin).forEach((img, index) => {
            img.handler = () => {
                gallery.Fullscreen.show(imgCount + index);
                this.fullscreenGalleryindex = galleryIndex;
            };
            img.origin.addEventListener(_EVENT_ACTIONS.click, img.handler);
        });
    }
    detachEventListeners(gallery) {
        if (gallery.media)
            gallery.media
                .forEach(m => m.containerElement.removeEventListener(_EVENT_ACTIONS.click, m.handler));
        if (gallery.externalMedia)
            gallery.externalMedia.filter(e => e.origin)
                .forEach(m => m.origin.removeEventListener(_EVENT_ACTIONS.click, m.handler));
    }
    //clickEL()
    dispose() {
        this.eventListeners.forEach(el => {
            _PLATFORM.global.removeEventListener(el.action, el.handler, el.options);
        });
        this.eventListeners = [];
        this.galleries.forEach(gallery => {
            this.detachEventListeners(gallery);
            if (gallery.Carousel)
                gallery.Carousel.dispose();
            if (gallery.Fullscreen)
                gallery.Fullscreen.dispose();
        });
        _PLATFORM.dispose();
        this.galleries = [];
        galleryId = 1;
    }
}
//# sourceMappingURL=car-gal.js.map