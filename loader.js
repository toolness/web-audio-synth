"use strict";

(function() {
  function doesBrowserSupportWebAudio() {
    if (!('AudioContext' in window)) {
      if ('webkitAudioContext' in window) {
        window.AudioContext = window.webkitAudioContext;
      }
    }

    return 'AudioContext' in window;
  }

  function isTranspilerNeeded() {
    var es2015 = (
      // This code will either parse and run if the browser supports all
      // the features of es2015 we need to run our non-transpiled code,
      // or it will raise a syntax error or return something other than
      // "es2015 works!".
      '(function() {' +
      '  function *boop() { yield 1; }' +
      '  const BOOP = 1;' +
      '  let tryMe = () => {};' +
      '  class Glorp {}' +
      '  return "es2015 works!";' +
      '})();'
    );

    var result;

    try {
      result = eval(es2015);
      if (result != "es2015 works!") {
        throw new Error("es2015 test returned " + result);
      }
      return false;
    } catch (e) {
      console.log("es2015 test failed.", e);
      return true;
    }
  }

  function load(files) {
    var html = '';

    if (!doesBrowserSupportWebAudio()) {
      document.documentElement.className += ' no-web-audio';
      return;
    }

    if (isTranspilerNeeded()) {
      files = [
        'vendor/babel-polyfill.js'
      ].concat(files.map(function(file) {
        return 'transpiled/' + file;
      }));
    } else {
      files = files.map(function(file) {
        return 'src/' + file;
      });
    }

    html = files.map(function(file) {
      return '<script src="' + file + '"></' + 'script>';
    }).join('\n');

    document.write(html);
  }

  window.Loader = {
    load: load
  };
})();
