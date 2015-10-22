"use strict";

var ffmpeg = require('fluent-ffmpeg');

var probe = function(filename) {
  return new Promise(function(resolve, reject) {
    ffmpeg.ffprobe(filename, function(err, metadata) {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
}

module.exports = probe;
