'use strict';

(function () {
  var HASH_LENGTH_MAX = 20;
  var HASH_QUANTITY_MAX = 5;
  var COMMENT_LENGTH_MAX = 140;
  var EFFECT_LEVEL_START = 1;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var SCALE_VALUE_DEFAULT = 100;
  var SCALE_VALUE_MAX = 100;
  var SCALE_VALUE_MIN = 25;
  var SCALE_STEP = 25;

  // обеъекты и переменные для работы с загрузкой файла
  var uploadFile = document.querySelector('#upload-file');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var imgUploadOverlayButtonClose = imgUploadOverlay.querySelector('#upload-cancel');

  // Перечисление, объекты и переменные для работы с эффектами
  var Effects = {
    'none': {
      effectName: 'none',
      effectClassName: ''
    },
    'chrome': {
      effectName: 'chrome',
      effectClassName: 'effects__preview--chrome',
      effectFilterName: 'grayscale',
      effectValueMin: 0,
      effectValueMax: 1,
      effectUnit: '',
    },
    'sepia': {
      effectName: 'sepia',
      effectClassName: 'effects__preview--sepia',
      effectFilterName: 'sepia',
      effectValueMin: 0,
      effectValueMax: 1,
      effectUnit: ''
    },
    'marvin': {
      effectName: 'marvin',
      effectClassName: 'effects__preview--marvin',
      effectFilterName: 'invert',
      effectValueMin: 0,
      effectValueMax: 100,
      effectUnit: '%'
    },
    'phobos': {
      effectName: 'phobos',
      effectClassName: 'effects__preview--phobos',
      effectFilterName: 'blur',
      effectValueMin: 0,
      effectValueMax: 3,
      effectUnit: 'px'
    },
    'heat': {
      effectName: 'heat',
      effectClassName: 'effects__preview--heat',
      effectFilterName: 'brightness',
      effectValueMin: 1,
      effectValueMax: 3,
      effectUnit: ''
    }
  };

  var imgUploadForm = document.querySelector('.img-upload__form');
  var imgUploadPreview = imgUploadOverlay.querySelector('.img-upload__preview').querySelector('img');
  var previewPictureEffects = document.querySelectorAll('.effects__preview');

  var scaleControlSmaller = document.querySelector('.scale__control--smaller');
  var scaleControlInputValue = document.querySelector('.scale__control--value');
  var scaleControlValue = SCALE_VALUE_DEFAULT;
  var scaleControlBigger = document.querySelector('.scale__control--bigger');

  var effectLevelSlider = imgUploadOverlay.querySelector('.img-upload__effect-level'); // слайдер
  var effectLevelSliderLine = effectLevelSlider.querySelector('.effect-level__line'); // линия перемещания ползунка
  var effectLevelPin = effectLevelSlider.querySelector('.effect-level__pin'); // pin
  var effectLevelLine = effectLevelSlider.querySelector('.effect-level__depth'); // линия глубины эффекта

  var effectLevelSliderLineWidth; // длина линии перемещения ползунка
  var effectLevelLineWidth; // длина линии эффекта

  var effectLevelValue; // значение величины эффекта после изменения положения pin-а
  var effectLevelDepthValue; // значение глубины эффекта

  var effectLevelValueElement = imgUploadOverlay.querySelector('.effect-level__value'); // поле для записи значения эффекта

  var effectList = imgUploadOverlay.querySelector('.effects__list'); // список эффектов
  var effectsRadioButtons = effectList.querySelectorAll('.effects__radio'); // список радио-кнопок для эффектов
  // начальное значение для наименования текущего эффекта
  var currentEffect = {
    effectName: 'none',
    effectClassName: '',
    effectFilterStr: ''
  };

  var getCurrentEffectName = function () {
    return (effectList.querySelector('.effects__radio:checked').value);
  };

  var clearEffect = function () {
    if (currentEffect.effectName !== 'none') {
      imgUploadPreview.classList.remove(currentEffect.effectClassName);
      imgUploadPreview.style.filter = '';
    }
  };

  var textHashtags = imgUploadOverlay.querySelector('.text__hashtags');
  var textHashtagDefaultBorderStyle = textHashtags.style.border;
  var textDescription = imgUploadOverlay.querySelector('.text__description');
  var textDescriptionDefaultBorderStyle = textDescription.style.border;
  var imgUploadOverlaySabmitButtons = imgUploadOverlay.querySelector('#upload-submit');

  // закинем загружаемый файл в превьюшки эффектов
  var renderPreviewImgEffect = function (imageDataURL) {
    previewPictureEffects.forEach(function (it) {
      it.style.backgroundImage = 'url("' + imageDataURL + '")';
    });
  };

  var onImgUploadOverlayPressEsc = function (evt) {
    if ((evt.keyCode === window.util.ESC_KEYCODE) && (document.activeElement !== textHashtags) && (document.activeElement !== textDescription)) {
      resetImgUploadOverlay();
    }
  };

  // после выбора файла (событие change) показываем форму редактирования изображения
  uploadFile.addEventListener('change', function () {
    // проверим, что выбранный файл - картинка
    var file = uploadFile.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (file) {
      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          imgUploadPreview.src = reader.result;
          imgUploadPreview.style.overflow = 'hidden';
          imgUploadPreview.style.objectFit = 'contain';
          imgUploadPreview.style.width = 'auto';
          imgUploadPreview.style.maxWidth = '100%';
          imgUploadPreview.style.height = '100%';

          scaleControlInputValue.value = SCALE_VALUE_DEFAULT + '%';
          scaleControlValue = SCALE_VALUE_DEFAULT;
          imgUploadPreview.style.transform = 'scale(' + (SCALE_VALUE_DEFAULT / 100) + ')';

          renderPreviewImgEffect(imgUploadPreview.src);

          imgUploadOverlay.classList.remove('hidden');

          // закрытие формы редактирования изображения
          document.addEventListener('keydown', onImgUploadOverlayPressEsc);

          effectLevelSliderLineWidth = effectLevelSliderLine.offsetWidth; // длина линии эффекта
          effectLevelLineWidth = effectLevelLine.offsetWidth; // длина линии перемещения ползунка

          // выберем первый элемент (без эффекта) списка эффектов
          effectsRadioButtons[0].checked = true;
          currentEffect = {
            effectName: 'none',
            effectClassName: ''
          };
          effectLevelValue = EFFECT_LEVEL_START * 100;
          effectLevelValueElement.value = effectLevelValue;
          effectLevelDepthValue = 1;
          effectLevelSlider.classList.add('hidden');

          imgUploadOverlayAddEventListeners(); // добавим обработчики по элементам формы
        });

        reader.readAsDataURL(file);
      } else {
        onErrorUpload('Не верный формат файла');
      }
    }
  });

  // обработчик для закрытия окна
  var onImgUploadOverlayButtonCloseClick = function () {
    resetImgUploadOverlay();
  };

  // изменение масштаба
  var setScaleStyles = function () {
    scaleControlInputValue.value = scaleControlValue + '%';
    imgUploadPreview.style.transform = 'scale(' + (scaleControlValue / 100) + ')';
  };
  var onScaleControlSmallerClick = function () {
    if (scaleControlValue > SCALE_VALUE_MIN) {
      scaleControlValue = scaleControlValue - SCALE_STEP;
      setScaleStyles();
    }
  };
  var onScaleControlBiggerClick = function () {
    if (scaleControlValue < SCALE_VALUE_MAX) {
      scaleControlValue = scaleControlValue + SCALE_STEP;
      setScaleStyles();
    }
  };

  // перемещение ползунка на эффектах
  var startXCoord = 0;
  var isPinMove = false;

  var onMouseDown = function (downEvt) {
    downEvt.preventDefault();

    startXCoord = downEvt.clientX;
    isPinMove = true;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    if (isPinMove) {
      var shiftX = startXCoord - moveEvt.clientX;
      startXCoord = moveEvt.clientX;

      var newPinXCood = effectLevelPin.offsetLeft - shiftX;

      // установим ограничение на перемещение pin-а
      if (newPinXCood < 0) {
        newPinXCood = 0;
      } else if (newPinXCood > effectLevelSliderLineWidth) {
        newPinXCood = effectLevelSliderLineWidth;
      } else {
        newPinXCood = effectLevelPin.offsetLeft - shiftX;
      }

      effectLevelPin.style.left = newPinXCood + 'px';
      effectLevelLine.style.width = newPinXCood + 'px';
      effectLevelLineWidth = newPinXCood;

      // расчет глубины эффекта и применение эффекта
      var effect = getCurrentEffectName();
      effectLevelDepthValue = effectLevelLineWidth / effectLevelSliderLineWidth * (Effects[effect].effectValueMax - Effects[effect].effectValueMin);
      imgUploadPreview.style.filter = Effects[effect].effectFilterName + '(' + Effects[effect].effectValueMin + effectLevelDepthValue + Effects[effect].effectUnit + ')';
      imgUploadPreview.style.WebkitFilter = Effects[effect].effectFilterName + '(' + (Effects[effect].effectValueMin + effectLevelDepthValue) + Effects[effect].effectUnit + ')';
    }
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    // расчет значения глубины эффекта
    effectLevelValue = (effectLevelSliderLineWidth > 0) ? effectLevelLineWidth / effectLevelSliderLineWidth * 100 : 0;

    effectLevelValueElement.value = Math.round(effectLevelValue);

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    isPinMove = false;
  };

  // события при переключении эффекта
  var onEffectListChange = function (evt) {
    // переставим pin в начальное положение и скинем значения глубины и величины эффекта до стартовых
    effectLevelPin.style.left = EFFECT_LEVEL_START * effectLevelSliderLineWidth + 'px';
    effectLevelLine.style.width = EFFECT_LEVEL_START * effectLevelSliderLineWidth + 'px';
    effectLevelValue = EFFECT_LEVEL_START;

    // сбросим стиль эффекта
    clearEffect();

    // применим текущий эффект к картинке
    var target = evt.target.closest('.effects__radio');
    if (target.value !== 'none') {
      for (var effect in Effects) {
        if (target.value === Effects[effect].effectName) {
          effectLevelDepthValue = EFFECT_LEVEL_START * (Effects[effect].effectValueMax - Effects[effect].effectValueMin);
          currentEffect = {
            effectName: Effects[effect].effectName,
            effectClassName: Effects[effect].effectClassName,
            effectFilterStr: Effects[effect].effectFilterName + '(' + (Effects[effect].effectValueMin + effectLevelDepthValue) + Effects[effect].effectUnit + ')',
          };
        }
      }
      effectLevelSlider.classList.remove('hidden');
      imgUploadPreview.classList.add(currentEffect.effectClassName);
      imgUploadPreview.style.filter = currentEffect.effectFilterStr;
      imgUploadPreview.style.WebkitFilter = currentEffect.effectFilterStr;
    } else {
      currentEffect = {
        effectName: Effects['none'].effectName,
        effectClassName: Effects['none'].effectClassName,
        effectFilterStr: ''
      };
      effectLevelSlider.classList.add('hidden');
    }

    effectLevelValueElement.value = EFFECT_LEVEL_START * 100;
  };

  // проверка хеш-тегов...
  // проверка на дубли в массиве
  var hasDoubles = function (checkedArray) {
    for (var i = 0; i < checkedArray.length - 1; i++) {
      for (var j = i + 1; j < checkedArray.length; j++) {
        if (checkedArray[i] === checkedArray[j]) {
          return true;
        }
      }
    }
    return false;
  };

  var onTextHashtagsInput = function () {
    textHashtags.setCustomValidity('');
    textHashtags.style.border = textHashtagDefaultBorderStyle;
  };
  var onTextDescriptionInput = function () {
    textDescription.setCustomValidity('');
    textDescription.style.border = textDescriptionDefaultBorderStyle;
  };

  var onImgUploadOverlaySabmitButtonClick = function () {
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
        textHashtags.style.border = '2px solid red';
      } else if (!isHashSimbol) {
        textHashtags.setCustomValidity('Хеш-тег должен начинаться с символа #');
        textHashtags.style.border = '2px solid red';
      } else if (!isOnlyHashSimbol) {
        textHashtags.setCustomValidity('Хеш-тег не может состоять только из одной решетки');
        textHashtags.style.border = '2px solid red';
      } else if (!isOverMaxSimbols) {
        textHashtags.setCustomValidity('Максимальная длина одного хэш-тега не может быть более 20 символов, включая решётку');
        textHashtags.style.border = '2px solid red';
      } else if (hasDoubles(hashtagsArray)) {
        textHashtags.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
        textHashtags.style.border = '2px solid red';
      } else {
        textHashtags.setCustomValidity('');
        textHashtags.style.border = textHashtagDefaultBorderStyle;
      }
    }

    // проверка длины комментария
    if (textDescription.value !== '') {
      if (textDescription.value.length > COMMENT_LENGTH_MAX) {
        textDescription.setCustomValidity('Длина комментария не может составлять больше 140 символов');
        textDescription.style.border = '2px solid red';
      } else {
        textDescription.setCustomValidity('');
        textDescription.style.border = textDescriptionDefaultBorderStyle;
      }
    }

    imgUploadForm.addEventListener('submit', onImgUploadFormSubmit);
  };

  var onImgUploadFormSubmit = function (evt) {
    evt.preventDefault();
    window.upload(new FormData(imgUploadForm), onSuccessUpload, onErrorUpload);
  };

  var imgUploadOverlayAddEventListeners = function () {
    imgUploadOverlayButtonClose.addEventListener('click', onImgUploadOverlayButtonCloseClick);
    scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
    scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
    effectLevelPin.addEventListener('mousedown', onMouseDown);
    effectList.addEventListener('change', onEffectListChange);
    textHashtags.addEventListener('input', onTextHashtagsInput);
    textDescription.addEventListener('input', onTextDescriptionInput);
    imgUploadOverlaySabmitButtons.addEventListener('click', onImgUploadOverlaySabmitButtonClick);
  };

  var imgUploadOverlayRemoveEventListeners = function () {
    imgUploadOverlayButtonClose.removeEventListener('click', onImgUploadOverlayButtonCloseClick);
    scaleControlSmaller.removeEventListener('click', onScaleControlSmallerClick);
    scaleControlBigger.removeEventListener('click', onScaleControlBiggerClick);
    effectLevelPin.removeEventListener('mousedown', onMouseDown);
    effectList.removeEventListener('change', onEffectListChange);
    textHashtags.removeEventListener('input', onTextHashtagsInput);
    textDescription.removeEventListener('input', onTextDescriptionInput);
    imgUploadOverlaySabmitButtons.removeEventListener('click', onImgUploadOverlaySabmitButtonClick);
    imgUploadForm.removeEventListener('submit', onImgUploadFormSubmit);
  };

  var onSuccessUpload = function () {
    resetImgUploadOverlay();
    window.util.renderMessageElement('Изображение успешно загружено', window.util.loadResults['success']);
  };

  var onErrorUpload = function (message) {
    resetImgUploadOverlay();
    window.util.renderMessageElement(message, window.util.loadResults['error']);
  };

  var resetImgUploadOverlay = function () {
    imgUploadForm.reset();

    // сбросим красную рамку и setCustomValidity
    textHashtags.style.border = textHashtagDefaultBorderStyle;
    textHashtags.setCustomValidity('');
    textDescription.style.border = textDescriptionDefaultBorderStyle;
    textDescription.setCustomValidity('');

    // вернем слайдер
    effectLevelSlider.classList.remove('hidden');

    // сбросим стиль эффекта
    clearEffect();

    // выберем первый элемент (без эффекта) списка эффектов
    effectsRadioButtons[0].checked = true;
    currentEffect = {
      effectName: 'none',
      effectClassName: ''
    };

    imgUploadOverlay.classList.add('hidden'); // спрячем окно с фильтрами

    imgUploadOverlayRemoveEventListeners();
    document.removeEventListener('keydown', onImgUploadOverlayPressEsc);
  };
})();
