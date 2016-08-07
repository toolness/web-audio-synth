"use strict";

/* global Constant */

class TriangleWave {
  constructor(sampleRate) {
    this.sampleRate = sampleRate;
    this._freq = new Constant(220);
  }

  set freq(freq) {
    this._freq = freq;
  }

  get freq() {
    return this._freq;
  }

  _recompute(freq) {
    let period = Math.floor(this.sampleRate / freq);

    this._slope = 2 / (period / 2);
  }

  *samples() {
    const SIGNAL_LOW = -1;
    const SIGNAL_HIGH = 1;

    let freqSamples = this._freq.samples();
    let freq = freqSamples.next().value;

    this._recompute(freq);

    let slope = this._slope;
    let signal = 0;

    while (true) {
      yield signal;

      freq = freqSamples.next().value;
      signal += slope;

      if (slope > 0) {
        if (signal >= SIGNAL_HIGH) {
          signal = SIGNAL_HIGH;
          this._recompute(freq);
          slope = -this._slope;
        }
      } else {
        if (signal <= SIGNAL_LOW) {
          signal = SIGNAL_LOW;
          this._recompute(freq);
          slope = this._slope;
        }
      }
    }
  };
}
