'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram';

  window.upload = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === window.util.CodeXHR.SUCCESS) {
        onSuccess(xhr.response);
      } else {
        onError('Произошла ошибка отправки файла');
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка отправки файла');
    });

    xhr.open('POST', URL);
    xhr.send(data);
  };
})();
