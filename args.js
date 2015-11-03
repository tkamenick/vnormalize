"use strict";

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
      alias: 'subtitle-file',
      describe: 'external subtitle file to include'
    })
    .option('audio-bitrate', {
      describe: 'use if source bitrate cannot be determined',
      type: 'string',
      default: '256k'
    })
    .argv;
}

module.exports = argv