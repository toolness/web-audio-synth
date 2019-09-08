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
    value: /*#__PURE__*/regeneratorRuntime.mark(function samples() {
      var angle, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, freq, period, angularVelocity;

      return regeneratorRuntime.wrap(function samples$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              angle = 0;
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 4;
              _iterator = this._freq.samples()[Symbol.iterator]();

            case 6:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context.next = 16;
                break;
              }

              freq = _step.value;
              period = Math.floor(this.sampleRate / freq);
              angularVelocity = 2 * Math.PI / period;

              angle += angularVelocity;
              _context.next = 13;
              return Math.sin(angle);

            case 13:
              _iteratorNormalCompletion = true;
              _context.next = 6;
              break;

            case 16:
              _context.next = 22;
              break;

            case 18:
              _context.prev = 18;
              _context.t0 = _context["catch"](4);
              _didIteratorError = true;
              _iteratorError = _context.t0;

            case 22:
              _context.prev = 22;
              _context.prev = 23;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 25:
              _context.prev = 25;

              if (!_didIteratorError) {
                _context.next = 28;
                break;
              }

              throw _iteratorError;

            case 28:
              return _context.finish(25);

            case 29:
              return _context.finish(22);

            case 30:
            case "end":
              return _context.stop();
          }
        }
      }, samples, this, [[4, 18, 22, 30], [23,, 25, 29]]);
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