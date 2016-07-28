"use strict";

let audioCtx = new AudioContext();
let source = audioCtx.createBufferSource();
let scriptNode = audioCtx.createScriptProcessor(1024, 1, 1);
let squareWave = new SquareWave(audioCtx.sampleRate);
let squareWaveSignal = squareWave.signal();

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

setInterval(() => {
  squareWave.freq += 1;
}, 5);
