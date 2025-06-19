import { _CLASSNAMES, _EVENT_ACTIONS, _HTML } from './../constants';
import { _PLATFORM } from './../platform';
import { CgElement } from './utils';
export class MenuBar {
    constructor(container) {
        this.element = this.create_element();
        //console.log("menubar: 0", this.element);
        if (container)
            container.appendChild(this.element);
    }
    get Element() {
        return this.element;
    }
    set_fixed(value) {
        if (value)
            this.element.Element.classList.add(_CLASSNAMES.fixed);
        else
            this.element.Element.classList.remove(_CLASSNAMES.fixed);
    }
    dispose() {
        this.element.dispose();
    }
    create_element() {
        return new CgElement({
            classes: _CLASSNAMES.fullscreenMenuBar, children: [
                {
                    classes: _CLASSNAMES.fullscreenMenuBarIndicator, textContent: ''
                },
                {
                    tagName: _HTML.Tags.p, classes: _CLASSNAMES.fullscreenMenuBarTitle, textContent: ''
                },
                {
                    classes: _CLASSNAMES.fullscreenMenuBarBtnGroup, tagName: _HTML.Tags.ul, children: [
                        // BUTTONS:
                        {
                            classes: _CLASSNAMES.fullscreenMenuBarBtn, tagName: _HTML.Tags.li, eventListeners: [{
                                    action: _EVENT_ACTIONS.click, handler: (event) => {
                                        _PLATFORM.overlay.close();
                                    }
                                }], children: [{ tagName: _HTML.Tags.i, classes: 'fas fa-th' }]
                            //}], children: [{ tagName: _HTML.Tags.i, classes: _CLASSNAMES.iconTiles }]
                        },
                        {
                            classes: _CLASSNAMES.fullscreenMenuBarBtn, tagName: _HTML.Tags.li, eventListeners: [{
                                    action: _EVENT_ACTIONS.click, handler: (event) => { _PLATFORM.overlay.close(); }
                                }], children: [{ tagName: _HTML.Tags.i, classes: 'fas times' }]
                            //}], children: [{ tagName: _HTML.Tags.i, classes: _CLASSNAMES.iconClose }]
                        }
                    ]
                }
            ]
        });
    }
}
//# sourceMappingURL=menu-bar.js.map