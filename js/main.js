'use strict';

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

  for (var i = 0; i < 25; i++) {
    var mockComments = [];
    for (var j = 0; j < getRandomInt(1, 2); j++) {
      mockComments[j] = {
        avatar: 'img/avatar-' + getRandomInt(1, 6) + '.svg',
        comment: commentsMap[getRandomInt(0, 5)],
        name: namesMap[getRandomInt(0, 5)]
      };
    }

    var mock = {
      imgUrl: 'photos/' + (i + 1) + '.jpg',
      description: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomInt(15, 200),
      comments: mockComments
    };
    mocks[i] = mock;
  }

  return mocks;
};

var createElement = function (template, cardData) {
  var newElement = template.cloneNode(true);
  newElement.children[0].src = cardData.imgUrl;
  newElement.children[0].alt = cardData.description;

  newElement.children[1].children[0].textContent = cardData.comments.length;
  newElement.children[1].children[1].textContent = cardData.likes;

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

/*
var createElements = function () {
  var cards = generateMocks();
  var elementsLits = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  var template = document.querySelector('#picture').content.querySelector('a');

  for (var i = 0; i < cards.length; i++) {
    var newElement = template.cloneNode(true);
    newElement.children[0].src = cards[i].imgUrl;
    newElement.children[0].alt = cards[i].description;

    newElement.children[1].children[0].textContent = cards[i].comments.length;
    newElement.children[1].children[1].textContent = cards[i].likes;

    fragment.appendChild(newElement);
  }

  elementsLits.appendChild(fragment);
};
*/

// console.log(generateMocks());
