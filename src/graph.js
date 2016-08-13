"use strict";

/* global d3, Constant, SineWave */

let translateStr = (x, y) => {
  return 'translate(' + x + ', ' + y + ')';
};

let margin = {
  top: 20,
  right: 50,
  bottom: 40,
  left: 50
};
let width = 640;
let height = 320;

let generateData = (seconds, sampleRate, startFreq, endFreq) => {
  let signal = new SineWave(sampleRate);
  let data = [];
  let freqDelta = endFreq - startFreq;
  let totalSamples = seconds * sampleRate;

  signal.freq = new Constant(startFreq);

  let samples = signal.samples();

  for (let i = 0; i < totalSamples; i++) {
    data.push({
      x: i / sampleRate,
      y: samples.next().value,
    });
    signal.freq.value = startFreq + freqDelta * (i / totalSamples);
  }

  return data;
};

let x = d3.scaleLinear()
  .range([0, width]);

let y = d3.scaleLinear()
  .range([height, 0]);

let line = d3.line()
  .x(d => x(d.x))
  .y(d => y(d.y));

let svg = d3.select('#graph')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .attr('transform', translateStr(margin.left, margin.top))
  .append('g');

let seconds = 2;
let sampleRate = Math.floor(width / seconds);
let startFreq = 1;
let endFreq = 10;

y.domain([-1, 1]);
x.domain([0, seconds]);

svg.append('g')
  .attr('transform', translateStr(0, height / 2))
  .call(d3.axisBottom(x));

svg.append('g')
  .call(d3.axisLeft(y));

svg.append('path')
  .datum(generateData(seconds, sampleRate, startFreq, endFreq))
  .attr('class', 'line')
  .attr('d', line);
