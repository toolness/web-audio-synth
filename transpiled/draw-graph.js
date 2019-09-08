"use strict";

/* global d3 */

function drawGraph(selector, createSampleIterator, options) {
  options = Object.assign({}, drawGraph.defaults, options);

  var margin = options.margin;
  var width = options.width;
  var height = options.height;
  var seconds = options.seconds;
  var yDomain = options.yDomain;
  var sampleRate = Math.floor(width / seconds);

  var translateStr = function translateStr(x, y) {
    return 'translate(' + x + ', ' + y + ')';
  };

  var x = d3.scaleLinear().range([0, width]);

  var y = d3.scaleLinear().range([height, 0]);

  var line = d3.line().x(function (d) {
    return x(d.x);
  }).y(function (d) {
    return y(d.y);
  });

  var svg = d3.select(selector).append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', translateStr(margin.left, margin.top));

  y.domain(yDomain);
  x.domain([0, seconds]);

  svg.append('g').attr('transform', translateStr(0, height / 2)).call(d3.axisBottom(x));

  svg.append('g').call(d3.axisLeft(y));

  var totalSamples = seconds * sampleRate;
  var samples = createSampleIterator(sampleRate, seconds, totalSamples);
  var data = [];

  for (var i = 0; i < totalSamples; i++) {
    var nextSample = samples.next();
    if (nextSample.done) break;
    data.push({
      x: i / sampleRate,
      y: nextSample.value
    });
  }

  svg.append('path').datum(data).attr('class', 'draw-graph-line').attr('d', line);
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