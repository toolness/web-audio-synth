class Noise {
  constructor(sampleRate) {
    this.sampleRate = sampleRate;
    this.freq = 220;
  }

  set freq(hz) {
    this._freq = hz;

    let period = Math.floor(this.sampleRate / this._freq);

    this._samples = [];
    for (let i = 0; i < period; i++) {
      this._samples.push(Math.random() * 2 - 1);
    }
  }

  get freq() {
    return this._freq;
  }

  signal() {
    let self = this;

    function *signalGenerator() {
      while (true) {
        for (let i = 0; i < self._samples.length; i++) {
          yield self._samples[i];
        }
      }
    }

    return signalGenerator();
  };
}
