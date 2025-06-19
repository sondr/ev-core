"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configure = exports.PropertyOption = void 0;
class PropertyOption {
    constructor(enable, name) {
        this.name = '';
        this.enabled = false;
        this.enabled = enable === true;
        this.name = name || this.name;
    }
    enable() {
        this.enabled = true;
    }
    disable() {
        this.enabled = false;
    }
}
exports.PropertyOption = PropertyOption;
class Configure {
    constructor() {
        this._options = {
            key: '',
            enabled: true,
            resetDatalayerOnPageChange: true,
            trackCurrentPageOnEnable: true,
            pageTracking: new PropertyOption(true, 'PageView'),
            logging: new PropertyOption(),
            async: false,
            defer: true
        };
    }
    options(opts) {
        if (!opts)
            this._options.enabled = false;
        else if (typeof opts === 'string')
            this._options.key = opts;
        else
            Object.assign(this._options, opts);
        return this._options;
    }
    getOptions() {
        return this._options;
    }
    get(key) {
        return this._options[key];
    }
}
exports.Configure = Configure;

//# sourceMappingURL=configure.js.map
