"use strict";

/* global TriangleWave, PulseWave, Amplifier, SineWave, Noise,
 *        AudioEngine, Pad, LowPassFilter */

var engine = new AudioEngine();
var triangleWave = new TriangleWave(engine.sampleRate);
var pulseWave = new PulseWave(engine.sampleRate);
var quietPulseWave = new Amplifier(pulseWave, 0.5);
var sineWave = new SineWave(engine.sampleRate);
var noise = new LowPassFilter(new Noise());

Pad.bind(engine, '#pulse', quietPulseWave, function (x, y) {
  pulseWave.freq.value = Math.floor(20 + x * 800);
  pulseWave.dutyCycle.value = y;

  var dc = Math.floor(pulseWave.dutyCycle.value * 100);

  return pulseWave.freq.value + " hz, " + dc + "% duty cycle";
});

Pad.bind(engine, '#triangle', triangleWave, function (x, y) {
  triangleWave.freq.value = Math.floor(20 + x * 800);

  return triangleWave.freq.value + " hz";
});

Pad.bind(engine, '#sine', sineWave, function (x, y) {
  sineWave.freq.value = Math.floor(20 + x * 800);

  return sineWave.freq.value + " hz";
});

Pad.bind(engine, '#noise', noise, function (x, y) {
  noise.samplesToAverage = Math.floor(1 + x * 100);

  return "averaged over " + noise.samplesToAverage + " samples";
});