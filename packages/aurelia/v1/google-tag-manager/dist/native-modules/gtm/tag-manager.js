import { resolve } from 'aurelia-dependency-injection';
import { PLATFORM, DOM } from 'aurelia-pal';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as LogManager from 'aurelia-logging';
import { Configure } from './configure';
export class TagManager {
    constructor() {
        this.ea = resolve(EventAggregator);
        this.settings = resolve(Configure);
        this.subscriptions = { pageTracker: undefined };
        this.flags = { scriptsAttached: false };
        this.initialized = false;
        this.logger = LogManager.getLogger('gtm-plugin');
    }
    init(initData) {
        let data = this.settings.options(initData);
        this.options = data;
        this.setup();
    }
    dispatchDataLayerEvent(event) {
        this.ensureDataLayer();
        this.dataLayer.push(event);
    }
    enable() {
        this.options.enabled = true;
        this.setup();
        if (this.options.trackCurrentPageOnEnable)
            this.trackPage(PLATFORM.global.location.pathname, DOM.title);
    }
    disable() {
        this.options.enabled = false;
        if (this.subscriptions.pageTracker)
            this.subscriptions.pageTracker.dispose();
        this.detachScripts();
        if (this.options.logging.enabled)
            this.log('info', 'Tag-Manager disabled');
    }
    isActive() {
        return this.options.enabled === true;
    }
    getKey() {
        return this.options.key;
    }
    setup() {
        if (!this.checkSettings(this.options))
            return;
        if (!this.flags.scriptsAttached)
            this.attachScriptElements(this.options.key);
        if (this.options.pageTracking.enabled === true)
            this.attachPageTracker();
        this.initialized = true;
        if (this.options.logging.enabled)
            this.log('info', 'Tag-Manager started');
    }
    checkSettings(opts) {
        let valid = true, logtext = '', level = 'info';
        if (opts.enabled !== true) {
            logtext = 'tag-manager plugin is disabled';
            valid = false;
        }
        else if (!opts.key || typeof opts.key !== 'string') {
            logtext = 'Missing key parameter for tag-manager plugin';
            valid = false;
            level = 'warn';
        }
        if (opts.logging.enabled)
            this.log(level, logtext);
        return valid;
    }
    attachScriptElements(key) {
        let asyncDefer = [
            this.options.async ? 'j.async=true;' : '', this.options.defer ? 'j.defer=true;' : ''
        ].join('');
        if (!this.scriptElement) {
            const scriptElement = DOM.createElement('script');
            scriptElement.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],` +
                `j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';${asyncDefer}j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);` +
                `})(window,document,'script','dataLayer','${key}');`;
            this.scriptElement = scriptElement;
            DOM.querySelector('head').appendChild(this.scriptElement);
        }
        if (!this.noScriptElement) {
            const noscriptElement = DOM.createElement('noscript');
            const iframeElement = DOM.createElement('iframe');
            iframeElement.height = '0';
            iframeElement.width = '0';
            iframeElement.style.display = 'none';
            iframeElement.style.visibility = 'hidden';
            iframeElement.src = `https://www.googletagmanager.com/ns.html?id=${key}`;
            noscriptElement.appendChild(iframeElement);
            this.noScriptElement = noscriptElement;
            const body = DOM.querySelector('body');
            body.insertBefore(this.noScriptElement, body.firstChild);
        }
        this.flags.scriptsAttached = true;
        this.ensureDataLayer();
    }
    detachScripts() {
        [this.noScriptElement, this.scriptElement].forEach(el => {
            if (el) {
                const parent = el.parentNode;
                if (parent)
                    parent.removeChild(el);
                el = undefined;
            }
        });
    }
    attachPageTracker() {
        if (this.settings)
            this.subscriptions.pageTracker = this.ea.subscribe('router:navigation:success', (data) => {
                if (this.options.resetDatalayerOnPageChange)
                    this.resetDataLayer();
                this.trackPage(data.instruction.fragment, data.instruction.config.title);
            });
    }
    resetDataLayer() {
        const gtm = PLATFORM.global.google_tag_manager[this.options.key];
        if (gtm && gtm.dataLayer && typeof gtm.dataLayer.reset === 'function')
            gtm.dataLayer.reset();
    }
    log(level, message) {
        if (!this.options.logging)
            return;
        this.logger[level](message);
    }
    trackPage(path, title) {
        this.log('debug', `Tracking path = ${path}, title = ${title}`);
        if (!this.initialized) {
            this.log('warn', `Tag manager is not initialized`);
            return;
        }
        this.ensureDataLayer();
        this.dataLayer.push({
            'event': this.options.pageTracking.name,
            'url': path
        });
    }
    ensureDataLayer() {
        if (!this.dataLayer) {
            PLATFORM.global.dataLayer = PLATFORM.global.dataLayer || [];
            this.dataLayer = PLATFORM.global.dataLayer;
        }
    }
}

//# sourceMappingURL=tag-manager.js.map
