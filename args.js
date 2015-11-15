"use strict";
/**
 * @return {Object} the command line arguments
 */
var argv = function() {
  return require('yargs')
    .usage('normalizes a video to h264/aac in an mkv container with subtitles.\n'
           +'Usage: $0 -f video.mp4')
    .option('f', {
      alias: 'file',
      demand: true,
      describe: 'video file to normalize',
      type: 'string'
    })
    .option('s', {
      alias: 'subtitles',
      describe: 'include subtitles',
      default: true,
      type: 'boolean'
    })
    .option('l', {
      alias: 'language',
      describe: 'subtitle language to download',
      default: 'eng',
      type: 'string'
    })
    .option('sf', {
      alias: 'subtitle_file',
      describe: 'external subtitle file to include',
      type: 'string'
    })
    .option('audio_bitrate', {
      describe: 'use if source bitrate cannot be determined',
      type: 'string',
      default: '256k'
    })
    .option('non_interactive', {
      describe: 'no console output, only log output',
      type: 'boolean',
      default: false
    })
    .argv;
}

module.exports = argv
