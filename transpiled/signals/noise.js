"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Noise = function () {
  function Noise() {
    _classCallCheck(this, Noise);
  }

  _createClass(Noise, [{
    key: "signal",
    value: regeneratorRuntime.mark(function signal() {
      return regeneratorRuntime.wrap(function signal$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!true) {
                _context.next = 5;
                break;
              }

              _context.next = 3;
              return Math.random() * 2 - 1;

            case 3:
              _context.next = 0;
              break;

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, signal, this);
    })
  }]);

  return Noise;
}();