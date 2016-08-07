"use strict";

/* global Constant */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PulseWave = function () {
  function PulseWave(sampleRate) {
    _classCallCheck(this, PulseWave);

    this.sampleRate = sampleRate;
    this._dutyCycle = new Constant(0.5);
    this._freq = new Constant(220);
  }

  _createClass(PulseWave, [{
    key: "_recompute",
    value: function _recompute(freq, dutyCycle) {
      var period = Math.floor(this.sampleRate / freq);

      this._highSamplesPerPeriod = Math.floor(period * dutyCycle);
      this._lowSamplesPerPeriod = period - this._highSamplesPerPeriod;
    }
  }, {
    key: "samples",
    value: regeneratorRuntime.mark(function samples() {
      var SIGNAL_LOW, SIGNAL_HIGH, freqSamples, dutyCycleSamples, signal, samplesUntilSignalFlip, freq, dutyCycle;
      return regeneratorRuntime.wrap(function samples$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              SIGNAL_LOW = -1;
              SIGNAL_HIGH = 1;
              freqSamples = this._freq.samples();
              dutyCycleSamples = this._dutyCycle.samples();
              signal = SIGNAL_HIGH;
              samplesUntilSignalFlip = 0;

            case 6:
              if (!true) {
                _context.next = 14;
                break;
              }

              freq = freqSamples.next().value;
              dutyCycle = dutyCycleSamples.next().value;


              if (samplesUntilSignalFlip == 0) {
                this._recompute(freq, dutyCycle);
                if (signal === SIGNAL_LOW) {
                  signal = SIGNAL_HIGH;
                  samplesUntilSignalFlip = this._highSamplesPerPeriod;
                } else {
                  signal = SIGNAL_LOW;
                  samplesUntilSignalFlip = this._lowSamplesPerPeriod;
                }
              } else {
                samplesUntilSignalFlip--;
              }
              _context.next = 12;
              return signal;

            case 12:
              _context.next = 6;
              break;

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, samples, this);
    })
  }, {
    key: "freq",
    set: function set(freq) {
      this._freq = freq;
    },
    get: function get() {
      return this._freq;
    }
  }, {
    key: "dutyCycle",
    set: function set(dutyCycle) {
      this._dutyCycle = dutyCycle;
    },
    get: function get() {
      return this._dutyCycle;
    }
  }]);

  return PulseWave;
}();