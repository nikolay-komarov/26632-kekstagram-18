'use strict';

(function () {
  var COMMENTS_IN_LIST_MAX = 5;

  var body = document.querySelector('body');
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCommentsCount;

  var newSocialCommentsElements = [];
  var socialElementFragment = document.createDocumentFragment();
  var socialCommentsList = bigPicture.querySelector('.social__comments');
  var socialCommentsElements = bigPicture.querySelectorAll('.social__comment');

  var socialCommentCount = bigPicture.querySelector('.social__comment-count');
  var commentsLoader = bigPicture.querySelector('.comments-loader');

  var currentCommentsCount;

  var onCommentsLoaderClick = function (card) {
    currentCommentsCount = currentCommentsCount + COMMENTS_IN_LIST_MAX;
    if (currentCommentsCount <= bigPictureCommentsCount) {
      renderComments(currentCommentsCount - COMMENTS_IN_LIST_MAX, currentCommentsCount, card);
    } else {
      renderComments(currentCommentsCount - COMMENTS_IN_LIST_MAX, bigPictureCommentsCount, card);
      commentsLoader.classList.add('visually-hidden');
      socialCommentCount.classList.add('visually-hidden');
    }
  };

  var renderComments = function (fromElement, toElement, card) {
    for (var i = fromElement; i < toElement; i++) {
      newSocialCommentsElements[i] = socialCommentsElements[0].cloneNode(true); // скопируем в новый элемент старый
      newSocialCommentsElements[i].querySelector('img').src = card.comments[i].avatar;
      newSocialCommentsElements[i].querySelector('img').alt = card.comments[i].name;
      newSocialCommentsElements[i].querySelector('.social__text').textContent = card.comments[i].message;

      socialElementFragment.appendChild(newSocialCommentsElements[i]); // добавим элемент в фрагмент
    }
    socialCommentsList.appendChild(socialElementFragment);
  };

  var createBigPicture = function (card) {
    currentCommentsCount = 0;

    body.classList.add('modal-open');

    // заполним элемент big-picture и покажем его
    bigPictureCommentsCount = card.comments.length;
    bigPicture.querySelector('.big-picture__img').querySelector('img').src = card.url;
    bigPicture.querySelector('.big-picture__img').querySelector('img').alt = card.description;
    bigPicture.querySelector('.likes-count').textContent = card.likes;
    bigPicture.querySelector('.comments-count').textContent = bigPictureCommentsCount;
    bigPicture.querySelector('.social__caption').textContent = card.description;

    socialCommentsList = bigPicture.querySelector('.social__comments');
    socialCommentsElements = bigPicture.querySelectorAll('.social__comment');
    for (var i = 0; i < socialCommentsElements.length; i++) {
      socialCommentsList.removeChild(socialCommentsElements[i]); // удалим старые элементы
    }

    bigPicture.classList.remove('hidden');

    commentsLoader.classList.remove('visually-hidden');
    socialCommentCount.classList.remove('visually-hidden');

    renderComments(0, COMMENTS_IN_LIST_MAX, card);
    if (bigPictureCommentsCount <= COMMENTS_IN_LIST_MAX) {
      commentsLoader.classList.add('visually-hidden');
      socialCommentCount.classList.add('visually-hidden');
    } else {
      currentCommentsCount = currentCommentsCount + COMMENTS_IN_LIST_MAX;
    }

    // eslint-disable-next-line no-invalid-this
    onCommentsLoaderClick = onCommentsLoaderClick.bind(this, card);

    commentsLoader.addEventListener('click', onCommentsLoaderClick);

    // закрытие окна big-picture
    var closeBigPicture = function () {
      bigPicture.classList.add('hidden');
      body.classList.remove('modal-open');
      commentsLoader.removeEventListener('click', onCommentsLoaderClick);
    };

    var bigPictureCloseButton = bigPicture.querySelector('#picture-cancel');
    bigPictureCloseButton.addEventListener('click', function () {
      closeBigPicture();
    });
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.util.ESC_KEYCODE) {
        closeBigPicture();
      }
    });
  };

  window.preview = {
    createBigPicture: createBigPicture
  };
})();
