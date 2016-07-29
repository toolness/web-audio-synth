class Noise {
  signal() {
    function *signalGenerator() {
      while (true) {
        yield Math.random() * 2 - 1;
      }
    }

    return signalGenerator();
  };
}
