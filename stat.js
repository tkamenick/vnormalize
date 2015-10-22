"use strict";

var fs = require('fs');

var stat = function(filename) {
  return new Promise(function(resolve, reject) {
    fs.stat(filename, function(err, stats) {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    })
  })
}

module.exports = stat;
