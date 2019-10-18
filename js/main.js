'use strict';

(function () {
  var CARD_QUANTITY = 25; // если будет использоваться в других места, то переопределить
  var BIG_IMG_CARD_NUMBER = 0; // номер карточки, которую выводим в big-picture (задание 3-3)
  var ESC_KEYCODE = 27;

  var commentsMap = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
  ];

  var namesMap = [
    'Иван',
    'Петр',
    'Маша',
    'Семен',
    'Дарья',
    'Фродо'
  ];

  var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var generateMocks = function () {
    var mocks = [];
    var mockComments = [];

    for (var i = 0; i < CARD_QUANTITY; i++) {
      mockComments = [];
      for (var j = 0; j < getRandomInt(1, 2); j++) {
        mockComments[j] = {
          avatar: 'img/avatar-' + getRandomInt(1, 6) + '.svg',
          message: commentsMap[getRandomInt(0, 5)],
          name: namesMap[getRandomInt(0, 5)]
        };
      }

      mocks[i] = {
        url: 'photos/' + (i + 1) + '.jpg',
        description: 'photos/' + (i + 1) + '.jpg',
        likes: getRandomInt(15, 200),
        comments: mockComments
      };
    }

    return mocks;
  };

  var createElement = function (template, cardData) {
    var newElement = template.cloneNode(true);
    newElement.querySelector('.picture__img').src = cardData.url;
    newElement.querySelector('.picture__img').alt = cardData.description;

    newElement.querySelector('.picture__comments').textContent = cardData.comments.length;
    newElement.querySelector('.picture__likes').textContent = cardData.likes;

    return newElement;
  };

  var createElements = function () {
    var cards = generateMocks();
    var elementsLits = document.querySelector('.pictures');
    var fragment = document.createDocumentFragment();
    var template = document.querySelector('#picture').content.querySelector('a');

    for (var i = 0; i < cards.length; i++) {
      fragment.appendChild(createElement(template, cards[i]));
    }

    elementsLits.appendChild(fragment);

    return cards; // вернем вернем массив созданных карточек
  };

  var createBigPicture = function (card) {
    // покажем элемент big-picture и заполним его
    var bigPicture = document.querySelector('.big-picture');
    var bigPictureCommentsCount = card.comments.length;

    bigPicture.querySelector('.big-picture__img').querySelector('img').src = card.url;
    bigPicture.querySelector('.likes-count').textContent = card.likes;
    bigPicture.querySelector('.comments-count').textContent = bigPictureCommentsCount;
    bigPicture.querySelector('.social__caption').textContent = card.description;

    var socialCommentsList = bigPicture.querySelector('.social__comments');
    var socialCommentsElements = bigPicture.querySelectorAll('.social__comment');
    for (var i = 0; i < socialCommentsElements.length; i++) {
      socialCommentsList.removeChild(socialCommentsElements[i]); // удалим старые элементы
    }

    var newSocialCommentsElements = Array(bigPictureCommentsCount);
    var socialElementFragment = document.createDocumentFragment();
    for (var j = 0; j < bigPictureCommentsCount; j++) {
      newSocialCommentsElements[j] = socialCommentsElements[0].cloneNode(true); // скопируем в новый элемент старый
      newSocialCommentsElements[j].querySelector('img').src = card.comments[j].avatar;
      newSocialCommentsElements[j].querySelector('img').alt = card.comments[j].name;
      newSocialCommentsElements[j].querySelector('.social__text').textContent = card.comments[j].message;

      socialElementFragment.appendChild(newSocialCommentsElements[j]); // добавим элемент в фрагмент
    }

    socialCommentsList.appendChild(socialElementFragment);

    var socialCommentCount = bigPicture.querySelector('.social__comment-count');
    var commentsLoader = bigPicture.querySelector('.comments-loader');
    socialCommentCount.classList.add('visually-hidden');
    commentsLoader.classList.add('visually-hidden');

    bigPicture.classList.remove('hidden');

    // обработчики для закрытия окна big-picture
    var bigPictureCloseButton = bigPicture.querySelector('#picture-cancel');
    bigPictureCloseButton.addEventListener('click', function () {
      bigPicture.classList.add('hidden');
    });
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        bigPicture.classList.add('hidden');
      }
    });
  };

  var elements = createElements(); // создадим картинки и получим массив с карточками
  createBigPicture(elements[BIG_IMG_CARD_NUMBER]); // заполним и покажем большую картинку
})();
