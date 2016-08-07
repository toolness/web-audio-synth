"use strict";

/* global TriangleWave, PulseWave, Amplifier, SineWave,
 *        AudioEngine, Fader */

let engine = new AudioEngine();
let triangleWave = new TriangleWave(engine.sampleRate);
let pulseWave = new PulseWave(engine.sampleRate);
let quietPulseWave = new Amplifier(pulseWave, 0.5);
let sineWave = new SineWave(engine.sampleRate);

const MIDI_SOURCES = [pulseWave, triangleWave, sineWave];
const DEFAULT_DUTY_CYCLE = 0.5;

let midiFader = new Fader(engine.sampleRate, 0.01);
let midiAmp = new Amplifier(midiFader, 1);
let midiSource;
let $ = document.querySelector.bind(document);

function setMidiSource(index) {
  midiSource = MIDI_SOURCES[index % MIDI_SOURCES.length];
  $('#midi-source').textContent = midiSource.constructor.name;
}

function setDutyCycle(percentage) {
  if (typeof(percentage) === 'undefined') {
    percentage = parseFloat(sessionStorage['dutyCycle']);
    if (isNaN(percentage)) {
      percentage = DEFAULT_DUTY_CYCLE;
    }
  }
  pulseWave.dutyCycle = percentage;
  $('#duty-cycle').textContent = Math.floor(percentage * 100) + '%';
  sessionStorage['dutyCycle'] = percentage;
}

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
    setMidiSource(e.programNumber);
  } else if (e.type === 'controlchange') {
    if (e.controllerNumber === 1) {
      setDutyCycle(e.controllerPercentage);
    }
  }
};

setMidiSource(0);
setDutyCycle();
