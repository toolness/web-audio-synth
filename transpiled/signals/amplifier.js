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
    value: regeneratorRuntime.mark(function signal() {
      var sourceSignal, value;
      return regeneratorRuntime.wrap(function signal$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              sourceSignal = this._source.signal();

            case 1:
              if (!true) {
                _context.next = 7;
                break;
              }

              value = sourceSignal.next().value * this.amount;
              _context.next = 5;
              return value;

            case 5:
              _context.next = 1;
              break;

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, signal, this);
    })
  }]);

  return Amplifier;
}();