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
  }

  activate(source) {
    if (this._source !== source) {
      this._source = source;
      this._sourceSignal = source.signal();
    }

    if (!this._started) {
      this._bufferSource.start();
      this._started = true;
    }
  }

  get sampleRate() {
    return this._audioCtx.sampleRate;
  }

  _processAudio(e) {
    if (!this._sourceSignal) return;

    let outputBuffer = e.outputBuffer;

    for (let chan = 0; chan < e.outputBuffer.numberOfChannels; chan++) {
      let data = e.outputBuffer.getChannelData(chan);

      for (let i = 0; i < e.outputBuffer.length; i++) {
        data[i] = this._sourceSignal.next().value;
      }
    }
  }
}
