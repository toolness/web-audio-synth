"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PulseWave = function () {
  function PulseWave(sampleRate) {
    _classCallCheck(this, PulseWave);

    this.sampleRate = sampleRate;
    this._dutyCycle = 0.5;
    this._freq = 220;
    this._recompute();
  }

  _createClass(PulseWave, [{
    key: "_recompute",
    value: function _recompute() {
      var period = Math.floor(this.sampleRate / this._freq);

      this._highSamplesPerPeriod = Math.floor(period * this._dutyCycle);
      this._lowSamplesPerPeriod = period - this._highSamplesPerPeriod;
    }
  }, {
    key: "signal",
    value: function signal() {
      var _marked = [signalGenerator].map(regeneratorRuntime.mark);

      var SIGNAL_LOW = -1;
      var SIGNAL_HIGH = 1;

      var self = this;
      var signal = SIGNAL_LOW;
      var samplesUntilSignalFlip = self._lowSamplesPerPeriod;

      function signalGenerator() {
        return regeneratorRuntime.wrap(function signalGenerator$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!true) {
                  _context.next = 6;
                  break;
                }

                if (samplesUntilSignalFlip == 0) {
                  if (signal === SIGNAL_LOW) {
                    signal = SIGNAL_HIGH;
                    samplesUntilSignalFlip = self._highSamplesPerPeriod;
                  } else {
                    signal = SIGNAL_LOW;
                    samplesUntilSignalFlip = self._lowSamplesPerPeriod;
                  }
                } else {
                  samplesUntilSignalFlip--;
                }
                _context.next = 4;
                return signal;

              case 4:
                _context.next = 0;
                break;

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _marked[0], this);
      }

      return signalGenerator();
    }
  }, {
    key: "freq",
    set: function set(hz) {
      this._freq = hz;
      this._recompute();
    },
    get: function get() {
      return this._freq;
    }
  }, {
    key: "dutyCycle",
    set: function set(ratio) {
      this._dutyCycle = ratio;
      this._recompute();
    },
    get: function get() {
      return this._dutyCycle;
    }
  }]);

  return PulseWave;
}();