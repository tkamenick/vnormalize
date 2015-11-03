"use strict";

var ProgressBar = require('progress');

var progress = function(format, options) {
  return new ProgressBar(format, options);
}

module.exports = progress;
