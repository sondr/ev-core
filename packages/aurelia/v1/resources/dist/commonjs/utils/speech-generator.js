"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeechGenerator = void 0;
var aurelia_framework_1 = require("aurelia-framework");
var SpeechGenerator = (function () {
    function SpeechGenerator(opts) {
        this.id = undefined;
        this.utterance = new aurelia_framework_1.PLATFORM.global.SpeechSynthesisUtterance();
        this.setOptions(opts);
    }
    SpeechGenerator.prototype.setOptions = function (opts) {
        this.utterance.lang = (opts === null || opts === void 0 ? void 0 : opts.lang) || '';
        this.utterance.pitch = (opts === null || opts === void 0 ? void 0 : opts.pitch) || 1;
        this.utterance.rate = (opts === null || opts === void 0 ? void 0 : opts.rate) || 1;
        this.utterance.volume = (opts === null || opts === void 0 ? void 0 : opts.volume) || 1;
    };
    SpeechGenerator.prototype.setVoice = function (voice) {
        this.utterance.voice = voice;
    };
    SpeechGenerator.prototype.resume = function () {
        aurelia_framework_1.PLATFORM.global.speechSynthesis.resume();
    };
    SpeechGenerator.prototype.pause = function () {
        aurelia_framework_1.PLATFORM.global.speechSynthesis.pause();
    };
    SpeechGenerator.prototype.cancel = function () {
        aurelia_framework_1.PLATFORM.global.speechSynthesis.cancel();
    };
    SpeechGenerator.prototype.getVoices = function () {
        aurelia_framework_1.PLATFORM.global.speechSynthesis.getVoices();
    };
    SpeechGenerator.prototype.speak = function (text) {
        this.utterance.text = text;
        aurelia_framework_1.PLATFORM.global.speechSynthesis.speak(this.utterance);
    };
    return SpeechGenerator;
}());
exports.SpeechGenerator = SpeechGenerator;

//# sourceMappingURL=speech-generator.js.map
