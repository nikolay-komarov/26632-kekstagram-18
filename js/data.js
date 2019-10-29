'use strict';

(function () {
  var CARD_QUANTITY = 25; // кол-во карточек в гелерее

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

  var generateMocks = function () {
    var mocks = [];
    var mockComments = [];

    for (var i = 0; i < CARD_QUANTITY; i++) {
      mockComments = [];
      for (var j = 0; j < window.util.getRandomInt(1, 2); j++) {
        mockComments[j] = {
          avatar: 'img/avatar-' + window.util.getRandomInt(1, 6) + '.svg',
          message: commentsMap[window.util.getRandomInt(0, 5)],
          name: namesMap[window.util.getRandomInt(0, 5)]
        };
      }
      mocks[i] = {
        url: 'photos/' + (i + 1) + '.jpg',
        description: 'photos/' + (i + 1) + '.jpg',
        likes: window.util.getRandomInt(15, 200),
        comments: mockComments
      };
    }

    return mocks;
  };

  window.data = {
    generateMocks: generateMocks
  };
})();
