class TriangleWave {
  constructor(sampleRate) {
    this.sampleRate = sampleRate;
    this._freq = 220;
    this._recompute();
  }

  set freq(hz) {
    this._freq = hz;
    this._recompute();
  }

  get freq() {
    return this._freq;
  }

  _recompute() {
    let period = Math.floor(this.sampleRate / this._freq);

    this._slope = 2 / (period / 2);
  }

  signal() {
    const SIGNAL_LOW = -1;
    const SIGNAL_HIGH = 1;

    let self = this;
    let slope = this._slope;
    let signal = 0;

    function *signalGenerator() {
      while (true) {
        yield signal;

        signal += slope;

        if (slope > 0) {
          if (signal >= SIGNAL_HIGH) {
            signal = SIGNAL_HIGH;
            slope = -self._slope;
          }
        } else {
          if (signal <= SIGNAL_LOW) {
            signal = SIGNAL_LOW;
            slope = self._slope;
          }
        }
      }
    }

    return signalGenerator();
  };
}