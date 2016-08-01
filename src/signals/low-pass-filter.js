class LowPassFilter {
  constructor(source, samplesToAverage) {
    this._source = source;
    this.samplesToAverage = samplesToAverage || 1;
  }

  *signal() {
    let samples = [];
    let sourceSignal = this._source.signal();

    while (true) {
      samples.push(sourceSignal.next().value);
      if (samples.length > this.samplesToAverage) {
        samples.splice(0, samples.length - this.samplesToAverage);
      }
      yield samples.reduce((sum, current) => {
        return sum + current;
      }, 0) / samples.length;
    }
  }
}
