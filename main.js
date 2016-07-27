var audioCtx = new AudioContext();
var source = audioCtx.createBufferSource();
var scriptNode = audioCtx.createScriptProcessor(1024, 1, 1);
var signal = 1;
var samplesUntilSignalFlip = 0;
var samplesPerSignalFlip;
var currFreq = 220;

source.connect(scriptNode);
scriptNode.connect(audioCtx.destination);
source.start();
freq(currFreq);

setInterval(function() {
  currFreq += 1;
  freq(currFreq);
}, 5);

scriptNode.onaudioprocess = function(e) {
  var outputBuffer = e.outputBuffer;

  for (var chan = 0; chan < e.outputBuffer.numberOfChannels; chan++) {
    var data = e.outputBuffer.getChannelData(chan);

    for (var i = 0; i < e.outputBuffer.length; i++) {
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
