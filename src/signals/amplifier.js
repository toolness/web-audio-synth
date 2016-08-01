class Amplifier {
  constructor(source, amount) {
    this.amount = amount;
    this._source = source;
  }

  *signal() {
    let sourceSignal = this._source.signal();

    while (true) {
      let value = sourceSignal.next().value * this.amount;
      yield value;
    }
  }
}
