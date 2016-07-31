class Noise {
  constructor(sampleRate) {
    this.sampleRate = sampleRate;
  }

  signal() {
    const NUM_SIGNALS = 5;
    const BASE_FREQ = 440;
    const FREQ_VARIANCE = 200;

    let signals = [];

    for (let i = 0; i < NUM_SIGNALS; i++) {
      let wave = new SineWave(this.sampleRate);
      wave.freq = BASE_FREQ + Math.floor(
        (Math.random() * 2 - 1) * FREQ_VARIANCE
      );
      signals.push(wave.signal());
    }

    function *signalGenerator() {
      while (true) {
        yield signals.reduce((sum, signal) => {
          return sum + signal.next().value / signals.length;
        }, 0);
//        yield Math.random() * 2 - 1;
      }
    }

    return signalGenerator();
  };
}
