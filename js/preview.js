'use strict';

(function () {
  var createBigPicture = function (card) {
    // покажем элемент big-picture и заполним его
    var bigPicture = document.querySelector('.big-picture');
    var bigPictureCommentsCount = card.comments.length;

    bigPicture.querySelector('.big-picture__img').querySelector('img').src = card.url;
    bigPicture.querySelector('.big-picture__img').querySelector('img').alt = card.description;
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
      if (evt.keyCode === window.util.ESC_KEYCODE) {
        bigPicture.classList.add('hidden');
      }
    });
  };

  window.preview = {
    createBigPicture: createBigPicture
  };
})();
