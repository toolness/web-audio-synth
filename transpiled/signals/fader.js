"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Fader = function () {
  function Fader(sampleRate, fadeSeconds) {
    _classCallCheck(this, Fader);

    this.sampleRate = sampleRate;
    this.source = null;
    this._fade = 0;
    this._baseFadeSlope = 1 / (sampleRate * fadeSeconds);
    this._fadeSlope = 0;
  }

  _createClass(Fader, [{
    key: "fadeIn",
    value: function fadeIn() {
      this._fadeSlope = this._baseFadeSlope;
    }
  }, {
    key: "fadeOut",
    value: function fadeOut() {
      this._fadeSlope = -this._baseFadeSlope;
    }
  }, {
    key: "signal",
    value: function signal() {
      var _marked = [signalGenerator].map(regeneratorRuntime.mark);

      var self = this;

      function signalGenerator() {
        var value;
        return regeneratorRuntime.wrap(function signalGenerator$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!true) {
                  _context.next = 18;
                  break;
                }

                if (!self._sourceSignal) {
                  _context.next = 12;
                  break;
                }

                if (!self._fade) {
                  _context.next = 8;
                  break;
                }

                value = self._sourceSignal.next().value;
                _context.next = 6;
                return value * self._fade;

              case 6:
                _context.next = 10;
                break;

              case 8:
                _context.next = 10;
                return 0;

              case 10:
                _context.next = 14;
                break;

              case 12:
                _context.next = 14;
                return 0;

              case 14:

                self._fade += self._fadeSlope;

                if (self._fade < 0) {
                  self._fade = 0;
                  self._fadeSlope = 0;
                } else if (self._fade > 1) {
                  self._fade = 1;
                  self._fadeSlope = 0;
                }
                _context.next = 0;
                break;

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _marked[0], this);
      }

      return signalGenerator();
    }
  }, {
    key: "source",
    set: function set(source) {
      if (source !== this._source) {
        this._source = source;
        this._sourceSignal = source ? source.signal() : null;
      }
    }
  }]);

  return Fader;
}();