"use strict";
/**
 * Encode
 *
 * @module encoder
 * @requires path
 */
var ffmpeg = require('fluent-ffmpeg');
var path = require('path');

/**
 * The default audio bitrate, if the audio track bitrate cannot be determined.
 * This can happen when the audio is encoded with a variable bitrate.
 * @constant
 * @default
 */
var DEFAULT_BITRATE = 256000;

/**
 * Encodes a video if there are non aac streams or if there is a subtitle file
 * to be added to the container
 *
 * @param {string} filename video filename
 * @param {Object} metadata metadata of the video as returned by <tt>ffprobe</tt>
 * @param {string} sub_file subtitle filename
 */
var encode = function(filename, metadata, sub_file) {
  let non_aac_audio = [];
  let bitrate = null;
  for (let stream of metadata.streams) {
    if (stream.codec_type == 'audio') {
      let probed_bitrate = stream.bit_rate;
      if (probed_bitrate == 'N/A') {
        bitrate = DEFAULT_BITRATE;
      } else {
        bitrate = probed_bitrate;
      }
      if (stream.codec_name !== 'aac') {
        non_aac_audio.push(stream);
      }
    }
  }

  if (non_aac_audio.length > 0 || sub_file) {
    let reencoder = ffmpeg(filename);
    if (sub_file) {
      reencoder.input(sub_file);
      reencoder.outputOptions('-metadata:s:s:0 language=eng')
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
      let output_file = path.resolve(`${dir}${path.sep}${basename}.aac.mkv`);
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
