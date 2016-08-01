class Noise {
  *signal() {
    while (true) {
      yield Math.random() * 2 - 1;
    }
  }
}
