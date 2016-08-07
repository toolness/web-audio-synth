'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioEngine = function () {
  function AudioEngine() {
    _classCallCheck(this, AudioEngine);

    this._audioCtx = new AudioContext();
    this._bufferSource = null;
    this._scriptNode = null;
    this._source = null;
    this._sourceSamples = null;
    this._deactivateTimeout = null;
    this._initMidi();
  }

  _createClass(AudioEngine, [{
    key: 'activate',
    value: function activate(source) {
      clearTimeout(this._deactivateTimeout);
      this._deactivateTimeout = null;

      if (this._source !== source) {
        this._source = source;
        this._sourceSamples = source.samples();
      }

      if (!this._bufferSource) {
        var BUFFER_SIZE = 1024;

        this._scriptNode = this._audioCtx.createScriptProcessor(BUFFER_SIZE, 1, 1);
        this._scriptNode.onaudioprocess = this._processAudio.bind(this);
        this._bufferSource = this._audioCtx.createBufferSource();
        this._bufferSource.connect(this._scriptNode);
        this._scriptNode.connect(this._audioCtx.destination);
        this._bufferSource.start();
      }
    }
  }, {
    key: '_deactivate',
    value: function _deactivate() {
      this._bufferSource.stop();
      this._bufferSource.disconnect(this._scriptNode);
      this._scriptNode.disconnect(this._audioCtx.destination);
      this._scriptNode = null;
      this._bufferSource = null;
      this._sourceSamples = null;
    }
  }, {
    key: '_initMidi',
    value: function _initMidi() {
      var _this = this;

      if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({
          sysex: false
        }).then(function (midi) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = midi.inputs.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var input = _step.value;

              input.onmidimessage = _this._onMidiMessage.bind(_this);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }, function () {
          console.log("MIDI failed to init.");
        });
      }
    }

    // https://www.w3.org/TR/webmidi/
    // https://www.midi.org/specifications/item/table-1-summary-of-midi-message

  }, {
    key: '_onMidiMessage',
    value: function _onMidiMessage(e) {
      var NOTE_ON = 0x90;
      var NOTE_OFF = 0x80;
      var PROGRAM_CHANGE = 0xc0;
      var CONTROL_CHANGE = 0xb0;

      var _e$data = _slicedToArray(e.data, 3);

      var midiType = _e$data[0];
      var note = _e$data[1];
      var velocity = _e$data[2];

      var programNumber = void 0,
          type = void 0,
          controllerNumber = void 0,
          controllerValue = void 0,
          controllerPercentage = void 0;
      var freq = 440 * Math.pow(2, (note - 69) / 12);

      midiType = midiType & 0xf0;

      if (midiType === NOTE_ON && velocity === 0) {
        // Apparently MIDI can be weird.
        midiType = NOTE_OFF;
      }

      if (midiType === NOTE_ON) {
        type = 'noteon';
      } else if (midiType === NOTE_OFF) {
        type = 'noteoff';
      } else if (midiType === PROGRAM_CHANGE) {
        type = 'programchange';
        programNumber = e.data[1];
      } else if (midiType === CONTROL_CHANGE) {
        type = 'controlchange';
        controllerNumber = e.data[1];
        controllerValue = e.data[2];
        controllerPercentage = controllerValue / 127;
      }

      if (type && typeof this.onmidi === 'function') {
        this.onmidi({ type: type, note: note, velocity: velocity, freq: freq, programNumber: programNumber,
          controllerNumber: controllerNumber, controllerValue: controllerValue,
          controllerPercentage: controllerPercentage });
      }
    }
  }, {
    key: '_processAudio',
    value: function _processAudio(e) {
      if (!this._sourceSamples) return;

      var outputBuffer = e.outputBuffer;

      for (var chan = 0; chan < e.outputBuffer.numberOfChannels; chan++) {
        var data = e.outputBuffer.getChannelData(chan);

        for (var i = 0; i < e.outputBuffer.length; i++) {
          var next = this._sourceSamples.next();
          if (next.done) {
            if (this._deactivateTimeout === null) {
              var DEACTIVATE_DELAY = 3000;
              this._source = null;
              this._deactivateTimeout = setTimeout(this._deactivate.bind(this), DEACTIVATE_DELAY);
            }
            for (; i < e.outputBuffer.length; i++) {
              data[i] = 0;
            }
            return;
          }
          data[i] = next.value;
        }
      }
    }
  }, {
    key: 'sampleRate',
    get: function get() {
      return this._audioCtx.sampleRate;
    }
  }]);

  return AudioEngine;
}();