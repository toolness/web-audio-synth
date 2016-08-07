class AudioEngine {
  constructor() {
    this._audioCtx = new AudioContext();
    this._bufferSource = null;
    this._scriptNode = null;
    this._source = null;
    this._sourceSamples = null;
    this._deactivateTimeout = null;
    this._initMidi();
  }

  activate(source) {
    clearTimeout(this._deactivateTimeout);
    this._deactivateTimeout = null;

    if (this._source !== source) {
      this._source = source;
      this._sourceSamples = source.samples();
    }

    if (!this._bufferSource) {
      const BUFFER_SIZE = 1024;

      this._scriptNode = this._audioCtx.createScriptProcessor(
        BUFFER_SIZE,
        1,
        1
      );
      this._scriptNode.onaudioprocess = this._processAudio.bind(this);
      this._bufferSource = this._audioCtx.createBufferSource();
      this._bufferSource.connect(this._scriptNode);
      this._scriptNode.connect(this._audioCtx.destination);
      this._bufferSource.start();
    }
  }

  _deactivate() {
    this._bufferSource.stop();
    this._bufferSource.disconnect(this._scriptNode);
    this._scriptNode.disconnect(this._audioCtx.destination);
    this._scriptNode = null;
    this._bufferSource = null;
    this._sourceSamples = null;
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
    const CONTROL_CHANGE = 0xb0;

    let [midiType, note, velocity] = e.data;
    let programNumber, type, controllerNumber, controllerValue,
        controllerPercentage;
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
    } else if (midiType === CONTROL_CHANGE) {
      type = 'controlchange';
      controllerNumber = e.data[1];
      controllerValue = e.data[2];
      controllerPercentage = controllerValue / 127;
    }

    if (type && typeof(this.onmidi) === 'function') {
      this.onmidi({type, note, velocity, freq, programNumber,
                   controllerNumber, controllerValue,
                   controllerPercentage});
    }
  }

  _processAudio(e) {
    if (!this._sourceSamples) return;

    let outputBuffer = e.outputBuffer;

    for (let chan = 0; chan < e.outputBuffer.numberOfChannels; chan++) {
      let data = e.outputBuffer.getChannelData(chan);

      for (let i = 0; i < e.outputBuffer.length; i++) {
        let next = this._sourceSamples.next();
        if (next.done) {
          if (this._deactivateTimeout === null) {
            const DEACTIVATE_DELAY = 3000;
            this._source = null;
            this._deactivateTimeout = setTimeout(
              this._deactivate.bind(this),
              DEACTIVATE_DELAY
            );
          }
          for (; i < e.outputBuffer.length; i++) {
            data[i] = 0;
          }
          return;
        }
        data[i] = next.value;
      }
    }
  }
}
