"use strict";

var opensubtitles = require('subtitler/lib/API');
var fs = require('fs');
var zlib = require('zlib');
var path = require('path');
var http = require('http');

function calculate_subtitle_filename(movie_filename, sub_ext) {
  let dir = path.dirname(movie_filename)
  let ext = path.extname(movie_filename);
  let name = path.basename(movie_filename, ext);

  return path.resolve(`${dir}${path.sep}${name}.${sub_ext}`);
}

function http_get(url, filename) {
  return new Promise(function(resolve, reject) {
    http.get(url, function(response) {
      let gunzip = zlib.createGunzip();
      let outstream = fs.createWriteStream(filename);
      response.pipe(zlib.createGunzip()).pipe(outstream)
      outstream.on('close', function() {
        resolve(filename);
      })
    }).on('error', function(error) {
      reject(error);
    });
  })
}

exports.download = function(filename) {
  return function*() {
    let token = yield opensubtitles.login();
    let results = yield opensubtitles.searchForFile(token, "eng", filename);

    if (results.length == 0) {
      return null;
    }

    let sub_result = results[0];
    let sub_url = sub_result.SubDownloadLink;
    let sub_ext = sub_result.SubFormat;
    let sub_filename = calculate_subtitle_filename(filename, sub_ext);
    return http_get(sub_url, sub_filename);
  }
}
