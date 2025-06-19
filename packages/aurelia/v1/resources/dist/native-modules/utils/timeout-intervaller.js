import { __extends, __spreadArray } from "tslib";
import { PLATFORM } from "aurelia-framework";
var TimeIntervalBase = (function () {
    function TimeIntervalBase() {
    }
    return TimeIntervalBase;
}());
var Timeouter = (function (_super) {
    __extends(Timeouter, _super);
    function Timeouter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Timeouter.prototype.start = function (handler, ms) {
        var _a;
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.id = (_a = PLATFORM.global).setTimeout.apply(_a, __spreadArray([handler, ms], args, false));
    };
    Timeouter.prototype.clear = function () {
        if (this.id != undefined) {
            PLATFORM.global.clearTimeout(this.id);
            this.id = undefined;
        }
        return this;
    };
    return Timeouter;
}(TimeIntervalBase));
export { Timeouter };
var Intervaller = (function (_super) {
    __extends(Intervaller, _super);
    function Intervaller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Intervaller.prototype.start = function (handler, timeout) {
        var _a;
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.id = (_a = PLATFORM.global).setInterval.apply(_a, __spreadArray([handler, timeout], args, false));
    };
    Intervaller.prototype.clear = function () {
        if (this.id != undefined) {
            PLATFORM.global.clearInterval(this.id);
            this.id = undefined;
        }
        return this;
    };
    return Intervaller;
}(TimeIntervalBase));
export { Intervaller };
var AnimationFrameScheduler = (function (_super) {
    __extends(AnimationFrameScheduler, _super);
    function AnimationFrameScheduler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimationFrameScheduler.prototype.start = function (handler) {
        this.id = PLATFORM.global.requestAnimationFrame(handler);
    };
    AnimationFrameScheduler.prototype.clear = function () {
        if (this.id !== undefined) {
            PLATFORM.global.cancelAnimationFrame(this.id);
            this.id = undefined;
        }
        return this;
    };
    return AnimationFrameScheduler;
}(TimeIntervalBase));
export { AnimationFrameScheduler };
var WorkerTimer = (function (_super) {
    __extends(WorkerTimer, _super);
    function WorkerTimer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WorkerTimer.prototype.start = function (handler, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (typeof handler !== 'function') {
            throw new Error('Handler must be a function for WorkerTimer.');
        }
        var blob = new Blob(["\n            self.onmessage = function(e) {\n                const { timeout, args } = e.data;\n                setTimeout(() => postMessage(args), timeout);\n            };\n        "], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));
        this.worker.onmessage = function (e) { return handler.apply(void 0, e.data); };
        this.worker.postMessage({ timeout: timeout, args: args });
    };
    WorkerTimer.prototype.clear = function () {
        if (this.worker) {
            this.worker.terminate();
            this.worker = undefined;
        }
        return this;
    };
    return WorkerTimer;
}(TimeIntervalBase));
export { WorkerTimer };
var PromiseTimer = (function (_super) {
    __extends(PromiseTimer, _super);
    function PromiseTimer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PromiseTimer.prototype.start = function (handler, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (typeof handler !== 'function') {
            throw new Error('Handler must be a function for WorkerTimer.');
        }
        var canceled = false;
        this.cancel = function () { canceled = true; };
        new Promise(function (resolve) {
            setTimeout(function () {
                if (!canceled)
                    resolve();
            }, timeout);
        }).then(function () { return handler.apply(void 0, args); });
    };
    PromiseTimer.prototype.clear = function () {
        if (this.cancel) {
            this.cancel();
            this.cancel = undefined;
        }
        return this;
    };
    return PromiseTimer;
}(TimeIntervalBase));
export { PromiseTimer };

//# sourceMappingURL=timeout-intervaller.js.map
