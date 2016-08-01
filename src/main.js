"use strict";

/* global TriangleWave, PulseWave, Amplifier, SineWave, Noise,
 *        AudioEngine, Pad */

let engine = new AudioEngine();
let triangleWave = new TriangleWave(engine.sampleRate);
let pulseWave = new PulseWave(engine.sampleRate);
let quietPulseWave = new Amplifier(pulseWave, 0.5);
let sineWave = new SineWave(engine.sampleRate);
let noise = new LowPassFilter(new Noise());

Pad.bind(engine, '#pulse', quietPulseWave, (x, y) => {
  pulseWave.freq = Math.floor(20 + (x * 800));
  pulseWave.dutyCycle = y;

  let dc = Math.floor(pulseWave.dutyCycle * 100);

  return pulseWave.freq + " hz, " + dc + "% duty cycle";
});

Pad.bind(engine, '#triangle', triangleWave, (x, y) => {
  triangleWave.freq = Math.floor(20 + (x * 800));

  return triangleWave.freq + " hz";
});

Pad.bind(engine, '#sine', sineWave, (x, y) => {
  sineWave.freq = Math.floor(20 + (x * 800));

  return sineWave.freq + " hz";
});

Pad.bind(engine, '#noise', noise, (x, y) => {
  noise.samplesToAverage = Math.floor(1 + (x * 100));

  return "averaged over " + noise.samplesToAverage + " samples";
});
