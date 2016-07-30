"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Amplifier = function () {
  function Amplifier(source, amount) {
    _classCallCheck(this, Amplifier);

    this.amount = amount;
    this._source = source;
  }

  _createClass(Amplifier, [{
    key: "signal",
    value: function signal() {
      var _marked = [signalGenerator].map(regeneratorRuntime.mark);

      var self = this;
      var sourceSignal = this._source.signal();

      function signalGenerator() {
        var value;
        return regeneratorRuntime.wrap(function signalGenerator$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!true) {
                  _context.next = 6;
                  break;
                }

                value = sourceSignal.next().value * self.amount;
                _context.next = 4;
                return value;

              case 4:
                _context.next = 0;
                break;

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _marked[0], this);
      }

      return signalGenerator();
    }
  }]);

  return Amplifier;
}();