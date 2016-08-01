class PulseWave {
  constructor(sampleRate) {
    this.sampleRate = sampleRate;
    this._dutyCycle = 0.5;
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

  set dutyCycle(ratio) {
    this._dutyCycle = ratio;
    this._recompute();
  }

  get dutyCycle() {
    return this._dutyCycle;
  }

  _recompute() {
    let period = Math.floor(this.sampleRate / this._freq);

    this._highSamplesPerPeriod = Math.floor(period * this._dutyCycle);
    this._lowSamplesPerPeriod = period - this._highSamplesPerPeriod;
  }

  *signal() {
    const SIGNAL_LOW = -1;
    const SIGNAL_HIGH = 1;

    let signal = SIGNAL_LOW;
    let samplesUntilSignalFlip = this._lowSamplesPerPeriod;

    while (true) {
      if (samplesUntilSignalFlip == 0) {
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
