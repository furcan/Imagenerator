/*!
* Minifier
*
* Description: Minify the Imagenetor script to the distribution. (Used "Babel Minify")
* Version: 1.0.0
* Author: Furkan MT ('https://github.com/furcan')
* Copyright 2020 Minifier, MIT Licence ('https://opensource.org/licenses/MIT')
*/

// Dev Dependencies
const { existsSync, readdirSync, unlinkSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const Minify = require('babel-minify');
const Constants = require('./dev-constants');

// Constants
const thisFilePath = 'helpers/dev-minifier.js';

// Minified Code and Source Type: begin
const minifiedCodeBySourceType = (text, type) => {
  // if script
  if (type === 'script') {
    const script = Minify(text, Constants.minifyOptions, Constants.minifyOverrides);
    if (typeof script === 'object' && typeof script.code === 'string' && typeof script.sourceType === 'string') {
      return {
        code: script.code,
        type: script.sourceType,
      };
    } else {
      return false;
    }
  }
  // else
  return false;
};
// Minified Code and Source Type: end

// Clear The Output Directory: begin
const clearTheOutDir = (path) => {
  if (!path) { path = Constants.dirOutput; }
  if (existsSync(path)) { // if the directory exist clear all files
    readdirSync(path).map(file => {
      // check the version
      if (file.indexOf(Constants.version) > -1) {
        Constants.terminalError(`The version number is the same. It should be increased. Go to the "package.json" file to change it.`, `${thisFilePath} => Line: 45`);
        return false;
      }
      // remove the old files
      unlinkSync(join(path, file), err => {
        if (err) throw err;
      });
    });
  } else {
    Constants.terminalError(`The "${path}" directory does not exist in the root directory.`, `${thisFilePath} => Line: 54`);
    return false;
  }
};
// Clear The Output Directory: end

// Write The File Into The Output Directory: begin
const writeFileToTheOutputDir = (minContent, fileName, filePath) => {
  if (existsSync(Constants.dirOutput)) {
    // create "imagenerator.min.*" file by minified content
    if (typeof minContent === 'object' && (typeof minContent.type === 'string' && (typeof minContent.code === 'string' && minContent.code.length > 0))) {
      // file extention
      let ext = null;
      if (minContent.type === 'script') {
        ext = 'js';
      }

      // if ext exist create a file
      if (typeof ext === 'string') {
        // comment line
        const comment = `/* ${Constants.title} ${Constants.url} - Version: ${Constants.version} - Author: ${Constants.author} - Copyright ${Constants.year} ${Constants.title}, ${Constants.license} */\n\n`;
        // minified code with comment line
        const code = comment + minContent.code;
        // minified file name
        const minFileName = `${fileName}-${Constants.version}.min.${ext}`;
        // create a minified file into the output directory
        writeFileSync(join(Constants.dirOutput, minFileName), code);
      }
    } else {
      Constants.terminalError(`The "${filePath}" file is empty and/or something went wrong.`, `${thisFilePath} => Line: 84`);
      return false;
    }
  } else {
    Constants.terminalError(`The "${Constants.dirOutput}" directory does not exist in the root directory.`, `${thisFilePath} => Line: 88`);
    return false;
  }
};
// Write The File Into The Output Directory: end

// Create The File from by The Input Directory: begin
const createFileFromTheInputDir = (filePath, fileName, filePrefix, fileType) => {
  if (existsSync(filePath)) { // if file exist
    // file text
    const fileText = readFileSync(filePath, 'utf-8');
    // if file text exist
    if (typeof fileText === 'string' && fileText.length > 0) {
      // minified content by file
      const minifiedContent = minifiedCodeBySourceType(fileText, fileType);
      // create a file by minified content
      writeFileToTheOutputDir(minifiedContent, filePrefix, fileName);
    }
    // else throw error
    else {
      Constants.terminalError(`The "${filePath}" file is empty and/or something went wrong.`, `${thisFilePath} => Line: 108`);
      return false;
    }
  } else {
    Constants.terminalError(`The "${fileName}" file does not exist in the "${Constants.dirInput}" directory.`, `${thisFilePath} => Line: 112`);
    return false;
  }
};
// Create The File from by The Input Directory: end

// Minify: begin
if (existsSync(Constants.dirInput)) { // if the input directory exist
  // Clear the output directory
  clearTheOutDir(Constants.dirOutput);

  // Script
  const scriptPath = join(Constants.dirInput, Constants.fileScript);
  createFileFromTheInputDir(scriptPath, Constants.fileScript, Constants.prefix, 'script');
} else {
  Constants.terminalError(`The "${Constants.dirInput}" directory does not exist in the root directory.`, `${thisFilePath} => Line: 127`);
  return false;
}
// Minify: end
