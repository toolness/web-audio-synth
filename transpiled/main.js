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
  pulseWave.freq = Math.floor(20 + x * 800);
  pulseWave.dutyCycle = y;

  var dc = Math.floor(pulseWave.dutyCycle * 100);

  return pulseWave.freq + " hz, " + dc + "% duty cycle";
});

Pad.bind(engine, '#triangle', triangleWave, function (x, y) {
  triangleWave.freq = Math.floor(20 + x * 800);

  return triangleWave.freq + " hz";
});

Pad.bind(engine, '#sine', sineWave, function (x, y) {
  sineWave.freq = Math.floor(20 + x * 800);

  return sineWave.freq + " hz";
});

Pad.bind(engine, '#noise', noise, function (x, y) {
  noise.samplesToAverage = Math.floor(1 + x * 100);

  return "averaged over " + noise.samplesToAverage + " samples";
});