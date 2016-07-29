"use strict";

let audioCtx = new AudioContext();
let source = audioCtx.createBufferSource();
let scriptNode = audioCtx.createScriptProcessor(1024, 1, 1);
let triangleWave = new TriangleWave(audioCtx.sampleRate);
let pulseWave = new PulseWave(audioCtx.sampleRate);
let noise = new Noise();
let currSignal = null;

function bindPad(el, source, cb) {
  let info = el.querySelector('.info');

  cb = cb || function() {};

  function notify(e) {
    let me = el.getBoundingClientRect();
    let myX = e.clientX - me.left;
    let myY = e.clientY - me.top;
    let desc = cb(myX / me.width, myY / me.height);

    if (info && desc) {
      info.textContent = desc;
    }
  }

  el.onmousedown = e => {
    currSignal = source.signal();
    notify(e);
    el.classList.add('active');
  };

  el.onmousemove = notify;

  el.onmouseup = e => {
    el.classList.remove('active');
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

bindPad(document.getElementById('pulse'), pulseWave, (x, y) => {
  pulseWave.freq = Math.floor(20 + (x * 800));
  pulseWave.dutyCycle = y;

  let dc = Math.floor(pulseWave.dutyCycle * 100);

  return pulseWave.freq + " hz, " + dc + "% duty cycle";
});

bindPad(document.getElementById('triangle'), triangleWave, (x, y) => {
  triangleWave.freq = Math.floor(20 + (x * 800));

  return triangleWave.freq + " hz";
});

bindPad(document.getElementById('noise'), noise);
