let audioCtx = new AudioContext();
let source = audioCtx.createBufferSource();
let scriptNode = audioCtx.createScriptProcessor(1024, 1, 1);
let signal = 1;
let samplesUntilSignalFlip = 0;
let samplesPerSignalFlip;
let currFreq = 220;

source.connect(scriptNode);
scriptNode.connect(audioCtx.destination);
source.start();
freq(currFreq);

setInterval(() => {
  currFreq += 1;
  freq(currFreq);
}, 5);

scriptNode.onaudioprocess = e => {
  let outputBuffer = e.outputBuffer;

  for (let chan = 0; chan < e.outputBuffer.numberOfChannels; chan++) {
    let data = e.outputBuffer.getChannelData(chan);

    for (let i = 0; i < e.outputBuffer.length; i++) {
      if (samplesUntilSignalFlip == 0) {
        signal = -signal;
        samplesUntilSignalFlip = samplesPerSignalFlip;
      } else {
        samplesUntilSignalFlip--;
      }
      data[i] = signal;
    }
  }
};

function stop() {
  scriptNode.disconnect(audioCtx.destination);
}

function freq(hz) {
  samplesPerSignalFlip = Math.floor((audioCtx.sampleRate / hz) / 2);
}
