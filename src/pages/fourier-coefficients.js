"use strict";

/* global drawGraph, SineWave, PulseWave */

const FUNDAMENTAL_FREQ = 1;
const FUNDAMENTAL_PERIOD = 1 / FUNDAMENTAL_FREQ;
const FUNDAMENTAL_ANG_VEL = 2 * Math.PI / FUNDAMENTAL_PERIOD;

function makeWave(sampleRate) {
  let pulse = new PulseWave(sampleRate);

  pulse.freq.value = FUNDAMENTAL_FREQ;

  return pulse;
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

drawGraph('#a_0', a_0_iter);

drawGraph('#a_1', a_1_iter);

drawGraph('#b_1', b_1_iter);

drawGraph('#a_2', a_2_iter);

drawGraph('#b_2', b_2_iter);
