'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var CodeXHR = {
    SUCCESS: 200,
    CACHED: 302,
    NOT_FOUND_ERROR: 404,
    SERVER_ERROR: 500
  };

  var loadResults = {
    'success': {
      template: '#success',
      title: '.success__title',
      element: '.success',
      elementButtons: '.success__button'
    },
    'error': {
      template: '#error',
      title: '.error__title',
      element: '.error',
      elementButtons: '.error__button'
    }
  };

  var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var renderMessageElement = function (message, loadResult) {
    var main = document.querySelector('main');

    var fragment = document.createDocumentFragment();
    var template = document.querySelector(loadResult.template).content;
    var elementFragment = template.cloneNode(true);
    elementFragment.querySelector(loadResult.title).textContent = message;
    fragment.appendChild(elementFragment);
    main.appendChild(fragment);

    var element = main.querySelector(loadResult.element);
    var elementButtons = element.querySelectorAll('.error__button');

    var onElementPressEsc = function (evtUpload) {
      if (evtUpload.keyCode === window.util.ESC_KEYCODE) {
        removeElement();
      }
    };

    element.addEventListener('click', function () {
      removeElement();
    });

    document.addEventListener('keydown', onElementPressEsc);

    elementButtons.forEach(function (it) {
      it.addEventListener('click', function () {
        removeElement();
      });
    });

    var removeElement = function () {
      element.remove();
      document.removeEventListener('keydown', onElementPressEsc);
    };
  };

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,
    CodeXHR: CodeXHR,
    loadResults: loadResults,

    getRandomInt: getRandomInt,
    renderMessageElement: renderMessageElement
  };
})();
