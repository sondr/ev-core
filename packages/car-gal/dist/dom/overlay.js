import { _PLATFORM } from '../platform';
import { _CLASSNAMES, _EVENT_ACTIONS } from '../constants';
import { CgElement } from './utils';
export class Overlay {
    constructor() {
        this.active = false;
        this.element = new CgElement({
            parentElement: _PLATFORM.container,
            classes: _CLASSNAMES.overlay
        });
        this.initialClasses = this.element.Element.className.substr(0);
        //this.append_overlay();
        this.disposed = false;
    }
    get isActive() {
        return this.active;
    }
    get Container() {
        return this.element;
    }
    get isDisposed() {
        return this.disposed;
    }
    show(fullscreenElement, overlayClass) {
        this.element.Element.className = this.initialClasses + (overlayClass ? ` ${overlayClass}` : '');
        if (this.lastActiveElement)
            this.element.Element.removeChild(this.lastActiveElement);
        this.element.Element.appendChild(fullscreenElement);
        this.lastActiveElement = fullscreenElement;
        this.element.Element.classList.add(_CLASSNAMES.active);
        this.prevent_scroll();
        this.active = true;
    }
    close() {
        this.element.Element.classList.remove(_CLASSNAMES.active);
        this.element.Element.style.background = '';
        this.allow_scroll();
        this.active = false;
    }
    remove_fullscreen_element(fullscreenElement) {
        this.element.Element.removeChild(fullscreenElement);
    }
    dispose() {
        //console.log("disposing OVERLATY");
        this.active = false;
        this.allow_scroll();
        this.remove_overlay();
        this.disposed = true;
    }
    remove_overlay() {
        if (this.element.Element && this.element.Element.parentElement == _PLATFORM.container)
            _PLATFORM.container.removeChild(this.element.Element);
    }
    prevent_scroll() {
        _PLATFORM.DOM.body.classList.add(_CLASSNAMES.preventScroll);
        _PLATFORM.global.addEventListener(_EVENT_ACTIONS.touchMove, e => e.preventDefault);
    }
    allow_scroll() {
        _PLATFORM.DOM.body.classList.remove(_CLASSNAMES.preventScroll);
        _PLATFORM.global.removeEventListener(_EVENT_ACTIONS.touchMove, e => e.preventDefault);
    }
}
//# sourceMappingURL=overlay.js.map