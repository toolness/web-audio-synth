"use strict";

let audioCtx = new AudioContext();
let source = audioCtx.createBufferSource();
let scriptNode = audioCtx.createScriptProcessor(1024, 1, 1);
let triangleWave = new TriangleWave(audioCtx.sampleRate);
let pulseWave = new PulseWave(audioCtx.sampleRate);
let noise = new Noise();
let currSignal = null;

function bindPad(el, source) {
  el.onmousedown = e => {
    currSignal = source.signal();
  };
}

source.connect(scriptNode);
scriptNode.connect(audioCtx.destination);
source.start();

scriptNode.onaudioprocess = e => {
  let outputBuffer = e.outputBuffer;

  for (let chan = 0; chan < e.outputBuffer.numberOfChannels; chan++) {
    let data = e.outputBuffer.getChannelData(chan);

    for (let i = 0; i < e.outputBuffer.length; i++) {
      if (currSignal) {
        data[i] = currSignal.next().value;
      } else {
        data[i] = 0;
      }
    }
  }
};

document.documentElement.onmouseup = () => {
  currSignal = null;
};

bindPad(document.getElementById('pulse'), pulseWave);

bindPad(document.getElementById('triangle'), triangleWave);

bindPad(document.getElementById('noise'), noise);
