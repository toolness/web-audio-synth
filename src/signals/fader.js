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
      this._sourceSamples = source ? source.samples() : null;
    }
  }

  fadeIn() {
    this._fadeSlope = this._baseFadeSlope;
  }

  fadeOut() {
    this._fadeSlope = -this._baseFadeSlope;
  }

  *samples() {
    while (true) {
      if (this._sourceSamples) {
        if (this._fade) {
          let value = this._sourceSamples.next().value;

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
        return;
      } else if (this._fade > 1) {
        this._fade = 1;
        this._fadeSlope = 0;
      }
    }
  }
}
