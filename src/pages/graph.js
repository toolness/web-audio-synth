"use strict";

/* global drawGraph, Constant, SineWave, Adsr */

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

class FunctionSignal {
  constructor(f) {
    this._f = f;
  }

  *samples() {
    for (let i = 0; i < Infinity; i++) {
      yield this._f(i);
    }
  }
}

drawGraph('#sine-fm', function *(sampleRate, seconds, totalSamples) {
  let signal = new SineWave(sampleRate);
  let startFreq = 1;
  let endFreq = 10;
  let freqDelta = endFreq - startFreq;

  document.querySelector('#sine-fm-start').textContent = startFreq;
  document.querySelector('#sine-fm-end').textContent = endFreq;

  signal.freq = new FunctionSignal(i => {
    return startFreq + freqDelta * (i / totalSamples);
  });

  yield *signal.samples();
});

drawGraph('#sine-add', function *(sampleRate) {
  let sine1 = new SineWave(sampleRate);
  let sine2 = new SineWave(sampleRate);

  let sine1Part = 0.75;
  let sine2Part = 1 - sine1Part;

  sine1.freq.value = 1;
  sine2.freq.value = 50;

  for (let [s1, s2] of zipIterators(sine1.samples(), sine2.samples())) {
    yield s1 * sine1Part + s2 * sine2Part;
  }
});

drawGraph('#sine-adsr', function *(sampleRate, seconds, totalSamples) {
  let sine = new SineWave(sampleRate);
  let attack = seconds / 4;
  let decay = seconds / 8;
  let release = seconds / 6;
  let sustain = 0.75;
  let adsr = new Adsr(sampleRate, sine, attack, decay, sustain, release);
  let samples = adsr.samples();

  sine.freq.value = 25;

  for (let i = 0; i < totalSamples - (sampleRate * release); i++) {
    yield samples.next().value;
  }

  adsr.startRelease();

  yield *samples;
});
