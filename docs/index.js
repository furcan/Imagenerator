// Demo: backgrounds events: begin
var backgrounds = window.document.querySelectorAll('img.js-background');
backgrounds.forEach(function backgroundEach(event) {
  var background = event;
  background.addEventListener('click', function backgroundClick(event) {
    var bTarget = event.target;
    for (var bIndex = 0; bIndex < backgrounds.length; bIndex++) {
      var bck = backgrounds[bIndex];
      bck.classList.remove('js-active');
      bck.classList.add('js-passive');
    }
    bTarget.classList.remove('js-passive');
    bTarget.classList.add('js-active');
  });
});
// Demo: backgrounds events: end

// Demo: icons events: begin
var icons = window.document.querySelectorAll('img.js-icon');
icons.forEach(function iconEach(event) {
  var icon = event;
  icon.addEventListener('click', function iconClick(event) {
    var target = event.target;
    for (var index = 0; index < icons.length; index++) {
      var icn = icons[index];
      icn.classList.remove('js-active');
      icn.classList.add('js-passive');
    }
    target.classList.remove('js-passive');
    target.classList.add('js-active');
  });
});
// Demo: icons events: end

// Demo: Imagenerator: begin
var generatorClicked = false;
window.document.querySelector('.js-button-imagenerator').addEventListener('click', function imgnrtr() {
  if (!generatorClicked) {
    generatorClicked = true;

    var button = this;
    button.classList.add('js-passive');

    var backgroundUrl = window.document.querySelector('img.js-background.js-active').getAttribute('src');
    var iconUrl = window.document.querySelector('img.js-icon.js-active').getAttribute('src');

    var titleText = window.document.querySelector('input.js-inputs-title').value;
    var titlePosTop = window.document.querySelector('input.js-inputs-title-pos').value;
    var descText = window.document.querySelector('textarea.js-inputs-desc').value;
    var descPosTop = window.document.querySelector('input.js-inputs-desc-pos').value;
    var authorText = window.document.querySelector('input.js-inputs-author').value;
    var authorPosTop = window.document.querySelector('input.js-inputs-author-pos').value;
    var footerText = window.document.querySelector('input.js-inputs-footer').value;
    var footerPosBottom = window.document.querySelector('input.js-inputs-footer-pos').value;

    var image = new Imagenerator({
      // fontFix: true,
      background: {
        url: backgroundUrl,
      },
      icon: {
        url: iconUrl,
      },
      title: {
        text: titleText,
        positionTop: parseInt(titlePosTop),
      },
      description: {
        text: descText,
        positionTop: parseInt(descPosTop),
      },
      author: {
        text: authorText,
        positionTop: parseInt(authorPosTop),
      },
      footer: {
        text: footerText,
        positionBottom: parseInt(footerPosBottom),
      }
    });

    image.GetBase64(function (response) {
      if (response.loading) {
        Notiflix.Block.Dots('.js-export', 'Please wait while the image is being generated...', {
          backgroundColor: 'rgba(255,255,255,0.92)',
          svgSize: '64px',
          messageMaxLength: 300,
        });

      } else {
        var delay = 1000;

        var tmt = setTimeout(function t() {
          generatorClicked = false;
          clearTimeout(tmt);
        }, delay);

        Notiflix.Block.Remove('.js-export', delay);

        var exportElement = window.document.getElementById('Export');
        var base64 = response.base64;
        exportElement.setAttribute('src', base64);

        var downloadElement = window.document.getElementById('Download');
        downloadElement.setAttribute('href', base64);
        downloadElement.classList.remove('js-passive');
        button.classList.remove('js-passive');
      }
    });
  }
});
// Demo: Imagenerator: end
