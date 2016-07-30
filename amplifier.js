class Amplifier {
  constructor(source, amount) {
    this.amount = amount;
    this._source = source;
  }

  signal() {
    let self = this;
    let sourceSignal = this._source.signal();

    function *signalGenerator() {
      while (true) {
        let value = sourceSignal.next().value * self.amount;
        yield value;
      }
    }

    return signalGenerator();
  }
}
