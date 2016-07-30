"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SineWave = function () {
  function SineWave(sampleRate) {
    _classCallCheck(this, SineWave);

    this.sampleRate = sampleRate;
    this._freq = 220;
  }

  _createClass(SineWave, [{
    key: "signal",
    value: function signal() {
      var _marked = [signalGenerator].map(regeneratorRuntime.mark);

      var self = this;

      function signalGenerator() {
        var period, i;
        return regeneratorRuntime.wrap(function signalGenerator$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!true) {
                  _context.next = 11;
                  break;
                }

                period = Math.floor(self.sampleRate / self._freq);
                i = 0;

              case 3:
                if (!(i < period)) {
                  _context.next = 9;
                  break;
                }

                _context.next = 6;
                return Math.sin(i * 2 * Math.PI / period);

              case 6:
                i++;
                _context.next = 3;
                break;

              case 9:
                _context.next = 0;
                break;

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _marked[0], this);
      }

      return signalGenerator();
    }
  }, {
    key: "freq",
    set: function set(hz) {
      this._freq = hz;
    },
    get: function get() {
      return this._freq;
    }
  }]);

  return SineWave;
}();