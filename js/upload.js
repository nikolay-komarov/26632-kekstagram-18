'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram';

  window.upload = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var errorMsg;
      switch (xhr.status) {
        case 200:
          onSuccess(xhr.response);
          break;
        default:
          errorMsg = 'Произошла ошибка отправки файла';
      }

      if (errorMsg) {
        onError(errorMsg);
      }
    });

    xhr.open('POST', URL);
    xhr.send(data);
  };
})();
