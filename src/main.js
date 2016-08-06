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

// Here is some temporary MIDI stuff.

/* global Fader */

const MIDI_SOURCES = [pulseWave, triangleWave, sineWave];

let midiFader = new Fader(engine.sampleRate, 0.01);
let midiAmp = new Amplifier(midiFader, 1);
let midiSource = MIDI_SOURCES[0];

engine.onmidi = e => {
  if (e.type === 'noteon') {
    // midiAmp.amount = e.velocity / 100;
    midiFader.source = midiSource;
    midiFader.fadeIn();
    midiSource.freq = e.freq;
    engine.activate(midiAmp);
  } else if (e.type === 'noteoff') {
    midiFader.fadeOut();
  } else if (e.type === 'programchange') {
    midiSource = MIDI_SOURCES[e.programNumber % MIDI_SOURCES.length];
  } else if (e.type === 'controlchange') {
    if (e.controllerNumber === 1) {
      pulseWave.dutyCycle = e.controllerPercentage;
    }
  }
};
