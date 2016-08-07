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
    key: "samples",
    value: regeneratorRuntime.mark(function samples() {
      var sourceSamples, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, nextValue;

      return regeneratorRuntime.wrap(function samples$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              sourceSamples = this._source.samples();
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 4;
              _iterator = sourceSamples[Symbol.iterator]();

            case 6:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context.next = 13;
                break;
              }

              nextValue = _step.value;
              _context.next = 10;
              return nextValue * this.amount;

            case 10:
              _iteratorNormalCompletion = true;
              _context.next = 6;
              break;

            case 13:
              _context.next = 19;
              break;

            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](4);
              _didIteratorError = true;
              _iteratorError = _context.t0;

            case 19:
              _context.prev = 19;
              _context.prev = 20;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 22:
              _context.prev = 22;

              if (!_didIteratorError) {
                _context.next = 25;
                break;
              }

              throw _iteratorError;

            case 25:
              return _context.finish(22);

            case 26:
              return _context.finish(19);

            case 27:
            case "end":
              return _context.stop();
          }
        }
      }, samples, this, [[4, 15, 19, 27], [20,, 22, 26]]);
    })
  }]);

  return Amplifier;
}();