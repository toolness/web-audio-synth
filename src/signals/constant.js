class Constant {
  constructor(value) {
    this.value = value;
  }

  *samples() {
    while (true) {
      yield this.value;
    }
  }
}
