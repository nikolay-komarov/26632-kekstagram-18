'use strict';

(function () {
  var createElements = function () {
    var cards = window.data.generateMocks();
    var elementsList = document.querySelector('.pictures');
    var fragment = document.createDocumentFragment();
    var template = document.querySelector('#picture').content.querySelector('a');

    for (var i = 0; i < cards.length; i++) {
      fragment.appendChild(window.picture.createElement(template, cards[i]));
    }

    elementsList.appendChild(fragment);

    return cards; // вернем вернем массив созданных карточек
  };

  var imgCards = createElements(); // создадим картинки и получим созданные селекторы и карточки

  var cardList = document.querySelector('.pictures');
  var cardsInList = cardList.querySelectorAll('.picture'); // заберем созданные элементы карточек

  // обработчик событий click по картинке и enter на выбранной картинке (номер карточки совпадаем с номером элемента в созданной разметке)
  cardList.addEventListener('keydown', function (evt) {
    var target = evt.target.closest('.picture');
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      for (var i = 0; i < cardsInList.length; i++) {
        if (target === cardsInList[i]) {
          window.preview.createBigPicture(imgCards[i]);
        }
      }
    }
  });
  cardList.addEventListener('click', function (evt) {
    var target = evt.target;
    if (target.className === 'picture__img') {
      for (var i = 0; i < cardsInList.length; i++) {
        if (target.closest('.picture') === cardsInList[i]) {
          window.preview.createBigPicture(imgCards[i]);
        }
      }
    }
  });
})();
