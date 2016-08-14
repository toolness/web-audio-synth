"use strict";

/* global TriangleWave, PulseWave, SineWave,
 *        AudioEngine, Adsr, Constant */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var engine = new AudioEngine();

var $ = document.querySelector.bind(document);

var StoredPercentage = function () {
  function StoredPercentage(el, defaultValue, key) {
    _classCallCheck(this, StoredPercentage);

    this._el = el;
    this._key = key;

    var percentage = parseFloat(sessionStorage[this._key]);
    if (isNaN(percentage)) {
      percentage = defaultValue;
    }

    this.value = percentage;
  }

  _createClass(StoredPercentage, [{
    key: 'samples',
    value: regeneratorRuntime.mark(function samples() {
      return regeneratorRuntime.wrap(function samples$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!true) {
                _context.next = 5;
                break;
              }

              _context.next = 3;
              return this._value;

            case 3:
              _context.next = 0;
              break;

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, samples, this);
    })
  }, {
    key: 'value',
    set: function set(percentage) {
      this._value = percentage;
      this._el.textContent = Math.floor(percentage * 100) + '%';
      sessionStorage[this._key] = percentage;
    }
  }]);

  return StoredPercentage;
}();

var Instruments = function () {
  function Instruments(el, bank) {
    _classCallCheck(this, Instruments);

    this._el = el;
    this._bank = bank;
    this.select(0);
  }

  _createClass(Instruments, [{
    key: 'select',
    value: function select(index) {
      this.selected = this._bank[index % this._bank.length];
      this._el.textContent = this.selected.name;
    }
  }]);

  return Instruments;
}();

var Chord = function () {
  function Chord(instruments, maxNotes) {
    _classCallCheck(this, Chord);

    this._instruments = instruments;
    this._sources = new Map();
    this._maxNotes = maxNotes;
  }

  _createClass(Chord, [{
    key: 'on',
    value: function on(note, freq) {
      if (this._sources.has(note)) {
        this._sources.get(note).startAttack();
      } else {
        var ATTACK_SECONDS = 0.01;
        var DECAY_SECONDS = 0.01;
        var SUSTAIN_LEVEL = 1.0;
        var RELEASE_SECONDS = 0.01;

        var source = this._instruments.selected.create(new Constant(freq));
        var adsr = new Adsr(engine.sampleRate, source, ATTACK_SECONDS, DECAY_SECONDS, SUSTAIN_LEVEL, RELEASE_SECONDS);

        adsr.startAttack();

        this._sources.set(note, adsr);
      }
    }
  }, {
    key: 'off',
    value: function off(note) {
      this._sources.get(note).startRelease();
    }
  }, {
    key: 'samples',
    value: regeneratorRuntime.mark(function samples() {
      var toDelete, samplesMap, sample, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, note, source, _samples, next, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _step2$value;

      return regeneratorRuntime.wrap(function samples$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              toDelete = [];
              samplesMap = new Map();

            case 2:
              if (!true) {
                _context2.next = 50;
                break;
              }

              sample = 0;
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context2.prev = 7;


              for (_iterator = this._sources[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                _step$value = _slicedToArray(_step.value, 2);
                note = _step$value[0];
                source = _step$value[1];

                if (!samplesMap.has(source)) {
                  samplesMap.set(source, source.samples());
                }
                _samples = samplesMap.get(source);
                next = _samples.next();

                if (next.done) {
                  toDelete.push([note, source]);
                } else {
                  sample += next.value;
                }
              }

              _context2.next = 15;
              break;

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2['catch'](7);
              _didIteratorError = true;
              _iteratorError = _context2.t0;

            case 15:
              _context2.prev = 15;
              _context2.prev = 16;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 18:
              _context2.prev = 18;

              if (!_didIteratorError) {
                _context2.next = 21;
                break;
              }

              throw _iteratorError;

            case 21:
              return _context2.finish(18);

            case 22:
              return _context2.finish(15);

            case 23:
              if (!toDelete.length) {
                _context2.next = 44;
                break;
              }

              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context2.prev = 27;

              for (_iterator2 = toDelete[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                _step2$value = _slicedToArray(_step2.value, 2);
                note = _step2$value[0];
                source = _step2$value[1];

                samplesMap.delete(source);
                this._sources.delete(note);
              }
              _context2.next = 35;
              break;

            case 31:
              _context2.prev = 31;
              _context2.t1 = _context2['catch'](27);
              _didIteratorError2 = true;
              _iteratorError2 = _context2.t1;

            case 35:
              _context2.prev = 35;
              _context2.prev = 36;

              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }

            case 38:
              _context2.prev = 38;

              if (!_didIteratorError2) {
                _context2.next = 41;
                break;
              }

              throw _iteratorError2;

            case 41:
              return _context2.finish(38);

            case 42:
              return _context2.finish(35);

            case 43:
              toDelete = [];

            case 44:
              _context2.next = 46;
              return sample / this._maxNotes;

            case 46:
              if (!(this._sources.size === 0)) {
                _context2.next = 48;
                break;
              }

              return _context2.abrupt('return');

            case 48:
              _context2.next = 2;
              break;

            case 50:
            case 'end':
              return _context2.stop();
          }
        }
      }, samples, this, [[7, 11, 15, 23], [16,, 18, 22], [27, 31, 35, 43], [36,, 38, 42]]);
    })
  }]);

  return Chord;
}();

var NoteDisplay = function () {
  function NoteDisplay(el) {
    _classCallCheck(this, NoteDisplay);

    this._notes = [];
    this._el = el;
    this._status = el.querySelector('[role="status"]');
  }

  _createClass(NoteDisplay, [{
    key: '_updateStatus',
    value: function _updateStatus() {
      this._status.textContent = this._notes.join(' ');
    }
  }, {
    key: 'on',
    value: function on(noteString) {
      this._notes.push(noteString);
      this._updateStatus();
      this._el.classList.add('active');
    }
  }, {
    key: 'off',
    value: function off(noteString) {
      this._notes.splice(this._notes.indexOf(noteString), 1);
      if (this._notes.length === 0) {
        this._el.classList.remove('active');
      } else {
        this._updateStatus();
      }
    }
  }]);

  return NoteDisplay;
}();

var dutyCycle = new StoredPercentage($('#duty-cycle'), 0.5, 'dutyCycle');

var instruments = new Instruments($('#midi-source'), [{
  name: PulseWave.name,
  create: function create(freq) {
    var pulseWave = new PulseWave(engine.sampleRate);

    pulseWave.freq = freq;
    pulseWave.dutyCycle = dutyCycle;

    return pulseWave;
  }
}, {
  name: TriangleWave.name,
  create: function create(freq) {
    var triangleWave = new TriangleWave(engine.sampleRate);

    triangleWave.freq = freq;
    return triangleWave;
  }
}, {
  name: SineWave.name,
  create: function create(freq) {
    var sineWave = new SineWave(engine.sampleRate);

    sineWave.freq = freq;
    return sineWave;
  }
}]);

var noteDisplay = new NoteDisplay($('#midi'));

var chord = new Chord(instruments, 3);

engine.onmidi = function (e) {
  if (e.type === 'noteon') {
    chord.on(e.note, e.freq);
    engine.activate(chord);
    noteDisplay.on(e.noteString);
  } else if (e.type === 'noteoff') {
    chord.off(e.note);
    noteDisplay.off(e.noteString);
  } else if (e.type === 'programchange') {
    instruments.select(e.programNumber);
  } else if (e.type === 'controlchange') {
    if (e.controllerNumber === 1) {
      dutyCycle.value = e.controllerPercentage;
    }
  }
};