"use strict";

/* global TriangleWave, PulseWave, Amplifier, SineWave, Noise,
 *        AudioEngine, Pad, LowPassFilter */

let engine = new AudioEngine();
let triangleWave = new TriangleWave(engine.sampleRate);
let pulseWave = new PulseWave(engine.sampleRate);
let quietPulseWave = new Amplifier(pulseWave, 0.5);
let sineWave = new SineWave(engine.sampleRate);
let noise = new LowPassFilter(new Noise());

Pad.bind(engine, '#pulse', quietPulseWave, (x, y) => {
  pulseWave.freq.value = Math.floor(20 + (x * 800));
  pulseWave.dutyCycle.value = y;

  let dc = Math.floor(pulseWave.dutyCycle.value * 100);

  return pulseWave.freq.value + " hz, " + dc + "% duty cycle";
});

Pad.bind(engine, '#triangle', triangleWave, (x, y) => {
  triangleWave.freq.value = Math.floor(20 + (x * 800));

  return triangleWave.freq.value + " hz";
});

Pad.bind(engine, '#sine', sineWave, (x, y) => {
  sineWave.freq.value = Math.floor(20 + (x * 800));

  return sineWave.freq.value + " hz";
});

Pad.bind(engine, '#noise', noise, (x, y) => {
  noise.samplesToAverage = Math.floor(1 + (x * 100));

  return "averaged over " + noise.samplesToAverage + " samples";
});
