'use strict';

(function () {
  window.picture = {
    createElement: function (template, cardData) {
      var newElement = template.cloneNode(true);
      newElement.querySelector('.picture__img').src = cardData.url;
      newElement.querySelector('.picture__img').alt = cardData.description;
      newElement.querySelector('.picture__comments').textContent = cardData.comments.length;
      newElement.querySelector('.picture__likes').textContent = cardData.likes;

      return newElement;
    }
  };
})();
