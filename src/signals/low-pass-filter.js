class LowPassFilter {
  constructor(source, samplesToAverage) {
    this._source = source;
    this.samplesToAverage = samplesToAverage || 1;
  }

  *samples() {
    let samples = [];
    let sourceSamples = this._source.samples();

    while (true) {
      samples.push(sourceSamples.next().value);
      if (samples.length > this.samplesToAverage) {
        samples.splice(0, samples.length - this.samplesToAverage);
      }
      yield samples.reduce((sum, current) => {
        return sum + current;
      }, 0) / samples.length;
    }
  }
}
