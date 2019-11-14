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

  var getCurrentEffectName = function () {
    var checkedElement;
    effectsRadioButtons.forEach(function (it) {
      if (it.checked) {
        checkedElement = it;
      }
    });
    return checkedElement.value;
  };

  var claearEffect = function () {
    if (currentEffect.effectName !== 'none') {
      imgUploadPreview.removeAttribute('class');
      imgUploadPreview.style.filter = '';
    }
  };

  var effectList = imgUploadOverlay.querySelector('.effects__list'); // список эффектов
  var effectsRadioButtons = effectList.querySelectorAll('.effects__radio'); // список радио-кнопок для эффектов
  // начальное значение для наименования текущего эффекта
  var currentEffect = {
    effectName: 'none',
    effectClassName: '',
    effectFilterStr: ''
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

          effectLevelSliderLineWidth = effectLevelSliderLine.offsetWidth; // длина линии эффекта
          effectLevelLineWidth = effectLevelLine.offsetWidth; // длина линии перемещения ползунка

          // выберем первый элемент (без эффекта) списка эффектов
          effectsRadioButtons[0].checked = true;
          currentEffect = {
            effectName: 'none',
            effectClassName: ''
          };
          effectLevelValue = 100;
          effectLevelValueElement.setAttribute('value', effectLevelValue);
          effectLevelDepthValue = 1;
          effectLevelSlider.classList.add('hidden');
        });

        reader.readAsDataURL(file);
      } else {
        onErrorUpload('Не верный формат файла');
      }
    }
  });

  // закрытие формы редактирования изображения
  document.addEventListener('keydown', function (evt) {
    if ((evt.keyCode === window.util.ESC_KEYCODE) && (document.activeElement !== textHashtags) && (document.activeElement !== textDescription)) {
      resetImgUploadOverlay();
    }
  });
  imgUploadOverlayButtonClose.addEventListener('click', function () {
    resetImgUploadOverlay();
  });

  var resetImgUploadOverlay = function () {
    imgUploadForm.reset();

    // вернем слайдер
    effectLevelSlider.classList.remove('hidden');

    // сбросим стиль эффекта
    claearEffect();

    // выберем первый элемент (без эффекта) списка эффектов
    effectsRadioButtons[0].checked = true;
    currentEffect = {
      effectName: 'none',
      effectClassName: ''
    };

    imgUploadOverlay.classList.add('hidden'); // спрячем окно с фильтрами
  };

  // изменение масштаба
  scaleControlSmaller.addEventListener('click', function () {
    if (scaleControlValue > SCALE_VALUE_MIN) {
      scaleControlValue = scaleControlValue - 25;
      scaleControlInputValue.value = scaleControlValue + '%';
      scaleControlInputValue.setAttribute('value', scaleControlValue + '%');
      imgUploadPreview.style.transform = 'scale(' + (scaleControlValue / 100) + ')';
    }
  });

  scaleControlBigger.addEventListener('click', function () {
    if (scaleControlValue < SCALE_VALUE_MAX) {
      scaleControlValue = scaleControlValue + 25;
      scaleControlInputValue.value = scaleControlValue + '%';
      scaleControlInputValue.setAttribute('value', scaleControlValue + '%');
      imgUploadPreview.style.transform = 'scale(' + (scaleControlValue / 100) + ')';
    }
  });

  // перемещение ползунка на эффектах
  var startXCoord = 0;
  var isPinMove = false;

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
      for (var effect in Effects) {
        if (getCurrentEffectName() === Effects[effect].effectName) {
          effectLevelDepthValue = effectLevelLineWidth / effectLevelSliderLineWidth * (Effects[effect].effectValueMax - Effects[effect].effectValueMin);
          imgUploadPreview.style.filter = Effects[effect].effectFilterName + '(' + Effects[effect].effectValueMin + effectLevelDepthValue + Effects[effect].effectUnit + ')';
          imgUploadPreview.style.WebkitFilter = Effects[effect].effectFilterName + '(' + (Effects[effect].effectValueMin + effectLevelDepthValue) + Effects[effect].effectUnit + ')';
        }
      }
    }
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    // расчет значения глубины эффекта
    if (effectLevelSliderLineWidth > 0) {
      effectLevelValue = effectLevelLineWidth / effectLevelSliderLineWidth * 100;
    } else {
      effectLevelValue = 0;
    }
    effectLevelValueElement.setAttribute('value', effectLevelValue);
    effectLevelValueElement.value = effectLevelValue;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    isPinMove = false;
  };

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    startXCoord = evt.clientX;
    isPinMove = true;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // события при переключении эффекта
  effectList.addEventListener('change', function (evt) {
    // переставим pin в начальное положение и скинем значения глубины и величины эффекта до стартовых
    effectLevelPin.style.left = EFFECT_LEVEL_START * effectLevelSliderLineWidth + 'px';
    effectLevelLine.style.width = EFFECT_LEVEL_START * effectLevelSliderLineWidth + 'px';
    effectLevelValue = EFFECT_LEVEL_START;

    // сбросим стиль эффекта
    claearEffect();

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

    effectLevelValueElement.setAttribute('value', EFFECT_LEVEL_START * 100);
    effectLevelValueElement.value = effectLevelValue;
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
    textHashtags.style.border = textHashtagDefaultBorderStyle;
  });

  textDescription.addEventListener('input', function () {
    textDescription.setCustomValidity('');
    textDescription.style.border = textDescriptionDefaultBorderStyle;
  });

  var main = document.querySelector('main');

  var onSuccessUpload = function () {
    resetImgUploadOverlay();

    var fragment = document.createDocumentFragment();
    var template = document.querySelector('#success').content;
    var successElementFragment = template.cloneNode(true);
    fragment.appendChild(successElementFragment);
    main.appendChild(fragment);

    var successElement = main.querySelector('.success');
    var successElementButton = successElement.querySelector('.success__button');

    var onSuccessElementPressEsc = function (evtUpload) {
      if (evtUpload.keyCode === window.util.ESC_KEYCODE) {
        removeSuccessElement();
      }
    };

    successElement.addEventListener('click', function () {
      removeSuccessElement();
    });

    document.addEventListener('keydown', onSuccessElementPressEsc);

    successElementButton.addEventListener('click', function () {
      removeSuccessElement();
    });

    var removeSuccessElement = function () {
      successElement.remove();
      document.removeEventListener('keydown', onSuccessElementPressEsc);
    };
  };

  var onErrorUpload = function (message) {
    resetImgUploadOverlay();

    var fragment = document.createDocumentFragment();
    var template = document.querySelector('#error').content;
    var errorElementFragment = template.cloneNode(true);
    errorElementFragment.querySelector('.error__title').textContent = message;
    fragment.appendChild(errorElementFragment);
    main.appendChild(fragment);

    var errorElement = main.querySelector('.error');
    var errorElementButtons = errorElement.querySelectorAll('.error__button');

    var onErrorElementPressEsc = function (evtUpload) {
      if (evtUpload.keyCode === window.util.ESC_KEYCODE) {
        removeErrorElement();
      }
    };

    errorElement.addEventListener('click', function () {
      removeErrorElement();
    });

    document.addEventListener('keydown', onErrorElementPressEsc);

    errorElementButtons.forEach(function (it) {
      it.addEventListener('click', function () {
        removeErrorElement();
      });
    });

    var removeErrorElement = function () {
      errorElement.remove();
      document.removeEventListener('keydown', onErrorElementPressEsc);
    };
  };

  imgUploadOverlaySabmitButtons.addEventListener('click', function () {
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
  });

  imgUploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.upload(new FormData(imgUploadForm), onSuccessUpload, onErrorUpload);
  });
})();
