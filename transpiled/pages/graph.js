"use strict";

/* global d3, Constant, SineWave, Adsr */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _marked = [zipIterators].map(regeneratorRuntime.mark);

var defaults = {
  width: 640,
  height: 320,
  margin: {
    top: 20,
    right: 50,
    bottom: 40,
    left: 50
  },
  yDomain: [-1, 1],
  seconds: 2
};

function translateStr(x, y) {
  return 'translate(' + x + ', ' + y + ')';
}

function drawGraph(selector, createSampleIterator, options) {
  options = Object.assign({}, defaults, options);

  var margin = options.margin;
  var width = options.width;
  var height = options.height;
  var seconds = options.seconds;
  var yDomain = options.yDomain;
  var sampleRate = Math.floor(width / seconds);

  var x = d3.scaleLinear().range([0, width]);

  var y = d3.scaleLinear().range([height, 0]);

  var line = d3.line().x(function (d) {
    return x(d.x);
  }).y(function (d) {
    return y(d.y);
  });

  var svg = d3.select(selector).append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', translateStr(margin.left, margin.top));

  y.domain(yDomain);
  x.domain([0, seconds]);

  svg.append('g').attr('transform', translateStr(0, height / 2)).call(d3.axisBottom(x));

  svg.append('g').call(d3.axisLeft(y));

  var totalSamples = seconds * sampleRate;
  var samples = createSampleIterator(sampleRate, seconds, totalSamples);
  var data = [];

  for (var i = 0; i < totalSamples; i++) {
    var nextSample = samples.next();
    if (nextSample.done) break;
    data.push({
      x: i / sampleRate,
      y: nextSample.value
    });
  }

  svg.append('path').datum(data).attr('class', 'line').attr('d', line);
}

function zipIterators() {
  var values,
      i,
      next,
      _args = arguments;
  return regeneratorRuntime.wrap(function zipIterators$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!true) {
            _context.next = 15;
            break;
          }

          values = [];
          i = 0;

        case 3:
          if (!(i < _args.length)) {
            _context.next = 11;
            break;
          }

          next = _args[i].next();

          if (!next.done) {
            _context.next = 7;
            break;
          }

          return _context.abrupt('return');

        case 7:
          values.push(next.value);

        case 8:
          i++;
          _context.next = 3;
          break;

        case 11:
          _context.next = 13;
          return values;

        case 13:
          _context.next = 0;
          break;

        case 15:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

var FunctionSignal = function () {
  function FunctionSignal(f) {
    _classCallCheck(this, FunctionSignal);

    this._f = f;
  }

  _createClass(FunctionSignal, [{
    key: 'samples',
    value: regeneratorRuntime.mark(function samples() {
      var i;
      return regeneratorRuntime.wrap(function samples$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              i = 0;

            case 1:
              if (!(i < Infinity)) {
                _context2.next = 7;
                break;
              }

              _context2.next = 4;
              return this._f(i);

            case 4:
              i++;
              _context2.next = 1;
              break;

            case 7:
            case 'end':
              return _context2.stop();
          }
        }
      }, samples, this);
    })
  }]);

  return FunctionSignal;
}();

drawGraph('#sine-fm', regeneratorRuntime.mark(function _callee(sampleRate, seconds, totalSamples) {
  var signal, startFreq, endFreq, freqDelta;
  return regeneratorRuntime.wrap(function _callee$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          signal = new SineWave(sampleRate);
          startFreq = 1;
          endFreq = 10;
          freqDelta = endFreq - startFreq;


          document.querySelector('#sine-fm-start').textContent = startFreq;
          document.querySelector('#sine-fm-end').textContent = endFreq;

          signal.freq = new FunctionSignal(function (i) {
            return startFreq + freqDelta * (i / totalSamples);
          });

          return _context3.delegateYield(signal.samples(), 't0', 8);

        case 8:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee, this);
}));

drawGraph('#sine-add', regeneratorRuntime.mark(function _callee2(sampleRate) {
  var sine1, sine2, sine1Part, sine2Part, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, s1, s2;

  return regeneratorRuntime.wrap(function _callee2$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          sine1 = new SineWave(sampleRate);
          sine2 = new SineWave(sampleRate);
          sine1Part = 0.75;
          sine2Part = 1 - sine1Part;


          sine1.freq.value = 1;
          sine2.freq.value = 50;

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context4.prev = 9;
          _iterator = zipIterators(sine1.samples(), sine2.samples())[Symbol.iterator]();

        case 11:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context4.next = 20;
            break;
          }

          _step$value = _slicedToArray(_step.value, 2);
          s1 = _step$value[0];
          s2 = _step$value[1];
          _context4.next = 17;
          return s1 * sine1Part + s2 * sine2Part;

        case 17:
          _iteratorNormalCompletion = true;
          _context4.next = 11;
          break;

        case 20:
          _context4.next = 26;
          break;

        case 22:
          _context4.prev = 22;
          _context4.t0 = _context4['catch'](9);
          _didIteratorError = true;
          _iteratorError = _context4.t0;

        case 26:
          _context4.prev = 26;
          _context4.prev = 27;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 29:
          _context4.prev = 29;

          if (!_didIteratorError) {
            _context4.next = 32;
            break;
          }

          throw _iteratorError;

        case 32:
          return _context4.finish(29);

        case 33:
          return _context4.finish(26);

        case 34:
        case 'end':
          return _context4.stop();
      }
    }
  }, _callee2, this, [[9, 22, 26, 34], [27,, 29, 33]]);
}));

drawGraph('#sine-adsr', regeneratorRuntime.mark(function _callee3(sampleRate, seconds, totalSamples) {
  var sine, attack, decay, release, sustain, adsr, samples, i;
  return regeneratorRuntime.wrap(function _callee3$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          sine = new SineWave(sampleRate);
          attack = seconds / 4;
          decay = seconds / 8;
          release = seconds / 6;
          sustain = 0.75;
          adsr = new Adsr(sampleRate, sine, attack, decay, sustain, release);
          samples = adsr.samples();


          sine.freq.value = 25;

          i = 0;

        case 9:
          if (!(i < totalSamples - sampleRate * release)) {
            _context5.next = 15;
            break;
          }

          _context5.next = 12;
          return samples.next().value;

        case 12:
          i++;
          _context5.next = 9;
          break;

        case 15:

          adsr.startRelease();

          return _context5.delegateYield(samples, 't0', 17);

        case 17:
        case 'end':
          return _context5.stop();
      }
    }
  }, _callee3, this);
}));