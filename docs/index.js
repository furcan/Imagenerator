window.document.querySelector('.js-button-imagenerator').addEventListener('click', function imgnrtr() {
  var button = this;
  button.classList.add('js-passive');

  var image = new Imagenerator({
    // fontFix: true,
    background: {
      // url: 'https://raw.githubusercontent.com/furcan/imagenerator/master/test/feather.jpg?token=AL5JVG3R32KE55NFUJN7HI27L5ZJI',
    },
    title: {
      // text: 'Peace at home, peace in the world.',
      // fontFamily: 'Montserrat, sans-serif',
      // color: '#fc0',
      // shadowColor: '#000',
      // shadowBlur: 100,
    },
    description: {
      // text: 'The peoples who want to live comfortably without producing and fatigue; they are doomed to lose their dignity, then liberty, and then independence and destiny.',
      // fontSize: 75,
      // fontFamily: 'La Belle Aurore, Montserrat, sans-serif',
      // shadowColor: '#000',
      // shadowBlur: 100,
    },
    author: {
      // positionTop: 1600,
      // fontSize: 65,
      // color: '#bbb',
      // // fontFamily: 'Montserrat, sans-serif',
      // fontFamily: 'La Belle Aurore, Montserrat, sans-serif',
    },
    footer: {
      // fontFamily: 'Montserrat, sans-serif',
    },
    icon: {
      // url: 'https://raw.githubusercontent.com/furcan/imagenerator/master/test/imagenerator-icon.png?token=AL5JVG5ZQDXYCDU3JGYNT2S7L5ZNI',
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
      Notiflix.Block.Remove('.js-export', 1000);

      var exportElement = window.document.getElementById('Export');
      var base64 = response.base64;
      exportElement.setAttribute('src', base64);

      var downloadElement = window.document.getElementById('Download');
      downloadElement.setAttribute('href', base64);
      downloadElement.classList.remove('js-passive');
      button.classList.remove('js-passive');
    }
  });
});
