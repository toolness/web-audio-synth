"use strict";

let audioCtx = new AudioContext();
let source = audioCtx.createBufferSource();
let scriptNode = audioCtx.createScriptProcessor(1024, 1, 1);

source.connect(scriptNode);
scriptNode.connect(audioCtx.destination);
source.start();

scriptNode.onaudioprocess = e => {
  let outputBuffer = e.outputBuffer;

  for (let chan = 0; chan < e.outputBuffer.numberOfChannels; chan++) {
    let data = e.outputBuffer.getChannelData(chan);

    for (let i = 0; i < e.outputBuffer.length; i++) {
      data[i] = squareWaveSignal.next().value;
    }
  }
};

function stop() {
  scriptNode.disconnect(audioCtx.destination);
}

class SquareWave {
  constructor(sampleRate) {
    this.sampleRate = sampleRate;
    this.freq = 220;
  }

  set freq(hz) {
    this._freq = hz;
    this._samplesPerSignalFlip = Math.floor((this.sampleRate / hz) / 2);
  }

  get freq() {
    return this._freq;
  }

  signal() {
    let self = this;
    let signal = 1;
    let samplesUntilSignalFlip = 0;

    function *signalGenerator() {
      while (true) {
        if (samplesUntilSignalFlip == 0) {
          signal = -signal;
          samplesUntilSignalFlip = self._samplesPerSignalFlip;
        } else {
          samplesUntilSignalFlip--;
        }
        yield signal;
      }
    }

    return signalGenerator();
  };
}

let squareWave = new SquareWave(audioCtx.sampleRate);
let squareWaveSignal = squareWave.signal();

setInterval(() => {
  squareWave.freq += 1;
}, 5);
