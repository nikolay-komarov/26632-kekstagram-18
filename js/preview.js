'use strict';

(function () {
  var COMMENTS_IN_LIST_MAX = 5;
  var COMMENTS_IN_LIST_ZERO = 0;

  var body = document.body;
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCommentsCount;

  var card;

  var newSocialCommentsElements = [];
  var socialElementFragment = document.createDocumentFragment();
  var socialCommentsList = bigPicture.querySelector('.social__comments');
  var socialCommentsElements = bigPicture.querySelectorAll('.social__comment');
  var socialCommentElement = bigPicture.querySelector('.social__comment');

  var socialCommentCount = bigPicture.querySelector('.social__comment-count');
  var commentsLoader = bigPicture.querySelector('.comments-loader');

  var socialFooterText = bigPicture.querySelector('.social__footer-text');

  var currentCommentsCount;

  var onCommentsLoaderClick = function () {
    if (currentCommentsCount < bigPictureCommentsCount) {
      currentCommentsCount = currentCommentsCount + COMMENTS_IN_LIST_MAX;
      if (currentCommentsCount < bigPictureCommentsCount) {
        renderComments(currentCommentsCount - COMMENTS_IN_LIST_MAX, currentCommentsCount, card);
        socialCommentCount.firstChild.data = currentCommentsCount + ' из ';
      } else {
        renderComments(currentCommentsCount - COMMENTS_IN_LIST_MAX, bigPictureCommentsCount, card);
        commentsLoader.classList.add('visually-hidden');
        socialCommentCount.firstChild.data = bigPictureCommentsCount + ' из ';
        commentsLoader.removeEventListener('click', onCommentsLoaderClick);
      }
    }
  };

  var renderComments = function (fromElement, toElement) {
    for (var i = fromElement; i < toElement; i++) {
      newSocialCommentsElements[i] = socialCommentElement.cloneNode(true); // скопируем в новый элемент старый
      newSocialCommentsElements[i].querySelector('img').src = card.comments[i].avatar;
      newSocialCommentsElements[i].querySelector('img').alt = card.comments[i].name;
      newSocialCommentsElements[i].querySelector('.social__text').textContent = card.comments[i].message;

      socialElementFragment.appendChild(newSocialCommentsElements[i]); // добавим элемент в фрагмент
    }
    socialCommentsList.appendChild(socialElementFragment);
  };

  var createBigPicture = function (pictureCard) {
    card = pictureCard;

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

    socialCommentsElements.forEach(function (it) {
      socialCommentsList.removeChild(it);
    });
    newSocialCommentsElements = [];

    bigPicture.classList.remove('hidden');
    socialFooterText.focus();

    commentsLoader.classList.add('visually-hidden');
    socialCommentCount.classList.add('visually-hidden');
    currentCommentsCount = 0;

    if (bigPictureCommentsCount > 0) {
      if (bigPictureCommentsCount <= COMMENTS_IN_LIST_MAX) {
        renderComments(0, bigPictureCommentsCount);
        commentsLoader.classList.add('visually-hidden');
        socialCommentCount.classList.remove('visually-hidden');
        socialCommentCount.firstChild.data = bigPictureCommentsCount + ' из ';
      } else {
        currentCommentsCount = currentCommentsCount + COMMENTS_IN_LIST_MAX;
        renderComments(0, currentCommentsCount);
        commentsLoader.classList.remove('visually-hidden');
        socialCommentCount.classList.remove('visually-hidden');
        socialCommentCount.firstChild.data = currentCommentsCount + ' из ';
        commentsLoader.addEventListener('click', onCommentsLoaderClick);
      }
    }

    // закрытие окна big-picture
    var closeBigPicture = function () {
      socialCommentCount.firstChild.data = COMMENTS_IN_LIST_ZERO + ' из ';
      bigPicture.classList.add('hidden');
      body.classList.remove('modal-open');
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
