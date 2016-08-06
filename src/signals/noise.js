class Noise {
  *samples() {
    while (true) {
      yield Math.random() * 2 - 1;
    }
  }
}
