"use strict";

var ffmpeg = require('fluent-ffmpeg');
var path = require('path');

var DEFAULT_BITRATE = 256000;

var encode = function(filename, metadata, sub_file) {
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
        if (stream.codec_name === 'ac3') {
          ac3_streams.push(stream);
        }
      }
    }

    if (ac3_streams.length > 0 || sub_file) {
      let reencoder = ffmpeg(filename);
      if (sub_file) {
        reencoder.input(sub_file);
        //reencoder.inputOptions('-metadata:s:s:0 1 language=eng')
      }
      reencoder
        .videoCodec('copy')
        .audioCodec('libfdk_aac')
        .audioBitrate(bitrate / 1000)
      return reencoder;
    } else {
      return null;
    }
}

var encode_with_progress_bar = function(filename, metadata, sub_file, progress_bar) {
  return new Promise(function(resolve, reject) {
    let encode_command = encode(filename, metadata, sub_file);
    if (!encode_command) {
      resolve(null);
    } else {
      let ext = path.extname(filename);
      let basename = path.basename(filename, ext);
      let dir = path.dirname(filename);
      let output_file = path.resolve(`${dir}${path.sep}${basename}.aac${ext}`);
      let short_outfile = path.relative(process.cwd(), output_file);

      encode_command
        .on('error', function(error) {
          reject(error);
        })
        .on('start', function(command) {
          console.log(command);
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
        .save(output_file);
    }
  });
}

module.exports = {
  encode : encode,
  encode_with_progress_bar : encode_with_progress_bar
}
