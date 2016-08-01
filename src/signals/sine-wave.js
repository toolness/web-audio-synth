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

  *signal() {
    while (true) {
      let period = Math.floor(this.sampleRate / this._freq);

      for (let i = 0; i < period; i++) {
        yield Math.sin(i * 2 * Math.PI / period);
      }
    }
  }
}
