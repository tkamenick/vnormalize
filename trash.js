"use strict";

var path = require('path')

var TRASH_FOLDER = path.join(process.env.HOME, '.Trash');
var fs = require('fs');
var cwd = process.cwd();

var wrapper = function(file_or_files) {
  if (!Array.isArray(file_or_files)) {
    file_or_files = [file_or_files];
  }
  let promises = []
  for (let file of file_or_files) {
    if (file) {
      promises.push(trash(file));
    }
  }
  return promises;
};

var trash = function(file) {
  return new Promise(function(resolve, reject) {
    let trash_file = path.join(TRASH_FOLDER, path.basename(file))
    fs.rename(file, trash_file, function(error) {
      if (error) {
        reject(error);
      } else {
        resolve({
          from: path.relative(cwd, file),
          to: path.relative(cwd, trash_file)
        });
      }
    })
  });
}

module.exports = wrapper;
