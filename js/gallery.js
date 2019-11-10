'use strict';

(function () {
  var MAX_CARD_SORT_RANDOM = 10;

  var renderPictures = function (cards) {
    var elementsList = document.querySelector('.pictures');
    var fragment = document.createDocumentFragment();
    var template = document.querySelector('#picture').content.querySelector('a');
    for (var i = 0; i < cards.length; i++) {
      fragment.appendChild(window.picture.createElement(template, cards[i]));
    }

    elementsList.appendChild(fragment);
  };

  var clearPictures = function () {
    var clearedElements = document.querySelector('.pictures').querySelectorAll('.picture');
    clearedElements.forEach(function (it) {
      it.remove();
    });
  };

  var shuffleCards = function (cards) {
    var j;
    var tempArr = [];
    for (var i = cards.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      tempArr = cards[j];
      cards[j] = cards[i];
      cards[i] = tempArr;
    }
    return cards;
  };
  var getUniqCards = function (cards) {
    var uniqCards = [];
    uniqCards = cards.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    return uniqCards;
  };
  var sortToPopular = function (cards) {
    return cards.slice();
  };
  var sortToRandom = function (cards) {
    return getUniqCards(shuffleCards(cards.slice())).slice(0, MAX_CARD_SORT_RANDOM);
  };
  var sortToDiscussed = function (cards) {
    var tempArr = [];
    tempArr = cards.slice().sort(function (a, b) {
      return b.likes - a.likes;
    });
    return tempArr;
  };
  var sortMethodsMap = {
    'filter-popular': sortToPopular,
    'filter-random': sortToRandom,
    'filter-discussed': sortToDiscussed
  };

  var imgFilters = document.querySelector('.img-filters');
  var imgFiltersForm = document.querySelector('.img-filters__form');
  var imgFiltersButtons = document.querySelectorAll('.img-filters__button');
  var newCards = [];
  var cardList;
  var cardsInList;

  var updateCardsList = window.debounce(function (evt, cards) {
    newCards = [];
    clearPictures();
    var target = evt.target.closest('.img-filters__button');
    imgFiltersButtons.forEach(function (it) {
      it.classList.remove('img-filters__button--active');
    });
    target.classList.add('img-filters__button--active');
    newCards = sortMethodsMap[target.id](cards);
    renderPictures(newCards);

    cardList = document.querySelector('.pictures');
    cardsInList = cardList.querySelectorAll('.picture'); // заберем созданные элементы карточек
  });

  // загрузка данных с сервера
  var onSuccessLoad = function (imgCards) {
    imgFilters.classList.remove('img-filters--inactive');

    // первая отрисовка карточек по загруженным данным
    newCards = imgCards.slice();
    renderPictures(newCards);
    cardList = document.querySelector('.pictures');
    cardsInList = cardList.querySelectorAll('.picture'); // заберем созданные элементы карточек

    // обработка события при клику на кноках выбора фильтра
    imgFiltersForm.addEventListener('click', function (evt) {
      updateCardsList(evt, imgCards);
    });

    // обработчик событий click по картинке и enter на выбранной картинке (номер карточки совпадает с номером элемента в созданной разметке)
    cardList.addEventListener('keydown', function (evt) {
      var target = evt.target.closest('.picture');
      if (evt.keyCode === window.util.ENTER_KEYCODE) {
        for (var j = 0; j < cardsInList.length; j++) {
          if (target === cardsInList[j]) {
            window.preview.createBigPicture(newCards[j]);
          }
        }
      }
    });
    cardList.addEventListener('click', function (evt) {
      var target = evt.target;
      if (target.className === 'picture__img') {
        for (var k = 0; k < cardsInList.length; k++) {
          if (target.closest('.picture') === cardsInList[k]) {
            window.preview.createBigPicture(newCards[k]);
          }
        }
      }
    });
  };

  var onErrorLoad = function (message) {
    var main = document.querySelector('main');
    var fragment = document.createDocumentFragment();
    var template = document.querySelector('#error').content;

    var errorElement = template.cloneNode(true);
    errorElement.querySelector('.error__title').textContent = message;

    fragment.appendChild(errorElement);

    main.appendChild(fragment);
  };

  window.load(onSuccessLoad, onErrorLoad);
})();
