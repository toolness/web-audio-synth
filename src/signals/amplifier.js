class Amplifier {
  constructor(source, amount) {
    this.amount = amount;
    this._source = source;
  }

  *samples() {
    let sourceSamples = this._source.samples();

    for (let nextValue of sourceSamples) {
      yield nextValue * this.amount;
    }
  }
}
