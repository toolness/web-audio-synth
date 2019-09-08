"use strict";

/* global drawGraph, TriangleWave */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _marked = /*#__PURE__*/regeneratorRuntime.mark(zipIterators);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FUNDAMENTAL_FREQ = 1;
var FUNDAMENTAL_PERIOD = 1 / FUNDAMENTAL_FREQ;
var FUNDAMENTAL_ANG_VEL = 2 * Math.PI / FUNDAMENTAL_PERIOD;

function makeWave(sampleRate) {
  var wave = new TriangleWave(sampleRate);

  wave.freq.value = FUNDAMENTAL_FREQ;

  return wave;
}

function makeFourierSeriesWave(sampleRate, type, n) {
  var trigFn = {
    a: Math.cos,
    b: Math.sin
  }[type];

  return new FunctionSignal(function (i) {
    return trigFn(n * FUNDAMENTAL_ANG_VEL * (i / sampleRate));
  });
}

function makeFourierIntegralWave(waveFactory, sampleRate, type, n) {
  var trigFn = {
    a: Math.cos,
    b: Math.sin
  }[type];

  return new TransformSignal(waveFactory(sampleRate), function (sample, i) {
    return sample * trigFn(n * FUNDAMENTAL_ANG_VEL * (i / sampleRate));
  });
}

function integrateOver(sampleRate, seconds, waveFactory) {
  var sum = 0;
  var samples = void 0;

  if (typeof waveFactory === 'function') {
    samples = waveFactory(sampleRate);
  } else {
    samples = waveFactory;
  }

  for (var i = 0; i < sampleRate * seconds; i++) {
    sum += samples.next().value;
  }

  return sum;
}

var FunctionSignal = function () {
  function FunctionSignal(f) {
    _classCallCheck(this, FunctionSignal);

    this._f = f;
  }

  _createClass(FunctionSignal, [{
    key: 'samples',
    value: /*#__PURE__*/regeneratorRuntime.mark(function samples() {
      var i;
      return regeneratorRuntime.wrap(function samples$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              i = 0;

            case 1:
              if (!(i < Infinity)) {
                _context.next = 7;
                break;
              }

              _context.next = 4;
              return this._f(i);

            case 4:
              i++;
              _context.next = 1;
              break;

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, samples, this);
    })
  }]);

  return FunctionSignal;
}();

var TransformSignal = function () {
  function TransformSignal(source, f) {
    _classCallCheck(this, TransformSignal);

    this.source = source;
    this._f = f;
  }

  _createClass(TransformSignal, [{
    key: 'samples',
    value: /*#__PURE__*/regeneratorRuntime.mark(function samples() {
      var i, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, sample;

      return regeneratorRuntime.wrap(function samples$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              i = 0;
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context2.prev = 4;
              _iterator = this.source.samples()[Symbol.iterator]();

            case 6:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context2.next = 13;
                break;
              }

              sample = _step.value;
              _context2.next = 10;
              return this._f(sample, i++);

            case 10:
              _iteratorNormalCompletion = true;
              _context2.next = 6;
              break;

            case 13:
              _context2.next = 19;
              break;

            case 15:
              _context2.prev = 15;
              _context2.t0 = _context2['catch'](4);
              _didIteratorError = true;
              _iteratorError = _context2.t0;

            case 19:
              _context2.prev = 19;
              _context2.prev = 20;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 22:
              _context2.prev = 22;

              if (!_didIteratorError) {
                _context2.next = 25;
                break;
              }

              throw _iteratorError;

            case 25:
              return _context2.finish(22);

            case 26:
              return _context2.finish(19);

            case 27:
            case 'end':
              return _context2.stop();
          }
        }
      }, samples, this, [[4, 15, 19, 27], [20,, 22, 26]]);
    })
  }]);

  return TransformSignal;
}();

var a_0_iter = /*#__PURE__*/regeneratorRuntime.mark(function a_0_iter(sampleRate) {
  return regeneratorRuntime.wrap(function a_0_iter$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.delegateYield(makeWave(sampleRate).samples(), 't0', 1);

        case 1:
        case 'end':
          return _context3.stop();
      }
    }
  }, a_0_iter, this);
});

var a_1_iter = /*#__PURE__*/regeneratorRuntime.mark(function a_1_iter(sampleRate) {
  return regeneratorRuntime.wrap(function a_1_iter$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.delegateYield(makeFourierIntegralWave(makeWave, sampleRate, 'a', 1).samples(), 't0', 1);

        case 1:
        case 'end':
          return _context4.stop();
      }
    }
  }, a_1_iter, this);
});

var a_2_iter = /*#__PURE__*/regeneratorRuntime.mark(function a_2_iter(sampleRate) {
  return regeneratorRuntime.wrap(function a_2_iter$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.delegateYield(makeFourierIntegralWave(makeWave, sampleRate, 'a', 2).samples(), 't0', 1);

        case 1:
        case 'end':
          return _context5.stop();
      }
    }
  }, a_2_iter, this);
});

var b_1_iter = /*#__PURE__*/regeneratorRuntime.mark(function b_1_iter(sampleRate) {
  return regeneratorRuntime.wrap(function b_1_iter$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          return _context6.delegateYield(makeFourierIntegralWave(makeWave, sampleRate, 'b', 1).samples(), 't0', 1);

        case 1:
        case 'end':
          return _context6.stop();
      }
    }
  }, b_1_iter, this);
});

var b_2_iter = /*#__PURE__*/regeneratorRuntime.mark(function b_2_iter(sampleRate) {
  return regeneratorRuntime.wrap(function b_2_iter$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          return _context7.delegateYield(makeFourierIntegralWave(makeWave, sampleRate, 'b', 2).samples(), 't0', 1);

        case 1:
        case 'end':
          return _context7.stop();
      }
    }
  }, b_2_iter, this);
});

function zipIterators() {
  var values,
      i,
      next,
      _args8 = arguments;
  return regeneratorRuntime.wrap(function zipIterators$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          if (!true) {
            _context8.next = 15;
            break;
          }

          values = [];
          i = 0;

        case 3:
          if (!(i < _args8.length)) {
            _context8.next = 11;
            break;
          }

          next = _args8[i].next();

          if (!next.done) {
            _context8.next = 7;
            break;
          }

          return _context8.abrupt('return');

        case 7:
          values.push(next.value);

        case 8:
          i++;
          _context8.next = 3;
          break;

        case 11:
          _context8.next = 13;
          return values;

        case 13:
          _context8.next = 0;
          break;

        case 15:
        case 'end':
          return _context8.stop();
      }
    }
  }, _marked, this);
}

function buildFourierSeries(waveFactory, iterations) {
  return (/*#__PURE__*/regeneratorRuntime.mark(function _callee(sampleRate, seconds) {
      var integral, T, allWaves, allCoefficients, a_0, i, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _samples;

      return regeneratorRuntime.wrap(function _callee$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              integral = integrateOver.bind(null, sampleRate, seconds);
              T = sampleRate * seconds;
              allWaves = [];
              allCoefficients = [];
              a_0 = 1 / T * integral(waveFactory(sampleRate).samples());


              for (i = 0; i < iterations; i++) {
                allWaves.push(makeFourierSeriesWave(sampleRate, 'a', i + 1).samples(), makeFourierSeriesWave(sampleRate, 'b', i + 1).samples());
                allCoefficients.push(2 / T * integral(makeFourierIntegralWave(waveFactory, sampleRate, 'a', i + 1).samples()), 2 / T * integral(makeFourierIntegralWave(waveFactory, sampleRate, 'b', i + 1).samples()));
              }

              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context9.prev = 9;
              _iterator2 = zipIterators.apply(null, allWaves)[Symbol.iterator]();

            case 11:
              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                _context9.next = 18;
                break;
              }

              _samples = _step2.value;
              _context9.next = 15;
              return _samples.reduce(function (sum, sample, i) {
                return sum + allCoefficients[i] * sample;
              }, a_0);

            case 15:
              _iteratorNormalCompletion2 = true;
              _context9.next = 11;
              break;

            case 18:
              _context9.next = 24;
              break;

            case 20:
              _context9.prev = 20;
              _context9.t0 = _context9['catch'](9);
              _didIteratorError2 = true;
              _iteratorError2 = _context9.t0;

            case 24:
              _context9.prev = 24;
              _context9.prev = 25;

              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }

            case 27:
              _context9.prev = 27;

              if (!_didIteratorError2) {
                _context9.next = 30;
                break;
              }

              throw _iteratorError2;

            case 30:
              return _context9.finish(27);

            case 31:
              return _context9.finish(24);

            case 32:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee, this, [[9, 20, 24, 32], [25,, 27, 31]]);
    })
  );
}

drawGraph('#a_0', a_0_iter);

drawGraph('#a_1', a_1_iter);

drawGraph('#b_1', b_1_iter);

drawGraph('#a_2', a_2_iter);

drawGraph('#b_2', b_2_iter);

drawGraph('#fourier_series', buildFourierSeries(makeWave, 6));