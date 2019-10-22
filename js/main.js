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

  // обеъекты и переменные для работы с загрузкой файла
  var uploadFile = document.querySelector('#upload-file');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var imgUploadOverlayButtonClose = imgUploadOverlay.querySelector('#upload-cancel');

  var effectLevelPin = imgUploadOverlay.querySelector('.effect-level__pin'); // pin
  var effectLevelDepth = imgUploadOverlay.querySelector('.effect-level__depth'); // линия глубины эффекта
  var effectLevelDepthStartValue; // стартовое значение глубины
  var effectLevelDepthValue; // значение глубины эффекта после изменения положения pin-а
  var effectLevelValueElement = imgUploadOverlay.querySelector('.effect-level__value');
  var effectLevelDepthLineWidth; // длина линии перемещения ползунка
  var effectList = imgUploadOverlay.querySelector('.effects__list'); // список эффектов

  var inputHashtags = imgUploadOverlay.querySelector('.text__hashtags');
  var textDescription = imgUploadOverlay.querySelector('.text__description');
  // var imgUploadOverlaySabmit = imgUploadOverlay.querySelector('#upload-submit');

  // после выбора файла (событие change) показываем форму редактирования изображения
  uploadFile.addEventListener('change', function () {
    imgUploadOverlay.classList.remove('hidden');

    effectLevelDepthStartValue = effectLevelDepth.offsetWidth / effectLevelDepth.parentElement.offsetWidth; // расчет величины стартового значения эффекта - ?!:значения есть, то в результат пишет NaN
    effectLevelDepthLineWidth = effectLevelDepth.parentElement.offsetWidth; // длина линии перемещения ползунка
  });

  document.addEventListener('keydown', function (evt) {
    if ((evt.keyCode === ESC_KEYCODE) && (document.activeElement !== inputHashtags) && (document.activeElement !== textDescription)) {
      imgUploadOverlay.classList.add('hidden');
      uploadFile.value = '';
    }
  });

  imgUploadOverlayButtonClose.addEventListener('click', function () {
    imgUploadOverlay.classList.add('hidden');
    uploadFile.value = '';
  });

  // перемещение ползунка на эффектах
  var startCoords = {
    x: 0,
    y: 0
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shiftX = startCoords.x - moveEvt.clientX;

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var newPinXCood = effectLevelPin.offsetLeft - shiftX;

    // ... и установим ограничение на перемещение pin-а
    if (newPinXCood < 0) {
      newPinXCood = 0;
    } else if (newPinXCood > effectLevelDepthLineWidth) {
      newPinXCood = effectLevelDepthLineWidth;
    } else {
      newPinXCood = effectLevelPin.offsetLeft - shiftX;
    }

    effectLevelPin.style.left = newPinXCood + 'px';
    effectLevelDepth.style.width = newPinXCood + 'px';
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    // расчет значения величины эффекта
    if (effectLevelDepthLineWidth !== 0) {
      effectLevelDepthValue = effectLevelDepth.offsetWidth / effectLevelDepthLineWidth;
    } else {
      effectLevelDepthValue = 0;
    }
    effectLevelValueElement.value = effectLevelDepthValue;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // события при переключении эффекта
  effectList.addEventListener('change', function () {
    effectLevelPin.style.left = effectLevelDepthStartValue * effectLevelDepthLineWidth + 'px';
    effectLevelDepth.style.width = effectLevelDepthStartValue * effectLevelDepthLineWidth + 'px';
    effectLevelDepthValue = effectLevelDepthStartValue;
  });

  // проверка хеш-тегов...
  // проверка на дубли в массиве
  var isCheckDoubles = function (chkArray) {
    var countDbl = 0;
    for (var i = 0; i < chkArray.length - 1; i++) {
      for (var j = i + 1; j < chkArray.length; j++) {
        if (chkArray[i] === chkArray[j]) {
          countDbl++;
        }
      }
    }
    return countDbl > 0;
  };

  // imgUploadOverlaySabmit.addEventListener('click', function () {
  inputHashtags.addEventListener('input', function () {
    // если хеш-теги есть
    if (inputHashtags.value !== '') {
      var hashtagsArray = inputHashtags.value.split(' '); // разобьем строку

      // приведем в одному регистру
      hashtagsArray = hashtagsArray.map(function (currentElement) {
        return currentElement.toLowerCase();
      });

      var istHashSimbol = true;
      var isOnlyHashSimbol = true;
      var is20PlusSimbols = true;
      hashtagsArray.forEach(function (currentElement) {
        istHashSimbol = istHashSimbol && (currentElement.slice(0, 1) === '#'); // хеш-тег без решетки?
        isOnlyHashSimbol = isOnlyHashSimbol && ((currentElement.slice(0, 1) === '#') && (currentElement.length !== 1)); // только символ хеш-тега?
        is20PlusSimbols = is20PlusSimbols && !(currentElement.length >= 20);
      });

      // inputHashtags.setCustomValidity('');
      if (hashtagsArray.length > 5) {
        inputHashtags.setCustomValidity('Должно быть не более 5 хеш-тегов');
      } else if (!istHashSimbol) {
        inputHashtags.setCustomValidity('Хеш-тег должен начинаться с символа #');
      } else if (!isOnlyHashSimbol) {
        inputHashtags.setCustomValidity('Хеш-тег не может состоять только из одной решетки');
      } else if (!is20PlusSimbols) {
        inputHashtags.setCustomValidity('Максимальная длина одного хэш-тега не может быть более 20 символов, включая решётку');
      } else if (isCheckDoubles(hashtagsArray)) {
        inputHashtags.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
      } else {
        inputHashtags.setCustomValidity('');
      }
    }
  });
})();
