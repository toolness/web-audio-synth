"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constant = function () {
  function Constant(value) {
    _classCallCheck(this, Constant);

    this.value = value;
  }

  _createClass(Constant, [{
    key: "samples",
    value: /*#__PURE__*/regeneratorRuntime.mark(function samples() {
      return regeneratorRuntime.wrap(function samples$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!true) {
                _context.next = 5;
                break;
              }

              _context.next = 3;
              return this.value;

            case 3:
              _context.next = 0;
              break;

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, samples, this);
    })
  }]);

  return Constant;
}();