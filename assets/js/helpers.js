(function (T19) {
  const exports = {};
  const http = {
    post(url, data, opts) {
      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        Object.keys(opts).forEach(key => request[key] = opts[key]);
        request.addEventListener('load', function () {
          resolve({data: this.response});
        });
        request.addEventListener('error', (e) => {
          reject(e);
        });
        request.open('POST', url);
        request.setRequestHeader('Content-Type', '');
        request.setRequestHeader('Accept', '*/*');
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            if(request.status !== 200) {
              //reject(new Error(`API request error ${request.status}`));
              reject(`API request error ${request.status}`);
            }
          }
        }
        request.send(data);
      });
    }
  };

  function getInputPeerByID(peerID) {
    if (!peerID) {
      return {_: 'inputPeerEmpty'};
    }
    if (peerID < 0) {
      var chatID = -peerID;
      if (!isChannel(chatID)) {
        return {
          _: 'inputPeerChat',
          chat_id: chatID
        };
      } else {
        return {
          _: 'inputPeerChannel',
          channel_id: chatID,
          access_hash: getChat(chatID).access_hash || 0
        };
      }
    }
    return {
      _: 'inputPeerUser',
      user_id: peerID,
      access_hash: getUser(peerID).access_hash || 0
    };
  }

  exports.http = http;

  T19.helpers = exports;
})(window.T19);
