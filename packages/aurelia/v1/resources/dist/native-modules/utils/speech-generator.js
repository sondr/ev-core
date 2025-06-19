import { PLATFORM } from "aurelia-framework";
var SpeechGenerator = (function () {
    function SpeechGenerator(opts) {
        this.id = undefined;
        this.utterance = new PLATFORM.global.SpeechSynthesisUtterance();
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
        PLATFORM.global.speechSynthesis.resume();
    };
    SpeechGenerator.prototype.pause = function () {
        PLATFORM.global.speechSynthesis.pause();
    };
    SpeechGenerator.prototype.cancel = function () {
        PLATFORM.global.speechSynthesis.cancel();
    };
    SpeechGenerator.prototype.getVoices = function () {
        PLATFORM.global.speechSynthesis.getVoices();
    };
    SpeechGenerator.prototype.speak = function (text) {
        this.utterance.text = text;
        PLATFORM.global.speechSynthesis.speak(this.utterance);
    };
    return SpeechGenerator;
}());
export { SpeechGenerator };

//# sourceMappingURL=speech-generator.js.map
