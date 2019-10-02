'use strict';

(function () {
  var CARD_QUANTITY = 25; // если будет использоваться в других места, то переопределить

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
  };

  createElements();
})();
