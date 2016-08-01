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

  *signal() {
    while (true) {
      if (this._sourceSignal) {
        if (this._fade) {
          let value = this._sourceSignal.next().value;

          yield value * this._fade;
        } else {
          yield 0;
        }
      } else {
        yield 0;
      }

      this._fade += this._fadeSlope;

      if (this._fade < 0) {
        this._fade = 0;
        this._fadeSlope = 0;
      } else if (this._fade > 1) {
        this._fade = 1;
        this._fadeSlope = 0;
      }
    }
  }
}
