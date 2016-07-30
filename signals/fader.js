class Fader {
  constructor(sampleRate, fadeSeconds) {
    this.sampleRate = sampleRate;
    this.source = null;
    this._fade = 0;
    this._baseFadeSlope = 1 / (sampleRate * fadeSeconds);
    this._fadeSlope = 0;
  }

  set source(source) {
    if (source !== this._source) {
      this._source = source;
      this._sourceSignal = source ? source.signal() : null;
    }
  }

  fadeIn() {
    this._fadeSlope = this._baseFadeSlope;
  }

  fadeOut() {
    this._fadeSlope = -this._baseFadeSlope;
  }

  signal() {
    let self = this;

    function *signalGenerator() {
      while (true) {
        if (self._sourceSignal) {
          if (self._fade) {
            let value = self._sourceSignal.next().value;

            yield value * self._fade;
          } else {
            yield 0;
          }
        } else {
          yield 0;
        }

        self._fade += self._fadeSlope;

        if (self._fade < 0) {
          self._fade = 0;
          self._fadeSlope = 0;
        } else if (self._fade > 1) {
          self._fade = 1;
          self._fadeSlope = 0;
        }
      }
    }

    return signalGenerator();
  }
}
