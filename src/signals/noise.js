class Noise {
  constructor() {
    this.numSamples = 1;
  }

  signal() {
    let self = this;

    function *signalGenerator() {
      let samples = [];

      while (true) {
        samples.push(Math.random() * 2 - 1);
        if (samples.length > self.numSamples) {
          samples.splice(0, samples.length - self.numSamples);
        }
        yield samples.reduce((sum, current) => {
          return sum + current;
        }, 0) / samples.length;
      }
    }

    return signalGenerator();
  };
}
