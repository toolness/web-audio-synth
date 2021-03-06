"use strict";

/* global d3 */

function drawGraph(selector, createSampleIterator, options) {
  options = Object.assign({}, drawGraph.defaults, options);

  let margin = options.margin;
  let width = options.width;
  let height = options.height;
  let seconds = options.seconds;
  let yDomain = options.yDomain;
  let sampleRate = Math.floor(width / seconds);

  let translateStr = (x, y) => {
    return 'translate(' + x + ', ' + y + ')';
  };

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
    .attr('class', 'draw-graph-line')
    .attr('d', line);
}

drawGraph.defaults = {
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
