"use strict";

/* global Constant */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SineWave = function () {
  function SineWave(sampleRate) {
    _classCallCheck(this, SineWave);

    this.sampleRate = sampleRate;
    this._freq = new Constant(220);
  }

  _createClass(SineWave, [{
    key: "samples",
    value: regeneratorRuntime.mark(function samples() {
      var freqSamples, freq, period, i;
      return regeneratorRuntime.wrap(function samples$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              freqSamples = this._freq.samples();
              freq = freqSamples.next().value;

            case 2:
              if (!true) {
                _context.next = 14;
                break;
              }

              period = Math.floor(this.sampleRate / freq);
              i = 0;

            case 5:
              if (!(i < period)) {
                _context.next = 12;
                break;
              }

              _context.next = 8;
              return Math.sin(i * 2 * Math.PI / period);

            case 8:
              freq = freqSamples.next().value;

            case 9:
              i++;
              _context.next = 5;
              break;

            case 12:
              _context.next = 2;
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
  }]);

  return SineWave;
}();