"use strict";

/* global Constant */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Adsr = function () {
  function Adsr(sampleRate, source, attack, decay, sustain, release) {
    _classCallCheck(this, Adsr);

    this.STATE_ATTACK = 1;
    this.STATE_DECAY = 2;
    this.STATE_SUSTAIN = 3;
    this.STATE_RELEASE = 4;

    this.sampleRate = sampleRate;
    this.source = source;
    this._attack = attack;
    this._decay = decay;
    this._sustain = sustain;
    this._release = release;
    this._state = this.STATE_ATTACK;
    this._recompute();
  }

  _createClass(Adsr, [{
    key: "_recompute",
    value: function _recompute() {
      this._attackSlope = 1 / (this.sampleRate * this._attack);
      this._decaySlope = -(1 - this._sustain) / (this.sampleRate * this._decay);
      this._releaseSlope = -this._sustain / (this.sampleRate * this._release);
    }
  }, {
    key: "startAttack",
    value: function startAttack() {
      this._state = this.STATE_ATTACK;
    }
  }, {
    key: "startRelease",
    value: function startRelease() {
      this._state = this.STATE_RELEASE;
    }
  }, {
    key: "samples",
    value: /*#__PURE__*/regeneratorRuntime.mark(function samples() {
      var amount, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, sample;

      return regeneratorRuntime.wrap(function samples$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              amount = 0;
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 4;
              _iterator = this.source.samples()[Symbol.iterator]();

            case 6:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context.next = 30;
                break;
              }

              sample = _step.value;
              _context.t0 = this._state;
              _context.next = _context.t0 === this.STATE_ATTACK ? 11 : _context.t0 === this.STATE_DECAY ? 14 : _context.t0 === this.STATE_SUSTAIN ? 17 : _context.t0 === this.STATE_RELEASE ? 19 : 25;
              break;

            case 11:
              amount += this._attackSlope;
              if (amount >= 1) {
                amount = 1;
                this._state = this.STATE_DECAY;
              }
              return _context.abrupt("break", 25);

            case 14:
              amount += this._decaySlope;
              if (amount <= this._sustain) {
                amount = this._sustain;
                this._state = this.STATE_SUSTAIN;
              }
              return _context.abrupt("break", 25);

            case 17:
              amount = this._sustain;
              return _context.abrupt("break", 25);

            case 19:
              amount += this._releaseSlope;

              if (!(amount <= 0)) {
                _context.next = 24;
                break;
              }

              _context.next = 23;
              return 0;

            case 23:
              return _context.abrupt("return");

            case 24:
              return _context.abrupt("break", 25);

            case 25:
              _context.next = 27;
              return sample * amount;

            case 27:
              _iteratorNormalCompletion = true;
              _context.next = 6;
              break;

            case 30:
              _context.next = 36;
              break;

            case 32:
              _context.prev = 32;
              _context.t1 = _context["catch"](4);
              _didIteratorError = true;
              _iteratorError = _context.t1;

            case 36:
              _context.prev = 36;
              _context.prev = 37;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 39:
              _context.prev = 39;

              if (!_didIteratorError) {
                _context.next = 42;
                break;
              }

              throw _iteratorError;

            case 42:
              return _context.finish(39);

            case 43:
              return _context.finish(36);

            case 44:
            case "end":
              return _context.stop();
          }
        }
      }, samples, this, [[4, 32, 36, 44], [37,, 39, 43]]);
    })
  }]);

  return Adsr;
}();