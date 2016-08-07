"use strict";

/* global Constant */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TriangleWave = function () {
  function TriangleWave(sampleRate) {
    _classCallCheck(this, TriangleWave);

    this.sampleRate = sampleRate;
    this._freq = new Constant(220);
  }

  _createClass(TriangleWave, [{
    key: "_recompute",
    value: function _recompute(freq) {
      var period = Math.floor(this.sampleRate / freq);

      this._slope = 2 / (period / 2);
    }
  }, {
    key: "samples",
    value: regeneratorRuntime.mark(function samples() {
      var SIGNAL_LOW, SIGNAL_HIGH, freqSamples, freq, slope, signal;
      return regeneratorRuntime.wrap(function samples$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              SIGNAL_LOW = -1;
              SIGNAL_HIGH = 1;
              freqSamples = this._freq.samples();
              freq = freqSamples.next().value;


              this._recompute(freq);

              slope = this._slope;
              signal = 0;

            case 7:
              if (!true) {
                _context.next = 15;
                break;
              }

              _context.next = 10;
              return signal;

            case 10:

              freq = freqSamples.next().value;
              signal += slope;

              if (slope > 0) {
                if (signal >= SIGNAL_HIGH) {
                  signal = SIGNAL_HIGH;
                  this._recompute(freq);
                  slope = -this._slope;
                }
              } else {
                if (signal <= SIGNAL_LOW) {
                  signal = SIGNAL_LOW;
                  this._recompute(freq);
                  slope = this._slope;
                }
              }
              _context.next = 7;
              break;

            case 15:
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
  }]);

  return TriangleWave;
}();