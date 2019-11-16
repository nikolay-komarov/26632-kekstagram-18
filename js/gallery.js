'use strict';

(function () {
  var MAX_CARD_SORT_RANDOM = 10;

  var imgFilters = document.querySelector('.img-filters');
  var imgFiltersForm = document.querySelector('.img-filters__form');
  var imgFiltersButtons = document.querySelectorAll('.img-filters__button');
  var newCards = [];
  var cardsInList;

  var pictureList = document.querySelector('.pictures');
  var pictureFragment = document.createDocumentFragment();
  var pictureTemplate = document.querySelector('#picture').content.querySelector('a');

  var renderPictures = function (cards) {
    cards.forEach(function (it) {
      pictureFragment.appendChild(window.picture.createElement(pictureTemplate, it));
    });
    pictureList.appendChild(pictureFragment);

    cardsInList = pictureList.querySelectorAll('.picture'); // заберем созданные элементы карточек

    cardsInList.forEach(function (it, idx) {
      it.addEventListener('click', function () {
        window.preview.createBigPicture(cards[idx]);
      });
    });
  };

  var clearPictures = function () {
    var clearedElements = document.querySelector('.pictures').querySelectorAll('.picture');
    clearedElements.forEach(function (it) {
      it.remove();
    });
  };

  var shuffleCards = function (cards) {
    var j;
    var temp;
    for (var i = cards.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = cards[j];
      cards[j] = cards[i];
      cards[i] = temp;
    }
    return cards;
  };
  var getUniqCards = function (cards) {
    return cards.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
  };
  var sortToPopular = function (cards) {
    return cards.slice();
  };
  var sortToRandom = function (cards) {
    return getUniqCards(shuffleCards(cards.slice())).slice(0, MAX_CARD_SORT_RANDOM);
  };
  var sortToDiscussed = function (cards) {
    return cards.slice().sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
  };

  var sortMethodsMap = {
    'filter-popular': sortToPopular,
    'filter-random': sortToRandom,
    'filter-discussed': sortToDiscussed
  };

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
  });

  // загрузка данных с сервера
  var onSuccessLoad = function (imgCards) {
    imgFilters.classList.remove('img-filters--inactive');

    // первая отрисовка карточек по загруженным данным
    newCards = imgCards.slice();
    renderPictures(newCards);

    // обработка события при клику на кнопках выбора фильтра
    imgFiltersForm.addEventListener('click', function (evt) {
      updateCardsList(evt, imgCards);
    });
  };

  var onErrorLoad = function (message) {
    window.util.renderMessageElement(message, window.util.loadResults['error']);
  };

  window.load(onSuccessLoad, onErrorLoad);
})();
