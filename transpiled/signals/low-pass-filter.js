"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LowPassFilter = function () {
  function LowPassFilter(source, samplesToAverage) {
    _classCallCheck(this, LowPassFilter);

    this._source = source;
    this.samplesToAverage = samplesToAverage || 1;
  }

  _createClass(LowPassFilter, [{
    key: "samples",
    value: /*#__PURE__*/regeneratorRuntime.mark(function samples() {
      var samples, sourceSamples;
      return regeneratorRuntime.wrap(function samples$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              samples = [];
              sourceSamples = this._source.samples();

            case 2:
              if (!true) {
                _context.next = 9;
                break;
              }

              samples.push(sourceSamples.next().value);
              if (samples.length > this.samplesToAverage) {
                samples.splice(0, samples.length - this.samplesToAverage);
              }
              _context.next = 7;
              return samples.reduce(function (sum, current) {
                return sum + current;
              }, 0) / samples.length;

            case 7:
              _context.next = 2;
              break;

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, samples, this);
    })
  }]);

  return LowPassFilter;
}();