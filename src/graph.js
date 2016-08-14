"use strict";

/* global d3, Constant, SineWave, Adsr */

const defaults = {
  width: 640,
  height: 320,
  margin: {
    top: 20,
    right: 50,
    bottom: 40,
    left: 50
  },
  yDomain: [-1, 1],
  seconds: 2
};

function translateStr(x, y) {
  return 'translate(' + x + ', ' + y + ')';
}

function drawGraph(selector, createSampleIterator, options) {
  options = Object.assign({}, defaults, options);

  let margin = options.margin;
  let width = options.width;
  let height = options.height;
  let seconds = options.seconds;
  let yDomain = options.yDomain;
  let sampleRate = Math.floor(width / seconds);

  let x = d3.scaleLinear()
    .range([0, width]);

  let y = d3.scaleLinear()
    .range([height, 0]);

  let line = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y));

  let svg = d3.select(selector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', translateStr(margin.left, margin.top));

  y.domain(yDomain);
  x.domain([0, seconds]);

  svg.append('g')
    .attr('transform', translateStr(0, height / 2))
    .call(d3.axisBottom(x));

  svg.append('g')
    .call(d3.axisLeft(y));

  let totalSamples = seconds * sampleRate;
  let samples = createSampleIterator(sampleRate, seconds, totalSamples);
  let data = [];

  for (let i = 0; i < totalSamples; i++) {
    let nextSample = samples.next();
    if (nextSample.done) break;
    data.push({
      x: i / sampleRate,
      y: nextSample.value
    });
  }

  svg.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('d', line);
}

drawGraph('#sine-fm', function *(sampleRate, seconds, totalSamples) {
  let signal = new SineWave(sampleRate);
  let samples = signal.samples()
  let startFreq = 1;
  let endFreq = 10;
  let freqDelta = endFreq - startFreq;

  document.querySelector('#sine-fm-start').textContent = startFreq;
  document.querySelector('#sine-fm-end').textContent = endFreq;

  for (let i = 0; i < totalSamples; i++) {
    signal.freq.value = startFreq + freqDelta * (i / totalSamples);
    yield samples.next().value;
  }
});

drawGraph('#sine-add', function *(sampleRate) {
  let sine1 = new SineWave(sampleRate);
  let sine2 = new SineWave(sampleRate);

  let sine1Part = 0.75;
  let sine2Part = 1 - sine1Part;
  let samples2 = sine2.samples();

  sine1.freq.value = 1;
  sine2.freq.value = 50;

  for (let sample1 of sine1.samples()) {
    yield sample1 * sine1Part + samples2.next().value * sine2Part;
  }
});

drawGraph('#sine-adsr', function *(sampleRate, seconds, totalSamples) {
  let sine = new SineWave(sampleRate);
  let attack = seconds / 4;
  let decay = seconds / 8;
  let release = seconds / 6;
  let sustain = 0.75;
  let adsr = new Adsr(sampleRate, sine, attack, decay, sustain, release);
  let samples = adsr.samples();

  sine.freq.value = 25;

  for (let i = 0; i < totalSamples - (sampleRate * release); i++) {
    yield samples.next().value;
  }

  adsr.startRelease();

  yield *samples;
});
