'use strict';

(function () {
  // загрузка данных с сервера
  var onSuccess = function (imgCards) {
    // var imgCards = []; // массив карточек для загруженных с сервера данных
    // imgCards = cardsFromServer;

    var elementsList = document.querySelector('.pictures');
    var fragment = document.createDocumentFragment();
    var template = document.querySelector('#picture').content.querySelector('a');
    for (var i = 0; i < imgCards.length; i++) {
      fragment.appendChild(window.picture.createElement(template, imgCards[i]));
    }

    elementsList.appendChild(fragment);

    var cardList = document.querySelector('.pictures');
    var cardsInList = cardList.querySelectorAll('.picture'); // заберем созданные элементы карточек

    // обработчик событий click по картинке и enter на выбранной картинке (номер карточки совпадаем с номером элемента в созданной разметке)
    cardList.addEventListener('keydown', function (evt) {
      var target = evt.target.closest('.picture');
      if (evt.keyCode === window.util.ENTER_KEYCODE) {
        for (var j = 0; j < cardsInList.length; j++) {
          if (target === cardsInList[j]) {
            window.preview.createBigPicture(imgCards[j]);
          }
        }
      }
    });
    cardList.addEventListener('click', function (evt) {
      var target = evt.target;
      if (target.className === 'picture__img') {
        for (var k = 0; k < cardsInList.length; k++) {
          if (target.closest('.picture') === cardsInList[k]) {
            window.preview.createBigPicture(imgCards[k]);
          }
        }
      }
    });
  };

  var onError = function (message) {
    var main = document.querySelector('main');
    var fragment = document.createDocumentFragment();
    var template = document.querySelector('#error').content;

    var errorElement = template.cloneNode(true);
    errorElement.querySelector('.error__title').textContent = message;

    fragment.appendChild(errorElement);

    main.appendChild(fragment);
  };

  window.load(onSuccess, onError);
})();
