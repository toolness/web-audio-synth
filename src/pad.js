/* global Fader */

(function() {
  function bindDebouncedResize(cb) {
    const DELAY = 250;

    let timeout;

    window.addEventListener('resize', () => {
      clearTimeout(timeout);

      timeout = setTimeout(cb, DELAY);
    }, false);
  }

  function bindKeyboard(button, notify, activate, deactivate) {
    const LEFT_ARROW = 37;
    const UP_ARROW = 38;
    const RIGHT_ARROW = 39;
    const DOWN_ARROW = 40;
    const KBD_INCREMENT = 0.01;
    const KBD_BIG_INCREMENT = 0.05;

    let isKbdDown = false;
    let kbdX = 0.5;
    let kbdY = 0.5;
    let notifyKbd = () => {
      notify(kbdX, kbdY);
    };

    button.onclick = e => {
      if (isKbdDown) {
        isKbdDown = false;
        deactivate();
      } else {
        isKbdDown = true;
        activate();
        notifyKbd();
      }
    };

    button.onfocus = e => {
      if (button.scrollIntoViewIfNeeded) {
        button.scrollIntoViewIfNeeded();
      } else {
        button.scrollIntoView();
      }
    };

    button.onblur = e => {
      if (isKbdDown) {
        isKbdDown = false;
        deactivate();
      }
    };

    button.onkeydown = e => {
      if (!isKbdDown) return;

      let increment = e.shiftKey ? KBD_BIG_INCREMENT : KBD_INCREMENT;

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
    const FADE_SECONDS = 0.01;

    if (typeof(el) === 'string') {
      let selector = el;
      el = document.querySelector(selector);
      if (!el) {
        throw new Error('unable to find ' + selector);
      }
    }

    let fader = new Fader(engine.sampleRate, FADE_SECONDS);
    let isMouseDown = false;
    let status = el.querySelector('p[role="status"]');
    let svg = el.querySelector('svg');
    let button = el.querySelector('button');

    cb = cb || function() {};

    function draw() {
      const V_MARGIN = 0.1;

      let me = el.getBoundingClientRect();
      let width = me.width;
      let height = me.height;
      let samples = source.samples();
      let path = svg.querySelector('path');
      let segments = [];

      svg.setAttribute('width', width);
      svg.setAttribute('height', height);

      for (let i = 0; i < width; i += 1) {
        let value = samples.next().value;

        value = height - (value * (height / (2 + V_MARGIN)) + (height / 2));
        segments.push((i == 0 ? "M " : "L ") + i + " " + value);
      }

      path.setAttribute('d', segments.join(' '));
    }

    function notify(x, y) {
      let desc = cb(x, y);

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
      let me = el.getBoundingClientRect();
      let myX = e.clientX - me.left;
      let myY = e.clientY - me.top;

      notify(myX / me.width, myY / me.height);
    }

    function notifyTouch(e) {
      if (!e.changedTouches) return;

      notifyMouse({
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY
      });
    }

    el.ontouchstart = e => {
      activate();
      notifyTouch(e);
    };

    el.ontouchmove = e => {
      notifyTouch(e);
    };

    el.ontouchend = el.ontouchcancel = e => {
      deactivate();
    };

    el.onmousedown = e => {
      isMouseDown = true;
      activate();
      notifyMouse(e);
    };

    el.onmousemove = e => {
      if (!isMouseDown) return;

      notifyMouse(e);
    };

    document.documentElement.addEventListener('mouseup', e => {
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
