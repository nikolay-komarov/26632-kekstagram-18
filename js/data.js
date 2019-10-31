'use strict';

(function () {
  var CARD_QUANTITY = 25; // кол-во карточек в гелерее
  var AVATAR_IMG_NUMBER_MIN = 1;
  var AVATAR_IMG_NUMBER_MAX = 6;
  var COMMENTS_QUANTITY_MIN = 1;
  var COMMENTS_QUANTITY_MAX = 2;
  var LIKES_QAUNTITY_MIN = 15;
  var LIKES_QAUNTITY_MAX = 200;

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
      for (var j = 0; j < window.util.getRandomInt(COMMENTS_QUANTITY_MIN, COMMENTS_QUANTITY_MAX); j++) {
        mockComments[j] = {
          avatar: 'img/avatar-' + window.util.getRandomInt(AVATAR_IMG_NUMBER_MIN, AVATAR_IMG_NUMBER_MAX) + '.svg',
          message: commentsMap[window.util.getRandomInt(0, commentsMap.length)],
          name: namesMap[window.util.getRandomInt(0, namesMap.length)]
        };
      }
      mocks[i] = {
        url: 'photos/' + (i + 1) + '.jpg',
        description: 'photos/' + (i + 1) + '.jpg',
        likes: window.util.getRandomInt(LIKES_QAUNTITY_MIN, LIKES_QAUNTITY_MAX),
        comments: mockComments
      };
    }

    return mocks;
  };

  window.data = {
    generateMocks: generateMocks
  };
})();
