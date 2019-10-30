'use strict';

(function () {
  var HASH_LENGTH_MAX = 20;
  var HASH_QUANTITY_MAX = 5;
  var COMMENT_LENGTH_MAX = 140;

  // обеъекты и переменные для работы с загрузкой файла
  var uploadFile = document.querySelector('#upload-file');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var imgUploadOverlayButtonClose = imgUploadOverlay.querySelector('#upload-cancel');

  var effectLevelPin = imgUploadOverlay.querySelector('.effect-level__pin'); // pin
  var effectLevelDepth = imgUploadOverlay.querySelector('.effect-level__depth'); // линия глубины эффекта
  var effectLevelDepthStartValue; // стартовое значение глубины
  var effectLevelDepthValue; // значение глубины эффекта после изменения положения pin-а
  var effectLevelValueElement = imgUploadOverlay.querySelector('.effect-level__value');
  var effectLevelDepthLineLength; // длина линии перемещения ползунка
  var effectList = imgUploadOverlay.querySelector('.effects__list'); // список эффектов

  var textHashtags = imgUploadOverlay.querySelector('.text__hashtags');
  var textDescription = imgUploadOverlay.querySelector('.text__description');
  var imgUploadOverlaySabmit = imgUploadOverlay.querySelector('#upload-submit');

  // после выбора файла (событие change) показываем форму редактирования изображения
  uploadFile.addEventListener('change', function () {
    imgUploadOverlay.classList.remove('hidden');

    effectLevelDepthStartValue = effectLevelDepth.offsetWidth / effectLevelDepth.parentElement.offsetWidth; // расчет величины стартового значения эффекта - ?!:значения есть, то в результат пишет NaN
    effectLevelDepthLineLength = effectLevelDepth.parentElement.offsetWidth; // длина линии перемещения ползунка
  });

  // закрытие формы редактирования изображения
  document.addEventListener('keydown', function (evt) {
    if ((evt.keyCode === window.util.ESC_KEYCODE) && (document.activeElement !== textHashtags) && (document.activeElement !== textDescription)) {
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
    } else if (newPinXCood > effectLevelDepthLineLength) {
      newPinXCood = effectLevelDepthLineLength;
    } else {
      newPinXCood = effectLevelPin.offsetLeft - shiftX;
    }

    effectLevelPin.style.left = newPinXCood + 'px';
    effectLevelDepth.style.width = newPinXCood + 'px';
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    // расчет значения величины эффекта
    if (effectLevelDepthLineLength !== 0) {
      effectLevelDepthValue = effectLevelDepth.offsetWidth / effectLevelDepthLineLength;
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
    effectLevelPin.style.left = effectLevelDepthStartValue * effectLevelDepthLineLength + 'px';
    effectLevelDepth.style.width = effectLevelDepthStartValue * effectLevelDepthLineLength + 'px';
    effectLevelDepthValue = effectLevelDepthStartValue;
  });

  // проверка хеш-тегов...
  // проверка на дубли в массиве
  var hasDoubles = function (checkedArray) {
    var countDbl = 0;
    for (var i = 0; i < checkedArray.length - 1; i++) {
      for (var j = i + 1; j < checkedArray.length; j++) {
        if (checkedArray[i] === checkedArray[j]) {
          countDbl++;
        }
      }
    }
    return countDbl > 0;
  };

  textHashtags.addEventListener('input', function () {
    textHashtags.setCustomValidity('');
  });

  imgUploadOverlaySabmit.addEventListener('click', function () {
    textHashtags.value = textHashtags.value.trim(); // удалим пробелы с начала и с конца строки

    // если хеш-теги есть
    if (textHashtags.value !== '') {
      var hashtagsArray = textHashtags.value.split(/ +/g); // разобьем строку

      // приведем в одному регистру
      hashtagsArray = hashtagsArray.map(function (currentElement) {
        return currentElement.toLowerCase();
      });

      var isHashSimbol = true;
      var isOnlyHashSimbol = true;
      var isOverMaxSimbols = true;
      hashtagsArray.forEach(function (currentElement) {
        isHashSimbol = isHashSimbol && (currentElement.slice(0, 1) === '#'); // хеш-тег без решетки?
        isOnlyHashSimbol = isOnlyHashSimbol && (currentElement.slice(0, 1) === '#' && currentElement.length !== 1); // только символ хеш-тега?
        isOverMaxSimbols = isOverMaxSimbols && !(currentElement.length > HASH_LENGTH_MAX);
      });

      if (hashtagsArray.length > HASH_QUANTITY_MAX) {
        textHashtags.setCustomValidity('Должно быть не более 5 хеш-тегов');
      } else if (!isHashSimbol) {
        textHashtags.setCustomValidity('Хеш-тег должен начинаться с символа #');
      } else if (!isOnlyHashSimbol) {
        textHashtags.setCustomValidity('Хеш-тег не может состоять только из одной решетки');
      } else if (!isOverMaxSimbols) {
        textHashtags.setCustomValidity('Максимальная длина одного хэш-тега не может быть более 20 символов, включая решётку');
      } else if (hasDoubles(hashtagsArray)) {
        textHashtags.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
      } else {
        textHashtags.setCustomValidity('');
      }
    }

    // проверка длины комментария
    if (textDescription.value !== '') {
      if (textDescription.value.length > COMMENT_LENGTH_MAX) {
        textDescription.setCustomValidity('Длина комментария не может составлять больше 140 символов');
      } else {
        textDescription.setCustomValidity('');
      }
    }
  });
})();
