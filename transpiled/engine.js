"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioEngine = function () {
  function AudioEngine() {
    _classCallCheck(this, AudioEngine);

    var BUFFER_SIZE = 1024;

    this._audioCtx = new AudioContext();
    this._bufferSource = this._audioCtx.createBufferSource();
    this._bufferSourceStarted = false;
    this._scriptNode = this._audioCtx.createScriptProcessor(BUFFER_SIZE, 1, 1);

    this._bufferSource.connect(this._scriptNode);
    this._scriptNode.connect(this._audioCtx.destination);
    this._scriptNode.onaudioprocess = this._processAudio.bind(this);
    this._source = null;
    this._started = false;
  }

  _createClass(AudioEngine, [{
    key: "activate",
    value: function activate(source) {
      if (this._source !== source) {
        this._source = source;
        this._sourceSignal = source.signal();
      }

      if (!this._started) {
        this._bufferSource.start();
        this._started = true;
      }
    }
  }, {
    key: "_processAudio",
    value: function _processAudio(e) {
      if (!this._sourceSignal) return;

      var outputBuffer = e.outputBuffer;

      for (var chan = 0; chan < e.outputBuffer.numberOfChannels; chan++) {
        var data = e.outputBuffer.getChannelData(chan);

        for (var i = 0; i < e.outputBuffer.length; i++) {
          data[i] = this._sourceSignal.next().value;
        }
      }
    }
  }, {
    key: "sampleRate",
    get: function get() {
      return this._audioCtx.sampleRate;
    }
  }]);

  return AudioEngine;
}();