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
    this._dutyCycle = 0.5;
    this._freq = 220;
    this._recompute();
  }

  set freq(hz) {
    this._freq = hz;
    this._recompute();
  }

  get freq() {
    return this._freq;
  }

  set dutyCycle(ratio) {
    this._dutyCycle = ratio;
    this._recompute();
  }

  get dutyCycle() {
    return this._dutyCycle;
  }

  _recompute() {
    let period = Math.floor(this.sampleRate / this._freq);

    this._highSamplesPerPeriod = Math.floor(period * this._dutyCycle);
    this._lowSamplesPerPeriod = period - this._highSamplesPerPeriod;
  }

  signal() {
    const SIGNAL_LOW = -1;
    const SIGNAL_HIGH = 1;

    let self = this;
    let signal = SIGNAL_LOW;
    let samplesUntilSignalFlip = self._lowSamplesPerPeriod;

    function *signalGenerator() {
      while (true) {
        if (samplesUntilSignalFlip == 0) {
          if (signal === SIGNAL_LOW) {
            signal = SIGNAL_HIGH;
            samplesUntilSignalFlip = self._highSamplesPerPeriod;
          } else {
            signal = SIGNAL_LOW;
            samplesUntilSignalFlip = self._lowSamplesPerPeriod;
          }
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
