"use strict";

/* global TriangleWave, PulseWave, Amplifier, SineWave,
 *        AudioEngine, Fader */

var engine = new AudioEngine();
var triangleWave = new TriangleWave(engine.sampleRate);
var pulseWave = new PulseWave(engine.sampleRate);
var quietPulseWave = new Amplifier(pulseWave, 0.5);
var sineWave = new SineWave(engine.sampleRate);

var MIDI_SOURCES = [pulseWave, triangleWave, sineWave];
var DEFAULT_DUTY_CYCLE = 0.5;

var midiFader = new Fader(engine.sampleRate, 0.01);
var midiAmp = new Amplifier(midiFader, 1);
var midiSource = void 0;
var $ = document.querySelector.bind(document);

function setMidiSource(index) {
  midiSource = MIDI_SOURCES[index % MIDI_SOURCES.length];
  $('#midi-source').textContent = midiSource.constructor.name;
}

function setDutyCycle(percentage) {
  if (typeof percentage === 'undefined') {
    percentage = parseFloat(sessionStorage['dutyCycle']);
    if (isNaN(percentage)) {
      percentage = DEFAULT_DUTY_CYCLE;
    }
  }
  pulseWave.dutyCycle.value = percentage;
  $('#duty-cycle').textContent = Math.floor(percentage * 100) + '%';
  sessionStorage['dutyCycle'] = percentage;
}

engine.onmidi = function (e) {
  if (e.type === 'noteon') {
    // midiAmp.amount = e.velocity / 100;
    midiFader.source = midiSource;
    midiFader.fadeIn();
    midiSource.freq.value = e.freq;
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