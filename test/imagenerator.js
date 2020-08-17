/*!
* Imagenerator ("https://github.com/furcan/imagenerator")
* Version: 0.0.1-beta.01
* Author: Furkan MT ("https://github.com/furcan")
* Copyright 2020 imagenerator, MIT Licence ("https://opensource.org/licenses/MIT")
*/

/* global define */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory(root);
    });
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(root);
  } else {
    root.Imagenerator = factory(root);
  }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

  'use strict';

  // SSR check: begin
  if (typeof window === 'undefined' && typeof window.document === 'undefined') {
    return;
  }
  // SSR check: begin

  // Options: begin
  var imageneratorOptions = {
    direction: 'ltr', // "ltr" || "rtl"
    quailty: 1, // 0.5 - 1
    fontCheck: true,
    background: {
      url: null,
      crossorigin: 'anonymous',
      width: 1920,
      height: 1920,
      overlay: {
        use: true,
        color: 'rgba(0,0,0,0.7)',
      },
    },
    title: {
      use: true,
      positionTop: 280,
      text: 'Imagenerator',
      maxLength: 100,
      fontSize: 70,
      fontWeight: 600,
      textAlign: 'center',
      fontFamily: 'sans-serif',
      color: '#fff',
    },
    icon: {
      use: false,
      url: null,
      positionTop: 650,
      width: 240,
      height: 240,
      align: 'center',
      opacity: 1,
    },
    description: {
      use: true,
      positionTop: 1100,
      text: 'The peoples who want to live comfortably without producing and fatigue; they are doomed to lose their dignity, then liberty, and then independence and destiny.',
      maxLength: 240,
      fontSize: 50,
      fontWeight: 400,
      textAlign: 'center',
      fontFamily: 'sans-serif',
      color: '#b5b5b5',
    },
    author: 'Mustafa Kemal ATATURK',
    domain: 'example.com',
  };
  // Options: end

  // Extend Options: begin
  var imageneratorExtendOptions = function extendObj() {
    // variables
    var extended = {};
    var deep = false;
    var i = 0;
    // check if a deep merge
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
      deep = arguments[0];
      i++;
    }
    // merge the object into the extended object
    var merge = function (obj) {
      for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          // if property is an object, merge properties
          if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
            extended[prop] = imageneratorExtendOptions(extended[prop], obj[prop]);
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };
    // loop through each object and conduct a merge
    for (; i < arguments.length; i++) {
      merge(arguments[i]);
    }
    return extended;
  };
  // Extend Options: end

  var multilineTextToCanvasContext = function mlTxtToCnvsCtx(ctx, text, lineHeight, maxLength, x, y, maxWidth) {
    // check ctx, text and text length
    if (typeof ctx !== 'object' && typeof text !== 'string') {
      return false;
    }
    // message max length
    maxLength = typeof maxLength === 'number' && maxLength > 0 ? maxLength : 100;
    // text substring
    text = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

    // variables
    var words1 = text.split(' ');
    var words2 = [];
    var lines = [];
    var sliceFrom = 0;

    // check for long words
    var longWords = [];
    var longWord = '';
    for (var i = 0; i < words1.length; i++) {
      var word = words1[i];
      var wordWidth = parseInt(ctx.measureText(word).width);

      if (wordWidth > maxWidth) {
        words1.splice(i, 1);
        var chars = word.split('');
        for (var ci = 0; ci < chars.length; ci++) {
          longWord = longWord + chars[ci];
          var longWordWidth = parseInt(ctx.measureText(longWord).width);
          if (longWordWidth > maxWidth) {
            longWords.push(longWord);
            longWord = longWord.replace(longWord, '');
          }
        }
        longWords.push(longWord);
        longWord = longWord.replace(longWord, '');
      }
      words2 = longWords.concat(words1);
    }

    // create lines from words
    for (var i = 0; i < words2.length; i++) {
      var chunk = words2.slice(sliceFrom, i).join(' ');
      var last = i === words2.length - 1;
      var bigger = parseInt(ctx.measureText(chunk).width) > maxWidth;
      if (bigger) {
        lines.push(words2.slice(sliceFrom, i).join(' '));
        sliceFrom = i;
      }
      if (last) {
        lines.push(words2.slice(sliceFrom, words2.length).join(' '));
        sliceFrom = i;
      }
    }

    // write lines to the canvas
    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, y);
      y += lineHeight;
    }
  };

  var imageneratorCheckString = function checkString(string) {
    return typeof string === 'string' && string.length > 0;
  };

  var imageneratorCheckNumber = function checkString(number) {
    return typeof number === 'number' && number > 0;
  };

  var imageneratorCheckBool = function checkBool(bool) {
    return bool === true;
  };

  var imageneratorInit = function init(userOptions, callback) {
    // check and merge user options
    userOptions = typeof userOptions === 'object' && !Array.isArray(userOptions) ? userOptions : {};
    var newOptions = imageneratorExtendOptions(true, imageneratorOptions, userOptions);

    // get background image url
    var backgroundUrl = ((newOptions || {}).background || {}).url;
    backgroundUrl = imageneratorCheckString(backgroundUrl) ? backgroundUrl : imageneratorOptions.background.url;

    // if: check "backgroundUrl" && check "callback" function
    if (backgroundUrl && typeof callback === 'function') {

      // get and check "crossorigin"
      var backgroundCrossorigin = ((newOptions || {}).background || {}).crossorigin;
      backgroundCrossorigin = imageneratorCheckString(backgroundCrossorigin) ? backgroundCrossorigin : imageneratorOptions.background.crossorigin;

      // get and check "width"
      var backgroundWidth = ((newOptions || {}).background || {}).width;
      backgroundWidth = imageneratorCheckNumber(backgroundWidth) ? backgroundWidth : imageneratorOptions.background.width;

      // get and check "height"
      var backgroundHeight = ((newOptions || {}).background || {}).height;
      backgroundHeight = imageneratorCheckNumber(backgroundHeight) ? backgroundHeight : imageneratorOptions.background.height;

      // get and check "fontCheck"
      var fontCheck = (newOptions || {}).fontCheck === true;

      // create new image
      var image = new Image();
      image.setAttribute('src', backgroundUrl);
      image.setAttribute('crossorigin', backgroundCrossorigin);
      image.setAttribute('width', backgroundWidth);
      image.setAttribute('height', backgroundHeight);

      // image on load listener
      image.onload = function imageOnLoad() {
        // if: use icon
        var useIcon = ((newOptions || {}).icon || {}).use === true;
        var iconUrl = ((newOptions || {}).icon || {}).url;
        iconUrl = imageneratorCheckString(iconUrl) ? iconUrl : imageneratorOptions.icon.url;
        if (useIcon && iconUrl) {
          // icon, width
          var iconWidth = ((newOptions || {}).icon || {}).width;
          iconWidth = imageneratorCheckNumber(iconWidth) ? iconWidth : imageneratorOptions.icon.width;

          // icon, height
          var iconHeight = ((newOptions || {}).icon || {}).height;
          iconHeight = imageneratorCheckNumber(iconHeight) ? iconHeight : imageneratorOptions.icon.height;

          // icon, element
          var icon = new Image();
          icon.setAttribute('src', iconUrl);
          icon.setAttribute('crossorigin', 'anonymous');
          icon.setAttribute('width', iconWidth);
          icon.setAttribute('height', iconHeight);

          // icon, object
          var iconObj = {
            element: icon,
            width: iconWidth,
            height: iconHeight,
          };

          icon.onload = function iconOnLoad() {
            imageneratorCreateCanvas(backgroundWidth, backgroundHeight, image, iconObj, fontCheck, newOptions, callback);
          };

        }
        // else: only background image
        else {
          imageneratorCreateCanvas(backgroundWidth, backgroundHeight, image, false, fontCheck, newOptions, callback);
        }
      };

      // response before image on load
      var response = {
        base64: null,
        loading: true,
      };

      // return response with callback function
      return callback(response);
    }
    // else: "backgroundUrl" || "callback" function not defined
    else {
      var message = !backgroundUrl ? 'TODO: background url?' : 'TODO: callback func?';
      console.log(message)
      return false;
    }
  };

  var imageneratorCreateCanvas = function createCanvas(width, height, image, iconObj, fontCheck, options, callback) {
    // check the image: begin
    var checkTheImage = ((image || {}).tagName || '').toLocaleLowerCase('en') === 'img';
    if (!checkTheImage) {
      console.log('TODO: image?');
      return false;
    }
    // check the image: end

    // canvas: begin
    var canvas = window.document.createElement('canvas');
    if (!canvas) {
      console.log('TODO: canvas?');
      return false;
    }
    canvas.width = width;
    canvas.height = height;
    var canvasPosXCenter = width / 2;
    var canvasPosYCenter = height / 2;
    var canvasContentMaxWidth = parseInt(width - (width / 3));
    var canvasContentPosLeft = parseInt((width - canvasContentMaxWidth) / 3.5);
    var canvasContentPosRight = parseInt(width - canvasContentPosLeft);
    // canvas: end

    // context: begin
    var context = canvas.getContext('2d');

    // context, ready for font
    context.font = 'normal 35px sans-serif';
    context.fillStyle = '#fff';
    context.textAlign = 'center';
    context.fillText(' ', 0, 0);

    // context, "ltr" or "rtl"
    var directionList = ['ltr', 'rtl'];
    var direction = (options || {}).direction;
    direction = directionList.indexOf(direction) > -1 ? direction : imageneratorOptions.direction;
    context.direction = direction;

    // contex, save
    context.save();
    // context: end

    // draw image: begin
    context.drawImage(image, 0, 0, width, height);
    // draw image: end

    // draw overlay: begin
    var hasOverlay = (((options || {}).background || {}).overlay || {}).use === true;
    if (hasOverlay) {
      var overlayColor = (((options || {}).background || {}).overlay || {}).color;
      overlayColor = imageneratorCheckString(overlayColor) ? overlayColor : imageneratorOptions.background.overlay.color;
      context.fillStyle = overlayColor;
      context.fillRect(0, 0, width, height);
      context.restore();
    }
    // draw overlay: end


    // TODO: might be helpful: begin
    // context.shadowColor = 'rgba(0,0,0,1)';
    // context.shadowBlur = 100;
    // TODO: might be helpful: end

    // title: begin
    var useTitle = ((options || {}).title || {}).use === true;
    if (useTitle) {
      // title, text
      var titleText = ((options || {}).title || {}).text;
      titleText = imageneratorCheckString(titleText) ? titleText : imageneratorOptions.title.text;

      // title, text align
      var titleTextAlign = ((options || {}).title || {}).textAlign;
      titleTextAlign = imageneratorCheckString(titleTextAlign) ? titleTextAlign : imageneratorOptions.title.textAlign;

      // title, pos x by alignment
      var titlePosX = canvasPosXCenter;
      if (titleTextAlign === 'left') {
        titlePosX = canvasContentPosLeft;
      } else if (titleTextAlign === 'right') {
        titlePosX = canvasContentPosRight;
      }

      // title, pos top
      var titlePosTop = ((options || {}).title || {}).positionTop;
      titlePosTop = imageneratorCheckNumber(titlePosTop) ? titlePosTop : imageneratorOptions.title.positionTop;

      // title, font && line height
      var titleFontSize = ((options || {}).title || {}).fontSize;
      var titleLineHeight = imageneratorCheckNumber(titleFontSize) ? (titleFontSize * 1.5) : (imageneratorOptions.title.fontSize * 1.5);
      titleFontSize = imageneratorCheckNumber(titleFontSize) ? (titleFontSize + 'px') : (imageneratorOptions.title.fontSize + 'px');

      var titleFontWeight = ((options || {}).title || {}).fontWeight;
      titleFontWeight = imageneratorCheckNumber(titleFontWeight) ? titleFontWeight : imageneratorOptions.title.fontWeight;

      var titleFontFamily = ((options || {}).title || {}).fontFamily;
      titleFontFamily = imageneratorCheckString(titleFontFamily) ? titleFontFamily : imageneratorOptions.title.fontFamily;

      var titleFont = titleFontWeight + ' ' + titleFontSize + ' ' + titleFontFamily;

      // title, max length
      var titleMaxLength = ((options || {}).title || {}).maxLength;
      titleMaxLength = imageneratorCheckNumber(titleMaxLength) ? titleMaxLength : imageneratorOptions.title.maxLength;

      // title, color
      var titleColor = ((options || {}).title || {}).color;
      titleColor = imageneratorCheckString(titleColor) ? titleColor : imageneratorOptions.title.color;

      // title, context
      context.font = titleFont;
      context.textAlign = titleTextAlign;
      context.fillStyle = titleColor;

      // fill title to the canvas
      multilineTextToCanvasContext(context, titleText, titleLineHeight, titleMaxLength, titlePosX, titlePosTop, canvasContentMaxWidth);
    }
    // title: end

    // icon: begin
    if (iconObj) {
      // icon, alignment
      var iconAlign = ((options || {}).icon || {}).align;
      iconAlign = imageneratorCheckString(iconAlign) ? iconAlign : imageneratorOptions.icon.align;
      var iconPosX = parseInt(canvasPosXCenter - (iconObj.width / 2));
      if (iconAlign === 'left') {
        iconPosX = canvasContentPosLeft;
      } else if (iconAlign === 'right') {
        iconPosX = parseInt(canvasContentPosRight - (iconObj.width));
      }

      // icon, opacity
      var iconOpacity = ((options || {}).icon || {}).opacity;
      iconOpacity = imageneratorCheckNumber(iconOpacity) ? iconOpacity : imageneratorOptions.icon.opacity;

      // icon, pos top
      var iconPosTop = ((options || {}).icon || {}).positionTop;
      iconPosTop = imageneratorCheckNumber(iconPosTop) ? iconPosTop : imageneratorOptions.icon.positionTop;

      // icon, draw
      context.globalAlpha = iconOpacity;
      context.drawImage(iconObj.element, iconPosX, iconPosTop, iconObj.width, iconObj.height);
      context.globalAlpha = 1;
    }
    // icon: end

    // description: begin
    var useDescription = ((options || {}).description || {}).use === true;
    if (useDescription) {
      // description, text
      var descriptionText = ((options || {}).description || {}).text;
      descriptionText = imageneratorCheckString(descriptionText) ? descriptionText : imageneratorOptions.description.text;

      // description, text align
      var descriptionTextAlign = ((options || {}).description || {}).textAlign;
      descriptionTextAlign = imageneratorCheckString(descriptionTextAlign) ? descriptionTextAlign : imageneratorOptions.description.textAlign;

      // description, pos x by alignment
      var descriptionPosX = canvasPosXCenter;
      if (descriptionTextAlign === 'left') {
        descriptionPosX = canvasContentPosLeft;
      } else if (descriptionTextAlign === 'right') {
        descriptionPosX = canvasContentPosRight;
      }

      // description, pos top
      var descriptionPosTop = ((options || {}).description || {}).positionTop;
      descriptionPosTop = imageneratorCheckNumber(descriptionPosTop) ? descriptionPosTop : imageneratorOptions.description.positionTop;

      // description, font && line height
      var descriptionFontSize = ((options || {}).description || {}).fontSize;
      var descriptionLineHeight = imageneratorCheckNumber(descriptionFontSize) ? (descriptionFontSize * 1.5) : (imageneratorOptions.description.fontSize * 1.5);
      descriptionFontSize = imageneratorCheckNumber(descriptionFontSize) ? (descriptionFontSize + 'px') : (imageneratorOptions.description.fontSize + 'px');

      var descriptionFontWeight = ((options || {}).description || {}).fontWeight;
      descriptionFontWeight = imageneratorCheckNumber(descriptionFontWeight) ? descriptionFontWeight : imageneratorOptions.description.fontWeight;

      var descriptionFontFamily = ((options || {}).description || {}).fontFamily;
      descriptionFontFamily = imageneratorCheckString(descriptionFontFamily) ? descriptionFontFamily : imageneratorOptions.description.fontFamily;

      var descriptionFont = descriptionFontWeight + ' ' + descriptionFontSize + ' ' + descriptionFontFamily;

      // description, max length
      var descriptionMaxLength = ((options || {}).description || {}).maxLength;
      descriptionMaxLength = imageneratorCheckNumber(descriptionMaxLength) ? descriptionMaxLength : imageneratorOptions.description.maxLength;

      // description, color
      var descriptionColor = ((options || {}).description || {}).color;
      descriptionColor = imageneratorCheckString(descriptionColor) ? descriptionColor : imageneratorOptions.description.color;

      // description, context
      context.font = descriptionFont;
      context.textAlign = descriptionTextAlign;
      context.fillStyle = descriptionColor;

      // fill description to the canvas
      multilineTextToCanvasContext(context, descriptionText, descriptionLineHeight, descriptionMaxLength, descriptionPosX, descriptionPosTop, canvasContentMaxWidth);
    }
    // description: end


    // check the uses: begin
    var useAuthor = ((options || {}).author || {}).use === true;
    var useDomain = ((options || {}).domain || {}).use === true;
    // check the uses: end


    // return: begin
    if (typeof callback === 'function') {
      var fullQuality = canvas.toDataURL('image/png', 1.0);
      var loading = false;
      var response = {
        base64: fullQuality,
        loading: loading,
      };
      return callback(response);
    } else {
      return false;
    }
    // return: end




    var ttl = document.getElementById('title').value || null;
    var dsc = document.getElementById('desc').value || null;
    var athr = document.getElementById('author').value || null;

    // loading
    Notiflix.Block.Standard('.export', 'Please wait...');

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var canvasW = canvas.width;
    var canvasH = canvas.height;
    var posXCenter = canvasW / 2;
    var posYCenter = canvasH / 2;
    context.font = 'normal 20px "Montserrat", sans-serif';
    context.fillText(' ', 0, 0);
    context.save();

    // image
    var img = image || document.getElementById('image');
    context.drawImage(img, 0, 0, 1920, 1920 * (img.height / img.width));

    // effect
    var grunge = document.getElementById('grunge');
    context.filter = 'grayscale(100%)';
    context.globalAlpha = 0.5;
    context.drawImage(grunge, 0, 0, 1920, 1920);
    context.filter = 'none';
    context.globalAlpha = 1;

    // overlay
    context.fillStyle = 'rgba(0,0,0,0.3)';
    context.fillRect(0, 0, canvasW, canvasH);

    // icon
    var icon = document.getElementById('icon');
    var iconWH = 200;
    context.globalAlpha = 0.7;
    context.drawImage(icon, (posXCenter - (iconWH / 2)), posYCenter - (iconWH * 1.5), iconWH, iconWH);
    context.globalAlpha = 1;

    // all text
    context.fillStyle = '#fff';
    context.textAlign = 'center';
    var contentMaxWidth = canvasW - (canvasW / 3);

    // title
    var title = ttl || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    context.font = '600 75px "Montserrat", sans-serif';
    var titleLineHeight = 120;
    var titleMaxLength = 75;
    var titlePosTop = 360;
    multilineTextToCanvasContext(context, title, titleLineHeight, titleMaxLength, posXCenter, titlePosTop, contentMaxWidth);

    // message
    var message = dsc || 'Lorem ipsum dolor sit amet, cons ectetur adip iscing elit, sed do eiusmod tempor incid idunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nos trud exer citation ullamco lab oris nisi ut aliquip ex ea comm odo cons equat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    context.font = 'normal 60px "Montserrat", sans-serif';
    var messageLineHeight = 90;
    var messageMaxLength = 160;
    var messagePosTop = posYCenter + 100;
    multilineTextToCanvasContext(context, message, messageLineHeight, messageMaxLength, posXCenter, messagePosTop, contentMaxWidth);

    // author text
    var author = athr || '- John DOE -';
    context.font = '500 50px "Montserrat", sans-serif';
    context.fillStyle = 'rgba(255,255,255,0.7)';
    var authorLineHeight = 50;
    var authorMaxLength = 20;
    var authorPosBottom = canvasH - 450;
    multilineTextToCanvasContext(context, author, authorLineHeight, authorMaxLength, posXCenter, authorPosBottom, contentMaxWidth);

    // domain text
    var domain = 'furcan.net';
    context.font = '400 44px "Montserrat", sans-serif';
    context.fillStyle = 'rgba(255,255,255,0.6)';
    var domainLineHeight = 50;
    var domainMaxLength = 20;
    var domainPosBottom = canvasH - 100;
    multilineTextToCanvasContext(context, domain, domainLineHeight, domainMaxLength, posXCenter, domainPosBottom, contentMaxWidth);

    context.restore();

    // to solve the issue of fetching the fonts from url
    if (fontCheck) {
      var tmt = setTimeout(function t() {
        // create canvas again
        canvasCreate(img, false);

        // remove loadinh indicator
        Notiflix.Block.Remove('.export', 360);

        // create img to download
        canvasDownload(canvas);

        clearTimeout(tmt);
      }, 1000);
    }
  };

  var Imagenerator = function (options) {
    this.options = options;
  };

  Imagenerator.prototype = {
    GetBase64: function getBase64(callback) {
      return imageneratorInit(this.options, callback);
    },
  };

  return Imagenerator;
});
