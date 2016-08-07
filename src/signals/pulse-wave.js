"use strict";

/* global Constant */

class PulseWave {
  constructor(sampleRate) {
    this.sampleRate = sampleRate;
    this._dutyCycle = new Constant(0.5);
    this._freq = new Constant(220);
  }

  set freq(freq) {
    this._freq = freq;
  }

  get freq() {
    return this._freq;
  }

  set dutyCycle(dutyCycle) {
    this._dutyCycle = dutyCycle;
  }

  get dutyCycle() {
    return this._dutyCycle;
  }

  _recompute(freq, dutyCycle) {
    let period = Math.floor(this.sampleRate / freq);

    this._highSamplesPerPeriod = Math.floor(period * dutyCycle);
    this._lowSamplesPerPeriod = period - this._highSamplesPerPeriod;
  }

  *samples() {
    const SIGNAL_LOW = -1;
    const SIGNAL_HIGH = 1;

    let freqSamples = this._freq.samples();
    let dutyCycleSamples = this._dutyCycle.samples();
    let signal = SIGNAL_HIGH;
    let samplesUntilSignalFlip = 0;

    while (true) {
      let freq = freqSamples.next().value;
      let dutyCycle = dutyCycleSamples.next().value;

      if (samplesUntilSignalFlip == 0) {
        this._recompute(freq, dutyCycle);
        if (signal === SIGNAL_LOW) {
          signal = SIGNAL_HIGH;
          samplesUntilSignalFlip = this._highSamplesPerPeriod;
        } else {
          signal = SIGNAL_LOW;
          samplesUntilSignalFlip = this._lowSamplesPerPeriod;
        }
      } else {
        samplesUntilSignalFlip--;
      }
      yield signal;
    }
  };
}
