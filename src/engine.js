class AudioEngine {
  constructor() {
    const BUFFER_SIZE = 1024;

    this._audioCtx = new AudioContext();
    this._bufferSource = this._audioCtx.createBufferSource();
    this._bufferSourceStarted = false;
    this._scriptNode = this._audioCtx.createScriptProcessor(
      BUFFER_SIZE,
      1,
      1
    );

    this._bufferSource.connect(this._scriptNode);
    this._scriptNode.connect(this._audioCtx.destination);
    this._scriptNode.onaudioprocess = this._processAudio.bind(this);
    this._source = null;
    this._started = false;
    this._initMidi();
  }

  activate(source) {
    if (this._source !== source) {
      this._source = source;
      this._sourceSamples = source.samples();
    }

    if (!this._started) {
      this._bufferSource.start();
      this._started = true;
    }
  }

  get sampleRate() {
    return this._audioCtx.sampleRate;
  }

  _initMidi() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({
        sysex: false
      }).then(midi => {
        for (let input of midi.inputs.values()) {
          input.onmidimessage = this._onMidiMessage.bind(this);
        }
      }, () => {
        console.log("MIDI failed to init.");
      });
    }
  }

  // https://www.w3.org/TR/webmidi/
  // https://www.midi.org/specifications/item/table-1-summary-of-midi-message
  _onMidiMessage(e) {
    const NOTE_ON = 0x90;
    const NOTE_OFF = 0x80;
    const PROGRAM_CHANGE = 0xc0;

    let [midiType, note, velocity] = e.data;
    let programNumber = null;
    let type = null;
    let freq = 440 * Math.pow(2, (note - 69) / 12);

    midiType = midiType & 0xf0;

    if (midiType === NOTE_ON && velocity === 0) {
      // Apparently MIDI can be weird.
      midiType = NOTE_OFF;
    }

    if (midiType === NOTE_ON) {
      type = 'noteon';
    } else if (midiType === NOTE_OFF) {
      type = 'noteoff';
    } else if (midiType === PROGRAM_CHANGE) {
      type = 'programchange';
      programNumber = e.data[1];
    }

    if (type && typeof(this.onmidi) === 'function') {
      this.onmidi({type, note, velocity, freq, programNumber});
    }
  }

  _processAudio(e) {
    if (!this._sourceSamples) return;

    let outputBuffer = e.outputBuffer;

    for (let chan = 0; chan < e.outputBuffer.numberOfChannels; chan++) {
      let data = e.outputBuffer.getChannelData(chan);

      for (let i = 0; i < e.outputBuffer.length; i++) {
        data[i] = this._sourceSamples.next().value;
      }
    }
  }
}
