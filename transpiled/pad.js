'use strict';

/* global Fader */

(function () {
  function bindDebouncedResize(cb) {
    var DELAY = 250;

    var timeout = void 0;

    window.addEventListener('resize', function () {
      clearTimeout(timeout);

      timeout = setTimeout(cb, DELAY);
    }, false);
  }

  function bindKeyboard(button, notify, activate, deactivate) {
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
  }

  function bindPad(engine, el, source, cb) {
    var FADE_SECONDS = 0.01;

    if (typeof el === 'string') {
      var selector = el;
      el = document.querySelector(selector);
      if (!el) {
        throw new Error('unable to find ' + selector);
      }
    }

    var fader = new Fader(engine.sampleRate, FADE_SECONDS);
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
      var samples = source.samples();
      var path = svg.querySelector('path');
      var segments = [];

      svg.setAttribute('width', width);
      svg.setAttribute('height', height);

      for (var i = 0; i < width; i += 1) {
        var value = samples.next().value;

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
      engine.activate(fader);
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

    function notifyTouch(e) {
      if (!e.changedTouches) return;

      notifyMouse({
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY
      });
    }

    el.ontouchstart = function (e) {
      activate();
      notifyTouch(e);
    };

    el.ontouchmove = function (e) {
      notifyTouch(e);
    };

    el.ontouchend = el.ontouchcancel = function (e) {
      deactivate();
    };

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
      bindKeyboard(button, notify, activate, deactivate);
    }

    bindDebouncedResize(draw);

    window.addEventListener('load', draw, false);
  }

  window.Pad = {
    bind: bindPad
  };
})();