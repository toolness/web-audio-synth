"use strict";

/* global drawGraph, TriangleWave */

const FUNDAMENTAL_FREQ = 1;
const FUNDAMENTAL_PERIOD = 1 / FUNDAMENTAL_FREQ;
const FUNDAMENTAL_ANG_VEL = 2 * Math.PI / FUNDAMENTAL_PERIOD;

function makeWave(sampleRate) {
  let wave = new TriangleWave(sampleRate);

  wave.freq.value = FUNDAMENTAL_FREQ;

  return wave;
}

function makeFourierWave(waveFactory, sampleRate, type, n) {
  let trigFn = {
    a: Math.cos,
    b: Math.sin
  }[type];

  return new TransformSignal(waveFactory(sampleRate), (sample, i) => {
    return sample * trigFn(n * FUNDAMENTAL_ANG_VEL * (i / sampleRate));
  });
}

function integrateOver(sampleRate, seconds, waveFactory) {
  let sum = 0;
  let samples;

  if (typeof(waveFactory) === 'function') {
    samples = waveFactory(sampleRate);
  } else {
    samples = waveFactory;
  }

  for (let i = 0; i < sampleRate * seconds; i++) {
    sum += samples.next().value;
  }

  return sum;
}

class TransformSignal {
  constructor(source, f) {
    this.source = source;
    this._f = f;
  }

  *samples() {
    let i = 0;

    for (let sample of this.source.samples()) {
      yield this._f(sample, i++);
    }
  }
}

const a_0_iter = function *(sampleRate) {
  yield *makeWave(sampleRate).samples();
};

const a_1_iter = function *(sampleRate) {
  yield *makeFourierWave(makeWave, sampleRate, 'a', 1).samples();
};

const a_2_iter = function *(sampleRate) {
  yield *makeFourierWave(makeWave, sampleRate, 'a', 2).samples();
};

const b_1_iter = function *(sampleRate) {
  yield *makeFourierWave(makeWave, sampleRate, 'b', 1).samples();
};

const b_2_iter = function *(sampleRate) {
  yield *makeFourierWave(makeWave, sampleRate, 'b', 2).samples();
};

function *zipIterators() {
  while (true) {
    let values = [];
    for (let i = 0; i < arguments.length; i++) {
      let next = arguments[i].next();
      if (next.done) return;
      values.push(next.value);
    }
    yield values;
  }
}

function buildFourierSeries(waveFactory, iterations) {
  return function *(sampleRate, seconds) {
    const integral = integrateOver.bind(null, sampleRate, seconds);
    const T = sampleRate * seconds;
    const makeFourier = makeFourierWave.bind(null, waveFactory, sampleRate);
    const allWaves = [];
    const allCoefficients = [];

    const a_0 = (1 / T) * integral(waveFactory(sampleRate).samples());

    for (let i = 0; i < iterations; i++) {
      let aWave = makeFourier('a', i + 1);
      let bWave = makeFourier('b', i + 1);

      allWaves.push(aWave.samples(), bWave.samples());
      allCoefficients.push(
        2 / T * integral(aWave.samples()),
        2 / T * integral(bWave.samples())
      );
    }

    for (let samples of zipIterators.apply(null, allWaves)) {
      let sum = a_0;

      for (let i = 0; i < samples.length; i++) {
        sum += allCoefficients[i] * samples[i];
      }

      yield sum;
    }
  };
}

drawGraph('#a_0', a_0_iter);

drawGraph('#a_1', a_1_iter);

drawGraph('#b_1', b_1_iter);

drawGraph('#a_2', a_2_iter);

drawGraph('#b_2', b_2_iter);

drawGraph('#fourier_series', buildFourierSeries(makeWave, 2));
