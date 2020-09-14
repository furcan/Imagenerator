/*!
* Constants
* Description: Constants for the development.
* Version: 1.0.0
* Author: Furkan MT ('https://github.com/furcan')
* Copyright 2020 Constants, MIT Licence ('https://opensource.org/licenses/MIT')
*/

// Dev Dependencies
const chalk = require('chalk');
const package = require('../package.json');

// Constants: begin
// - Babel Minify Options: begin
const minifyOptions = {
  builtIns: false, // transform-minify-booleans
};

const minifyOverrides = {
  comments: false, // remove all comments
};
// - Babel Minify Options: end

// - Terminal Error Message: begin
const terminalError = (message, fileOrPath) => {
  const colorRed = '#ff5549';
  const colorBlue = '#26c0d3';
  if (typeof fileOrPath !== 'string') { fileOrPath = '???'; }
  let info = chalk.hex(colorBlue)('\nPlease look at the "' + fileOrPath + '" for more information.\n\n');
  if (typeof message !== 'string') {
    message = 'An error has occurred on: "' + chalk.hex(colorBlue)(fileOrPath) + '"';
    info = '';
  }
  return console.error(chalk.hex(colorRed).bold('Development Error: ') + chalk.hex(colorRed)(message) + info);
};
// - Terminal Error Message: end

// - Exports: begin
module.exports = {
  prefix: 'imagenerator',
  dirInput: 'src',
  dirOutput: 'dist',
  fileScript: 'imagenerator.js',
  version: (JSON.stringify((package || {}).version) || '').replace(/"/gm, ''),
  author: (JSON.stringify((package || {}).author) || '').replace(/"/gm, ''),
  title: 'Imagenerator',
  url: '(https://github.com/furcan/Imagenerator)',
  license: 'MIT Licence (https://opensource.org/licenses/MIT)',
  year: new Date().getFullYear() || '2020',
  minifyOptions,
  minifyOverrides,
  terminalError,
};
// - Exports: end
// Constants: end
