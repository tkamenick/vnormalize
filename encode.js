"use strict";

var path = require('path');
var ffmpeg = require('fluent-ffmpeg');
var ProgressBar = require('progress');
var colors = require('colors/safe');

var DEFAULT_BITRATE = 256000;

var encode = function(filename, metadata, sub_file) {
  return new Promise(function(resolve, reject) {
    let container = metadata.format.format_long_name;

    let ac3_streams = [];
    let bitrate = null;
    for(let stream of metadata.streams) {
      if (stream.codec_type == 'audio') {
        let probed_bitrate = stream.bit_rate;
        if (probed_bitrate == 'N/A') {
          bitrate = DEFAULT_BITRATE;
        } else {
          bitrate = probed_bitrate;
        }
        if (stream.codec_name == 'ac3') {
          ac3_streams.push(stream);
        }
      }
    }

    if (ac3_streams.length > 0) {
      let ext = path.extname(filename);
      let basename = path.basename(filename, ext);
      let dir = path.dirname(filename);
      let output_file = path.resolve(`${dir}${path.sep}${basename}.aac${ext}`);
      let short_outfile = path.relative(process.cwd(), output_file);

      let progress_bar = new ProgressBar(':filename :bar :percent :etas', {
        total: 10000,
        width: 40,
        incomplete: colors.bgWhite(' '),
        complete: colors.bgGreen(' ')
      });

      let reencode = ffmpeg(filename);
      if (sub_file) {
        reencode.input(sub_file);
      }
      reencode
        .videoCodec('copy')
        .audioCodec('libfdk_aac')
        .audioBitrate(bitrate / 1000)
        .on('error', function(error) {
          reject(error);
        })
        .on('start', function(command) {
          progress_bar.update(0, {filename: short_outfile});
        })
        .on('end', function() {
          resolve(output_file);
          progress_bar.update(1, {filename: short_outfile});
        })
        .on('progress', function(prog) {
          let percent = prog['percent'];
          progress_bar.update(percent / 100, {filename: short_outfile})
        })
        .save(output_file)
    } else {
      resolve(null)
    }
  });
}

module.exports = encode;
