"use strict";

/* global TriangleWave, PulseWave, Amplifier, SineWave,
 *        AudioEngine, Fader */

let engine = new AudioEngine();
let triangleWave = new TriangleWave(engine.sampleRate);
let pulseWave = new PulseWave(engine.sampleRate);
let quietPulseWave = new Amplifier(pulseWave, 0.5);
let sineWave = new SineWave(engine.sampleRate);

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
