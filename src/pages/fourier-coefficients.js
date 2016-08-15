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

function makeFourierWave(sampleRate, type, n) {
  let trigFn = {
    a: Math.cos,
    b: Math.sin
  }[type];

  return new TransformSignal(makeWave(sampleRate), (sample, i) => {
    return sample * trigFn(n * FUNDAMENTAL_ANG_VEL * (i / sampleRate));
  });
}

function integrateOver(sampleRate, seconds, waveFactory) {
  let sum = 0;
  let samples = waveFactory(sampleRate);

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
  yield *makeFourierWave(sampleRate, 'a', 1).samples();
};

const a_2_iter = function *(sampleRate) {
  yield *makeFourierWave(sampleRate, 'a', 2).samples();
};

const b_1_iter = function *(sampleRate) {
  yield *makeFourierWave(sampleRate, 'b', 1).samples();
};

const b_2_iter = function *(sampleRate) {
  yield *makeFourierWave(sampleRate, 'b', 2).samples();
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

const fourier_series_iter = function *(sampleRate, seconds) {
  const integral = integrateOver.bind(null, sampleRate, seconds);
  const T = sampleRate * seconds;

  const a_0 = (1 / T) * integral(a_0_iter);
  const a_1 = (2 / T) * integral(a_1_iter);
  const a_2 = (2 / T) * integral(a_2_iter);
  const b_1 = (2 / T) * integral(b_1_iter);
  const b_2 = (2 / T) * integral(b_2_iter);

  let samples = zipIterators(
    a_1_iter(sampleRate),
    b_1_iter(sampleRate),
    a_2_iter(sampleRate),
    b_2_iter(sampleRate)
  );

  console.log('a_0', a_0, 'a_1', a_1, 'b_1', b_1, 'a_2', a_2, 'b_2', b_2);

  for (let [a_1s, b_1s, a_2s, b_2s] of samples) {
    let sample = (
      a_0
      + a_1 * a_1s
      + b_1 * b_1s
      + a_2 * a_2s
      + b_2 * b_2s
    );
    yield sample;
  }
};

drawGraph('#a_0', a_0_iter);

drawGraph('#a_1', a_1_iter);

drawGraph('#b_1', b_1_iter);

drawGraph('#a_2', a_2_iter);

drawGraph('#b_2', b_2_iter);

drawGraph('#fourier_series', fourier_series_iter);
