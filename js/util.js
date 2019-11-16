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

  var mainElement = document.querySelector('main');

  var fragment;
  var template;
  var elementFragment;
  var element;
  var elementButtons;

  var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var renderMessageElement = function (message, loadResult) {
    fragment = document.createDocumentFragment();
    template = document.querySelector(loadResult.template).content;
    elementFragment = template.cloneNode(true);
    elementFragment.querySelector(loadResult.title).textContent = message;
    fragment.appendChild(elementFragment);
    mainElement.appendChild(fragment);

    element = mainElement.querySelector(loadResult.element);
    elementButtons = element.querySelectorAll(loadResult.elementButtons);

    element.addEventListener('click', onMessageElementClik);
    document.addEventListener('keydown', onMessageElementPressEsc);

    elementButtons.forEach(function (it) {
      it.addEventListener('click', onMessageElementButtonClick);
    });
  };

  var onMessageElementPressEsc = function (evtUpload) {
    if (evtUpload.keyCode === window.util.ESC_KEYCODE) {
      removeMessageElement();
    }
  };
  var onMessageElementClik = function () {
    removeMessageElement();
  };
  var onMessageElementButtonClick = function () {
    removeMessageElement();
  };

  var removeMessageElement = function () {
    element.remove();
    element.removeEventListener('click', onMessageElementClik);
    document.removeEventListener('keydown', onMessageElementPressEsc);
    elementButtons.forEach(function (it) {
      it.removeEventListener('click', onMessageElementButtonClick);
    });
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
