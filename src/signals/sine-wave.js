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
    let angle = 0;

    for (let freq of this._freq.samples()) {
      let period = Math.floor(this.sampleRate / freq);
      let angularVelocity = 2 * Math.PI / period;
      angle += angularVelocity;
      yield Math.sin(angle);
    }
  }
}
