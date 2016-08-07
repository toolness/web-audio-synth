"use strict";

/* global Constant */

class SineWave {
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

  *samples() {
    let freqSamples = this._freq.samples();
    let freq = freqSamples.next().value;

    while (true) {
      let period = Math.floor(this.sampleRate / freq);

      for (let i = 0; i < period; i++) {
        yield Math.sin(i * 2 * Math.PI / period);
        freq = freqSamples.next().value;
      }
    }
  }
}
