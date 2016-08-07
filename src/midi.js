"use strict";

/* global TriangleWave, PulseWave, Amplifier, SineWave,
 *        AudioEngine, Fader, Constant */

let engine = new AudioEngine();

const MIDI_SOURCES = [
  {
    name: PulseWave.name,
    create(freq) {
      let pulseWave = new PulseWave(engine.sampleRate);

      pulseWave.freq = freq;
      pulseWave.dutyCycle = dutyCycle;

      return pulseWave;
    }
  },
  {
    name: TriangleWave.name,
    create(freq) {
      let triangleWave = new TriangleWave(engine.sampleRate);

      triangleWave.freq = freq;
      return triangleWave;
    }
  },
  {
    name: SineWave.name,
    create(freq) {
      let sineWave = new SineWave(engine.sampleRate);

      sineWave.freq = freq;
      return sineWave;
    }
  }
];
const DEFAULT_DUTY_CYCLE = 0.5;

let dutyCycle = new Constant(DEFAULT_DUTY_CYCLE);
let midiSource;
let $ = document.querySelector.bind(document);

function setMidiSource(index) {
  midiSource = MIDI_SOURCES[index % MIDI_SOURCES.length];
  $('#midi-source').textContent = midiSource.name;
}

function setDutyCycle(percentage) {
  if (typeof(percentage) === 'undefined') {
    percentage = parseFloat(sessionStorage['dutyCycle']);
    if (isNaN(percentage)) {
      percentage = DEFAULT_DUTY_CYCLE;
    }
  }
  dutyCycle.value = percentage;
  $('#duty-cycle').textContent = Math.floor(percentage * 100) + '%';
  sessionStorage['dutyCycle'] = percentage;
}

engine.onmidi = e => {
  if (e.type === 'noteon') {
    console.log(e.noteString);
    chord.on(e.note, e.freq);
    engine.activate(chord);
  } else if (e.type === 'noteoff') {
    chord.off(e.note);
  } else if (e.type === 'programchange') {
    setMidiSource(e.programNumber);
  } else if (e.type === 'controlchange') {
    if (e.controllerNumber === 1) {
      setDutyCycle(e.controllerPercentage);
    }
  }
};

class Chord {
  constructor(maxNotes) {
    this._sources = new Map();
    this._maxNotes = maxNotes;
  }

  on(note, freq) {
    if (this._sources.has(note)) {
      this._sources.get(note).fadeIn();
    } else {
      const FADE_SECONDS = 0.01;

      let source = midiSource.create(new Constant(freq));
      let fader = new Fader(engine.sampleRate, FADE_SECONDS);

      fader.source = source;
      fader.fadeIn();

      this._sources.set(note, fader);
    }
  }

  off(note) {
    this._sources.get(note).fadeOut();
  }

  *samples() {
    let toDelete = [];
    let samplesMap = new Map();

    while (true) {
      let sample = 0;

      for (let [note, source] of this._sources) {
        if (!samplesMap.has(source)) {
          samplesMap.set(source, source.samples());
        }
        let samples = samplesMap.get(source);
        let next = samples.next();
        if (next.done) {
          toDelete.push([note, source]);
        } else {
          sample += next.value;
        }
      }

      if (toDelete.length) {
        for (let [note, source] of toDelete) {
          samplesMap.delete(source);
          this._sources.delete(note);
        }
        toDelete = [];
      }

      yield sample / this._maxNotes;

      if (this._sources.size === 0)
        return;
    }
  }
}

let chord = new Chord(3);

setMidiSource(0);
setDutyCycle();
