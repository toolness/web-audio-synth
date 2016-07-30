class SineWave {
  constructor(sampleRate) {
    this.sampleRate = sampleRate;
    this._freq = 220;
  }

  set freq(hz) {
    this._freq = hz;
  }

  get freq() {
    return this._freq;
  }

  signal() {
    let self = this;

    function *signalGenerator() {
      while (true) {
        let period = Math.floor(self.sampleRate / self._freq);

        for (let i = 0; i < period; i++) {
          yield Math.sin(i * 2 * Math.PI / period);
        }
      }
    }

    return signalGenerator();
  };
}
