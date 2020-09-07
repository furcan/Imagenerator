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
    type: 'jpeg', // "png" || "jpeg" || "webp"
    quailty: 0.75, // "0.25" - "1"
    fontFix: false,
    background: {
      url: null,
      crossorigin: 'anonymous',
      width: 1920,
      height: 1920,
      overlay: {
        use: true,
        color: 'rgba(0,0,0,0.4)',
      },
    },
    title: {
      use: true,
      positionTop: 300,
      text: 'Imagenerator',
      maxLength: 120,
      fontSize: 80,
      fontWeight: 600,
      textAlign: 'center',
      fontFamily: 'sans-serif',
      color: '#fff',
      shadowColor: 'rgba(0,0,0,0.2)',
      shadowBlur: 120,
    },
    icon: {
      use: false,
      url: null,
      positionTop: 480,
      width: 240,
      height: 240,
      align: 'center',
      opacity: 1,
      shadowColor: 'rgba(0,0,0,0.2)',
      shadowBlur: 120,
    },
    description: {
      use: true,
      positionTop: 900,
      text: 'There are two Mustafa Kemal: One is me, flesh and bone, a temporary Mustafa Kemal... I cannot express the other Mustafa Kemal with the word "I"; it is us, not me! The other one is an intellectual and warrior community in every corner of the country striving for new ideas, new life, and great ideals. I am representing their dreams. My attempts are to satisfy what they long for. That Mustafa Kemal is you; you are all. The other Mustafa Kemal, who is not temporary, has to live and be successful!',
      maxLength: 500,
      fontSize: 50,
      fontWeight: 400,
      textAlign: 'center',
      fontFamily: 'sans-serif',
      color: '#f8f8f8',
      shadowColor: 'rgba(0,0,0,0.2)',
      shadowBlur: 120,
    },
    author: {
      use: true,
      positionTop: 1600,
      text: '- Mustafa Kemal ATATURK -',
      maxLength: 120,
      fontSize: 40,
      fontWeight: 400,
      textAlign: 'center',
      fontFamily: 'sans-serif',
      color: '#c4c4c4',
      shadowColor: 'rgba(0,0,0,0.2)',
      shadowBlur: 120,
    },
    domain: {
      use: true,
      positionBottom: 100,
      text: 'github.com/furcan',
      maxLength: 120,
      fontSize: 35,
      fontWeight: 400,
      textAlign: 'center',
      fontFamily: 'sans-serif',
      color: '#a9a9a9',
      shadowColor: 'rgba(0,0,0,0.2)',
      shadowBlur: 120,
    },
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

  var imageneratorCheckString = function checkString(string) {
    return typeof string === 'string' && string.length > 0;
  };

  var imageneratorCheckNumber = function checkString(number) {
    return typeof number === 'number' && number > 0;
  };

  var imageneratorMultilineTextToCanvasContext = function mlTxtToCnvsCtx(ctx, text, lineHeight, maxLength, x, y, maxWidth) {
    // message max length
    maxLength = imageneratorCheckNumber(maxLength) ? maxLength : 120;

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

  var imageneratorFillTextToCanvasContent = function fillText(self, item, ctx, canvasOpt) {
    var useItem = item.use === true;
    if (useItem) {
      // item, default options
      var defaultOpt = imageneratorOptions[self];

      // item, text
      var text = item.text;
      text = imageneratorCheckString(text) ? text : defaultOpt.text;

      // item, text align
      var textAlign = item.textAlign;
      textAlign = imageneratorCheckString(textAlign) ? textAlign : defaultOpt.textAlign;

      // item, pos x by alignment
      var posX = canvasOpt.posXCenter;
      if (textAlign === 'left') {
        posX = canvasOpt.contentPosLeft;
      } else if (textAlign === 'right') {
        posX = canvasOpt.contentPosRight;
      }

      // item, pos top
      var posTop = item.positionTop;
      posTop = imageneratorCheckNumber(posTop) ? posTop : defaultOpt.positionTop;
      if (!posTop) {
        var posBottom = item.positionBottom;
        posBottom = imageneratorCheckNumber(posBottom) ? posBottom : defaultOpt.positionBottom;
        posTop = (canvasOpt.height - posBottom);
      }

      // item, font && line height
      var fontSize = item.fontSize;
      var lineHeight = imageneratorCheckNumber(fontSize) ? (fontSize * 1.5) : (defaultOpt.fontSize * 1.5);
      fontSize = imageneratorCheckNumber(fontSize) ? (fontSize + 'px') : (defaultOpt.fontSize + 'px');

      var fontWeight = item.fontWeight;
      fontWeight = imageneratorCheckNumber(fontWeight) ? fontWeight : defaultOpt.fontWeight;

      var fontFamily = item.fontFamily;
      fontFamily = imageneratorCheckString(fontFamily) ? fontFamily : defaultOpt.fontFamily;

      var font = fontWeight + ' ' + fontSize + ' ' + fontFamily;

      // item, max length
      var maxLength = item.maxLength;
      maxLength = imageneratorCheckNumber(maxLength) ? maxLength : defaultOpt.maxLength;

      // item, color
      var color = item.color;
      color = imageneratorCheckString(color) ? color : defaultOpt.color;

      // item, shadow color
      var shadowColor = item.shadowColor;
      shadowColor = imageneratorCheckString(shadowColor) ? shadowColor : defaultOpt.shadowColor;

      // item, shadow blur
      var shadowBlur = item.shadowColor;
      shadowBlur = imageneratorCheckNumber(shadowBlur) ? shadowBlur : defaultOpt.shadowBlur;

      // item, context
      ctx.font = font;
      ctx.textAlign = textAlign;
      ctx.fillStyle = color;
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;

      // fill item to the canvas
      imageneratorMultilineTextToCanvasContext(ctx, text, lineHeight, maxLength, posX, posTop, canvasOpt.contentMaxWidth);
    }
  };

  var imageneratorCanvas = function createCanvas(width, height, image, iconObj, options, callback, fontFix) {
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
    var canvasOptions = {
      width: width,
      height: height,
      posXCenter: canvasPosXCenter,
      posYCenter: canvasPosYCenter,
      contentMaxWidth: canvasContentMaxWidth,
      contentPosLeft: canvasContentPosLeft,
      contentPosRight: canvasContentPosRight,
    };
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

      // item, shadow color
      var iconShadowColor = ((options || {}).icon || {}).shadowColor;
      iconShadowColor = imageneratorCheckString(iconShadowColor) ? iconShadowColor : imageneratorOptions.icon.shadowColor;

      // item, shadow blur
      var iconShadowBlur = ((options || {}).icon || {}).shadowBlur;
      iconShadowBlur = imageneratorCheckNumber(iconShadowBlur) ? iconShadowBlur : imageneratorOptions.icon.shadowBlur;

      // icon, draw
      context.globalAlpha = iconOpacity;
      context.shadowColor = iconShadowColor;
      context.shadowBlur = iconShadowBlur;
      context.drawImage(iconObj.element, iconPosX, iconPosTop, iconObj.width, iconObj.height);
      context.globalAlpha = 1;
    }
    // icon: end

    // title: begin
    imageneratorFillTextToCanvasContent('title', options.title, context, canvasOptions);
    // title: end

    // description: begin
    imageneratorFillTextToCanvasContent('description', options.description, context, canvasOptions);
    // description: end

    // author: begin
    imageneratorFillTextToCanvasContent('author', options.author, context, canvasOptions);
    // author: end

    // domain: begin
    imageneratorFillTextToCanvasContent('domain', options.domain, context, canvasOptions);
    // domain: end

    // return: begin
    if (typeof callback === 'function') {
      var quailty = typeof options.quailty === 'number' && options.quailty > 0.25 ? options.quailty : imageneratorOptions.quailty;
      var typeArray = ['png', 'jpeg', 'webp'];
      var type = imageneratorCheckString(options.type) && typeArray.indexOf(options.type) > -1 ? options.type : imageneratorOptions.type;
      var base64 = canvas.toDataURL(('image/' + type), quailty);
      var response = {
        base64: fontFix ? null : base64,
        loading: fontFix ? true : false,
      };
      return callback(response);
    } else {
      return false;
    }
    // return: end
  };

  var imageneratorInit = function init(userOptions, callback, fontFix) {
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

          // icon, on load
          icon.onload = function iconOnLoad() {
            imageneratorCanvas(backgroundWidth, backgroundHeight, image, iconObj, newOptions, callback, fontFix);
          };
        }
        // else: only background image
        else {
          imageneratorCanvas(backgroundWidth, backgroundHeight, image, false, newOptions, callback, fontFix);
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

  var Imagenerator = function (options) {
    this.options = options;
  };

  Imagenerator.prototype = {
    GetBase64: function getBase64(callback) {
      var options = this.options;
      var fontFix = options.fontFix === true;
      var imagenerator = function name() {
        imageneratorInit(options, callback, fontFix);
        if (fontFix) {
          fontFix = false;
          var fontFixTimeout = setTimeout(function tmt() {
            imageneratorInit(options, callback, fontFix);
            clearTimeout(fontFixTimeout);
          }, 1923);
        }
      };
      return imagenerator();
    },
  };

  return Imagenerator;
});
