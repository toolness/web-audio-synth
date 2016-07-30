"use strict";

var FADE_SECONDS = 0.01;

var audioCtx = new AudioContext();
var source = audioCtx.createBufferSource();
var scriptNode = audioCtx.createScriptProcessor(1024, 1, 1);
var fader = new Fader(audioCtx.sampleRate, FADE_SECONDS);
var faderSignal = fader.signal();
var triangleWave = new TriangleWave(audioCtx.sampleRate);
var pulseWave = new PulseWave(audioCtx.sampleRate);
var quietPulseWave = new Amplifier(pulseWave, 0.5);
var sineWave = new SineWave(audioCtx.sampleRate);
var noise = new Noise();
var quietNoise = new Amplifier(noise, 0.5);

function bindDebouncedResize(cb) {
  var DELAY = 250;

  var timeout = void 0;

  window.addEventListener('resize', function () {
    clearTimeout(timeout);

    timeout = setTimeout(cb, DELAY);
  }, false);
}

function bindPad(el, source, cb) {
  var isMouseDown = false;
  var status = el.querySelector('p[role="status"]');
  var svg = el.querySelector('svg');
  var button = el.querySelector('button');

  cb = cb || function () {};

  function draw() {
    var V_MARGIN = 0.1;

    var me = el.getBoundingClientRect();
    var width = me.width;
    var height = me.height;
    var signal = source.signal();
    var path = svg.querySelector('path');
    var segments = [];

    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    for (var i = 0; i < width; i += 1) {
      var value = signal.next().value;

      value = height - (value * (height / (2 + V_MARGIN)) + height / 2);
      segments.push((i == 0 ? "M " : "L ") + i + " " + value);
    }

    path.setAttribute('d', segments.join(' '));
  }

  function notify(x, y) {
    var desc = cb(x, y);

    if (status && desc) {
      status.textContent = desc;
    }

    draw();
  }

  function activate() {
    fader.source = source;
    fader.fadeIn();
    el.classList.add('active');
  }

  function deactivate() {
    fader.fadeOut();
    el.classList.remove('active');
  }

  function notifyMouse(e) {
    var me = el.getBoundingClientRect();
    var myX = e.clientX - me.left;
    var myY = e.clientY - me.top;

    notify(myX / me.width, myY / me.height);
  }

  el.onmousedown = function (e) {
    isMouseDown = true;
    activate();
    notifyMouse(e);
  };

  el.onmousemove = function (e) {
    if (!isMouseDown) return;

    notifyMouse(e);
  };

  document.documentElement.addEventListener('mouseup', function (e) {
    if (!isMouseDown) return;

    isMouseDown = false;
    deactivate();
  }, false);

  if (button) {
    (function () {
      var LEFT_ARROW = 37;
      var UP_ARROW = 38;
      var RIGHT_ARROW = 39;
      var DOWN_ARROW = 40;
      var KBD_INCREMENT = 0.01;
      var KBD_BIG_INCREMENT = 0.05;

      var isKbdDown = false;
      var kbdX = 0.5;
      var kbdY = 0.5;
      var notifyKbd = function notifyKbd() {
        notify(kbdX, kbdY);
      };

      button.onclick = function (e) {
        if (isKbdDown) {
          isKbdDown = false;
          deactivate();
        } else {
          isKbdDown = true;
          activate();
          notifyKbd();
        }
      };

      button.onfocus = function (e) {
        if (button.scrollIntoViewIfNeeded) {
          button.scrollIntoViewIfNeeded();
        } else {
          button.scrollIntoView();
        }
      };

      button.onblur = function (e) {
        if (isKbdDown) {
          isKbdDown = false;
          deactivate();
        }
      };

      button.onkeydown = function (e) {
        if (!isKbdDown) return;

        var increment = e.shiftKey ? KBD_BIG_INCREMENT : KBD_INCREMENT;

        if (e.keyCode === LEFT_ARROW) {
          kbdX -= increment;
          if (kbdX < 0) kbdX = 0;
        } else if (e.keyCode === UP_ARROW) {
          kbdY -= increment;
          if (kbdY < 0) kbdY = 0;
        } else if (e.keyCode === RIGHT_ARROW) {
          kbdX += increment;
          if (kbdX > 1.0) kbdX = 1.0;
        } else if (e.keyCode === DOWN_ARROW) {
          kbdY += increment;
          if (kbdY > 1.0) kbdY = 1.0;
        } else {
          return;
        }

        notifyKbd();
        e.preventDefault();
      };
    })();
  }

  bindDebouncedResize(draw);

  window.addEventListener('load', draw, false);
}

source.connect(scriptNode);
scriptNode.connect(audioCtx.destination);
source.start();

scriptNode.onaudioprocess = function (e) {
  var outputBuffer = e.outputBuffer;

  for (var chan = 0; chan < e.outputBuffer.numberOfChannels; chan++) {
    var data = e.outputBuffer.getChannelData(chan);

    for (var i = 0; i < e.outputBuffer.length; i++) {
      data[i] = faderSignal.next().value;
    }
  }
};

bindPad(document.getElementById('pulse'), quietPulseWave, function (x, y) {
  pulseWave.freq = Math.floor(20 + x * 800);
  pulseWave.dutyCycle = y;

  var dc = Math.floor(pulseWave.dutyCycle * 100);

  return pulseWave.freq + " hz, " + dc + "% duty cycle";
});

bindPad(document.getElementById('triangle'), triangleWave, function (x, y) {
  triangleWave.freq = Math.floor(20 + x * 800);

  return triangleWave.freq + " hz";
});

bindPad(document.getElementById('sine'), sineWave, function (x, y) {
  sineWave.freq = Math.floor(20 + x * 800);

  return sineWave.freq + " hz";
});

bindPad(document.getElementById('noise'), quietNoise);