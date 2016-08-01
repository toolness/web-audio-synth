"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TriangleWave = function () {
  function TriangleWave(sampleRate) {
    _classCallCheck(this, TriangleWave);

    this.sampleRate = sampleRate;
    this._freq = 220;
    this._recompute();
  }

  _createClass(TriangleWave, [{
    key: "_recompute",
    value: function _recompute() {
      var period = Math.floor(this.sampleRate / this._freq);

      this._slope = 2 / (period / 2);
    }
  }, {
    key: "signal",
    value: regeneratorRuntime.mark(function signal() {
      var SIGNAL_LOW, SIGNAL_HIGH, slope, signal;
      return regeneratorRuntime.wrap(function signal$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              SIGNAL_LOW = -1;
              SIGNAL_HIGH = 1;
              slope = this._slope;
              signal = 0;

            case 4:
              if (!true) {
                _context.next = 11;
                break;
              }

              _context.next = 7;
              return signal;

            case 7:

              signal += slope;

              if (slope > 0) {
                if (signal >= SIGNAL_HIGH) {
                  signal = SIGNAL_HIGH;
                  slope = -this._slope;
                }
              } else {
                if (signal <= SIGNAL_LOW) {
                  signal = SIGNAL_LOW;
                  slope = this._slope;
                }
              }
              _context.next = 4;
              break;

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, signal, this);
    })
  }, {
    key: "freq",
    set: function set(hz) {
      this._freq = hz;
      this._recompute();
    },
    get: function get() {
      return this._freq;
    }
  }]);

  return TriangleWave;
}();