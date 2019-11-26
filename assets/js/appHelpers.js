(function (T19) {
  const {
    getCountrySelectOnMouseDown,
    getCountrySelectOnFocus,
    getCountrySelectOnInput,
    getPhoneFormOnSubmit,
    getLoginCodeOnInput,
    getPwFormOnSubmit,
    getChatOnSelect,
    getPhoneOnInput,
    getLoginCodeEditPhoneOnClick,
    getRegistrationFormOnSubmit,
    getChatOnScroll,
    getMessagesOnScroll,
  } = T19.eventHandlers;

  function removeAuth() {
    console.error('remove auth');
    localStorage.removeItem('userAuth');
  }

  function saveAuth(userAuth) {
    localStorage.setItem('userAuth', userAuth);
  }

  function buildCountrySelector(filter = '') {
    const countryOptions = document.querySelector('#phone-form .country-select');
    const countryInput = document.querySelector('#login-country-input');
    const phoneInput = document.querySelector('#phone-form #login-phone-input');
    const countryCodeSelectWrapper = document.querySelector('#country-code-select-wrapper');
    const options = document.createDocumentFragment();
    T19.config.countryCodes.map(({ name, dial_code, code }) => {
      const divNode = document.createElement('div');
      divNode.dialCode = dial_code;
      divNode.countryName = name;
      divNode.className = 'small-black-text country-option';

      const countryCode = code.toLowerCase();

      const flag = document.createElement('img');
      flag.src = `./media/country-icons/${countryCode}.svg`;

      const nameNode = document.createElement('div');
      nameNode.className = 'name-node';
      const spanName = document.createElement('span');
      spanName.className = 'span-name';
      spanName.innerText = name;
      nameNode.appendChild(spanName);

      const spanCode = document.createElement('span');
      spanCode.className = 'span-code small-gray-text';
      spanCode.innerText = dial_code;

      divNode.appendChild(flag);
      divNode.appendChild(nameNode);
      divNode.appendChild(spanCode);

      options.appendChild(divNode);
    });
    countryOptions.appendChild(options);
    countryOptions.addEventListener(
      'mousedown',
      getCountrySelectOnMouseDown(phoneInput, countryInput)
    );
  }

  function initLoginForm(setState, showPage, skipLoadingClosestDC) {
    const phoneForm = document.querySelector('#phone-form');
    const phoneInput = document.querySelector('#phone-form #login-phone-input');
    const countryInput = document.querySelector('#login-country-input');
    const rememberMeGroup = document.querySelector('.remember-me-group');
    const nextGroup = document.querySelector('#login-page .next-group');

    buildCountrySelector();

    const countryOptions = document.querySelectorAll('#phone-form .country-option');

    const countryInputOnFocus = getCountrySelectOnFocus(countryInput);
    countryInput.addEventListener('focus', countryInputOnFocus);

    const countryInputOnInput = getCountrySelectOnInput(countryOptions, phoneInput);
    countryInput.addEventListener('input', countryInputOnInput);

    const phoneInputOnInput = getPhoneOnInput(rememberMeGroup, nextGroup);
    phoneInput.addEventListener('input', phoneInputOnInput);

    if (!skipLoadingClosestDC) {
      T19.api('help.getNearestDc').then(({ country }) => {
        const countryItem = T19.config.countryCodes.find(
          countryItem => countryItem.code === country
        );
        countryInput.value = countryItem.name;
        phoneInput.value = countryItem.dial_code + ' ';
        phoneInput.focus();
      });
    }

    const phoneFormOnSubmit = getPhoneFormOnSubmit(countryOptions, phoneInput, setState, showPage);
    phoneForm.addEventListener('submit', phoneFormOnSubmit);

    return [
      {node: countryInput, cbs: [
        ['focus', countryInputOnFocus],
        ['input', countryInputOnInput]]},
      {node: phoneInput, cbs: [['input', phoneInputOnInput]]},
      {node: phoneForm, cbs: [['submit', phoneFormOnSubmit]]}
    ];
  }

  function initLoginCodeForm(getState, setState, showPage) {
    const codeForm = document.querySelector('#code-form');
    const codeInput = document.querySelector('#code-form #login-code-input');
    const phoneNode = document.querySelector('#code-form #login-code-phone');
    const loginPhoneInput = document.querySelector('#phone-form #login-phone-input');
    const rememberMeGroup = document.querySelector('.remember-me-group');
    const nextGroup = document.querySelector('#login-page .next-group');

    while (phoneNode.firstChild) {
      phoneNode.removeChild(phoneNode.firstChild);
    }

    const phoneNumber = getState('phoneNumber');
    const phoneSpan = document.createElement('span');
    phoneSpan.innerText = '+' + phoneNumber;
    const phoneEditLink = document.createElement('a');
    phoneEditLink.href = '#';
    const phoneEdit = document.createElement('img');
    phoneEdit.className = 'icon';
    phoneEdit.src = `./media/icons/newchat_filled_svg.svg`;
    phoneEditLink.appendChild(phoneEdit);
    phoneNode.appendChild(phoneSpan);
    phoneNode.appendChild(phoneEditLink);

    codeForm.addEventListener('submit', e => e.preventDefault());
    phoneEditLink.addEventListener(
      'click',
      getLoginCodeEditPhoneOnClick(showPage, loginPhoneInput, '+' + phoneNumber,
                                   rememberMeGroup, nextGroup)
    );
    codeInput.addEventListener(
      'input',
      getLoginCodeOnInput(saveAuth, getState, setState, showPage)
    );

    codeInput.focus();
  }

  function initPasswordForm(getState, setState, showPage) {
    function makePasswordHash (salt, password) {
      var passwordUTF8 = unescape(encodeURIComponent(password));

      var buffer = new ArrayBuffer(passwordUTF8.length);
      var byteView = new Uint8Array(buffer);
      for (var i = 0, len = passwordUTF8.length; i < len; i++) {
        byteView[i] = passwordUTF8.charCodeAt(i);
      }

      buffer = bufferConcat(bufferConcat(salt, byteView), salt);

      return sha256HashSync(buffer);
    }
    T19.api('account.getPassword').then(({ current_salt }) => {
      const pwForm = document.querySelector('#login-password-page #password-form');
      pwForm.addEventListener('submit', getPwFormOnSubmit(
        makePasswordHash, current_salt, saveAuth, setState, showPage
      ));
    });
  }

  const chatsMap = {};
  const usersMap = {};
  const channelAccess = {};
  const userAccess = {};
  const usernames = {};

  const peerMap = {};
  window.peerMap = peerMap;

  const chatMap = {};
  window.chatMap = chatMap;

  const userMap = {};
  window.userMap = userMap;

  const lastMessageMap = {};
  window.lastMessageMap = lastMessageMap;

  function getChat(id) {
    return chatsMap[id] || {id: id, deleted: true, access_hash: channelAccess[id]};
  }

  function getUser (id) {
    return usersMap[id] || {id: id, deleted: true, num: 1, access_hash: userAccess[id]};
  }

  function isChannel(id) {
    var chat = chatsMap[id];
    if (chat && (chat._ == 'channel' || chat._ == 'channelForbidden') ||
        channelAccess[id]) {
      return true;
    }
    return false;
  }

  function capitalize(str) {
    return str && (str[0].toUpperCase() + str.substr(1)) || '';
  }

  function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  function createImage(base64) {
    const image = new Image();
    image.src = 'data:image/png;base64,' + base64;
    return image;
  }

  function createDefaultImage(container) {
    const image = new Image();
    image.src = './media/icons/send_svg_white.svg';
    container.appendChild(image);
  }

  const imageFileCache = {};
  function loadImage(location) {
    location._ = 'inputFileLocation';
    return new Promise(function (resolve,  reject) {
      const locationStr = JSON.stringify(location);
      if (imageFileCache[locationStr]) {
        resolve(createImage(imageFileCache[locationStr]));
      } else {
        T19.api('upload.getFile', {
          flags: 0,
          offset: 0,
          limit: 1024 * 1024,
          location,
        }).then((res) => {
          imageFileCache[locationStr] = arrayBufferToBase64(res.bytes);
          resolve(createImage(imageFileCache[locationStr]));
        }).catch(() => {
          reject();
        });
      }
    });
  };



  function handleDialogs(user, dialogsObject) {
    const currentUserId = user.user.id;
    const { chats, dialogs, messages, users } = dialogsObject;

    chats.forEach(chat => {
      chatMap[chat.id] = chat;
    });
    users.forEach(user => {
      userMap[user.id] = user;
    });
    messages.forEach(message => {
      const peer = message.to_id;
      const id = peer.channel_id || peer.chat_id || peer.user_id;
      if (id === currentUserId) {
        lastMessageMap[message.from_id] = message;
      } else {
        lastMessageMap[id] = message;
      }
    });

    const resultMap = {};
    const result = dialogs.map(dialog => {
      const { peer } = dialog;
      const { _ } = dialog.peer;
      const id = peer.channel_id || peer.chat_id || peer.user_id;
      peerMap[id] = peer._;

      const message = lastMessageMap[id];
      const date = message.date;
      const chatItem = {
        id, date, dialog, peer,
      };

      const messageText = (
        message.message ||
          (message.media && message.media.caption) ||
          (message.media && message.media.photo && 'Photo') ||
          (message.media && message.media.video && 'Video') ||
        (message.media && message.media.document && capitalize(message.media.document.mime_type)) ||
        message.action && message.action._ ||
        '').split('\n')[0];

      if (_ === 'peerUser') {
        chatItem.type = 'user';
        chatItem.user = userMap[id];
        chatItem.message = message.from_id === currentUserId ?
                           messageText :
                           '<span class=\'black-text\'>' +
                           chatItem.user.first_name + '</span>: ' + messageText;
        chatItem.title = (chatItem.user.first_name || '') + ' ' + (chatItem.user.last_name || '');
      } else {
        chatItem.type = 'chat';
        chatItem.chat = chatMap[id];
        chatItem.title = chatItem.chat.title;
        chatItem.message = messageText;
      }

      const photo = (chatItem.chat || chatItem.user).photo;
      const location = photo && (photo.photo_small || photo.photo_big || photo.photo);
      if (location) {
        loadImage(location).then((img) => {
          const imageContainer = document.querySelector('#chat-img-container-' + id);
          imageContainer.appendChild(img);
        }).catch(() => {
          const imageContainer = document.querySelector('#chat-img-container-' + id);
          imageContainer.className = 'chat-img-container image-default';
          createDefaultImage(imageContainer);
        });
      } else {
        setTimeout(function () {
          const imageContainer = document.querySelector('#chat-img-container-' + id);
          imageContainer.className = 'chat-img-container image-default';
          createDefaultImage(imageContainer);
        }, 1);
      }

      resultMap[id] = chatItem;
      return chatItem;
    }).sort((a, b) => {
      return a.date > b.date? -1: 1;
    });

    return [result, resultMap];
  }

  function initMain(getState, setState, showPage, user) {
    const chatsListNode = document.querySelector('#chats');
    const messagsContainerNode = document.querySelector('#messages-container');
    chatsListNode.addEventListener('click', getChatOnSelect(user, getState, selectChat));
    chatsListNode.addEventListener('scroll', getChatOnScroll(chatsListNode, loadDialogs));
    messagsContainerNode.addEventListener(
      'scroll', getMessagesOnScroll(user, messagsContainerNode, loadMessages));

    let loading = false;
    let loadedAll = false;
    let offsetDate = Math.round((new Date()).getTime()/1000);
    function loadDialogs() {
      if (loading === true || loadedAll === true) {
        return;
      }
      loading = true;
      T19.api('messages.getDialogs', {
        flags: 0,
        offset_date: offsetDate,
        offset_peer: {_: 'inputPeerEmpty'},
        limit: 20
      }).then((dialogs) => {

        const lastMessage = dialogs.messages[dialogs.messages.length - 1];
        if (lastMessage) {
          offsetDate = lastMessage.date;
        } else {
          loadedAll = true;
        }

        const [chats, chatMap] = handleDialogs(user, dialogs);

        setState('chats', {...getState('chats'), ...chatMap});
        buildChatsList(chats);
      }).finally(() => {
        loading = false;
      });
    }

    loadDialogs();
  }

  function getPrettyDateTime(serverDate) {
    const nowDate = new Date();
    const midnight = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
    const yesterday = new Date(midnight.getTime() - 1000*60*60*24);
    const newyear = new Date(nowDate.getFullYear(), 1, 1);

    const messageDate = new Date(parseInt(serverDate + '000', 10));
    if (messageDate.getTime() > midnight.getTime()) {
      const minutes = messageDate.getMinutes();
      const minutesStr = minutes < 10? '0' + minutes : minutes;
      return messageDate.getHours() + ':' + minutesStr;
    } else if (messageDate.getTime() > yesterday.getTime()) {
      return 'Yesterday';
    } else if (messageDate.getTime() > newyear.getTime()) {
      return messageDate.getDate() + '/' + messageDate.getMonth();
    } else {
      return messageDate.getDate() + '/' +
        messageDate.getMonth() + '/' +
        messageDate.getFullYear();
    }
  }

  const fileCache = {};
  function buildChatsList(chats) {
    const chatsListNode = document.querySelector('#chats');
    const container = document.createDocumentFragment();
    chats.map((chat) => {
      const { id, date, title, message } = chat;

      const chatNode = document.createElement('div');
      chatNode.className = 'chat-element';
      chatNode.id = 'chat-element-' + id;
      chatNode.chatId = id;

      const imgContainer = document.createElement('div');
      imgContainer.className = 'chat-img-container';
      imgContainer.id = 'chat-img-container-' + id;

      const dateContainer = document.createElement('div');
      dateContainer.className = 'chat-date';
      dateContainer.innerText = getPrettyDateTime(date);

      const textContainer = document.createElement('div');
      textContainer.className = 'chat-text';
      const nameNode = document.createElement('span');
      nameNode.className = 'chat-title';
      nameNode.innerText = title;
      textContainer.appendChild(nameNode);
      const messageNode = document.createElement('span');
      messageNode.className = 'chat-last-message';
      messageNode.innerHTML = message;
      textContainer.appendChild(messageNode);

      chatNode.appendChild(imgContainer);
      chatNode.appendChild(textContainer);
      chatNode.appendChild(dateContainer);

      container.appendChild(chatNode);
    });
    chatsListNode.appendChild(container);
  }

  function getInputPeer(chat) {
    const { dialog } = chat;
    const { peer } = dialog;
    if (peer._ === 'peerUser') {
      return {
        _: 'inputPeerUser',
        user_id: chat.user.id,
        access_hash: chat.user.access_hash,
      };
    } else if (peer._ === 'peerChannel') {
      return {
        _: 'inputPeerChannel',
        access_hash: chat.chat.access_hash,
        channel_id: chat.id,
      };
    } else {
      return {
        _: 'inputPeerChat',
        chat_id: chat.id,
      };
    }
  };

  let lastPeer, lastChat;
  let messageOffsetDate;
  let messagesLoading = false;
  let messagesLoadedAll = false;
  let doInitialFor;
  let attachmentsLoading = false;
  function loadMessages(user) {
    if (attachmentsLoading === true || messagesLoading === true || messagesLoadedAll === true) {
      return;
    }
    messagesLoading = true;
    T19.api('messages.getHistory', {
      peer: lastPeer,
      offset_date: messageOffsetDate,
      offset_peer: {_: 'inputPeerEmpty'},
      limit: 30,
    }).then(({ messages, users }) => {
      if (messages.length === 0) {
        messagesLoadedAll = true;
      } else {
        messageOffsetDate = messages[messages.length - 1].date - 1;

        buildMessagesList(user, messages, users.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {}));
      }
    }).finally(() => {
      messagesLoading = false;
    });
  }

  function selectChat(user, chat) {
    messageOffsetDate = Math.round((new Date()).getTime()/1000);
    lastPeer = getInputPeer(chat);
    lastChat = chat;
    doInitialFor = lastPeer;
    messagesLoadedAll = false;

    loadMessages(user);
  }

  function buildMessagesList(currentUser, messages, users, clear) {
    const messagesContainerNode = document.querySelector('#messages-container');
    const shouldShowIcons = lastChat && (
      (lastChat.peer.peer && lastChat.peer._ === 'peerChat') ||
        (lastChat.chat && lastChat.chat.pFlags && lastChat.chat.pFlags.megagroup));
    let initialScrollTop = messagesContainerNode.scrollTop;
    let initialScrollHeight = messagesContainerNode.scrollHeight;
    const messagesListNode = document.querySelector('#messages');
    if (doInitialFor === lastPeer) {
      messagesListNode.innerHTML = '';
    }
    const attachmentsLoadingPromises = [];
    const container = document.createDocumentFragment();
    [...messages].reverse().map((messageObj) => {
      const { id, date, from_id, message } = messageObj;

      const messageNodeWrapper = document.createElement('div');
      messageNodeWrapper.className = 'message-element-wrapper';

      if (shouldShowIcons) {
        const messageIcon = document.createElement('div');
        messageIcon.className = 'message-icon';
        messageNodeWrapper.appendChild(messageIcon);

        const user = users[from_id];
        messageIcon.title = user.first_name + ' ' + user.last_name;
        if (user && user.photo) {
          const photo = user.photo;
          const location = photo && (photo.photo_small || photo.photo_big || photo.photo);
          if (location) {
            loadImage(location).then((img) => {
              messageIcon.appendChild(img);
            }).catch(() => {
              messageIcon.className = 'message-icon-default';
              createDefaultImage(messageIcon);
            });
          } else {
            messageIcon.className = 'message-icon-default';
            createDefaultImage(messageIcon);
          }
        } else {
          messageIcon.className = 'message-icon-default';
          createDefaultImage(messageIcon);
        }
      }

      const messageArrow = document.createElement('div');
      messageArrow.className = 'message-arrow';
      messageNodeWrapper.appendChild(messageArrow);
      const messageArrowHider = document.createElement('div');
      messageArrowHider.className = 'message-arrow-hider';
      messageNodeWrapper.appendChild(messageArrowHider);

      const messageNode = document.createElement('div');
      messageNode.className = 'message-element';
      if (currentUser.user.id === from_id) {
        messageNodeWrapper.classList.add('my-message');
      }

      const messageDate = document.createElement('div');
      messageDate.className = 'message-date';
      messageDate.innerText = getPrettyDateTime(date);
      messageNode.appendChild(messageDate);

      let messageText = message;

      const attachmentLocation = (
        messageObj.document && messageObj.document.thumb &&
        messageObj.document.thumb.location
      ) || (messageObj.media && messageObj.media.photo && messageObj.media.photo.sizes &&
            messageObj.media.photo.sizes[messageObj.media.photo.sizes.length - 1] &&
            messageObj.media.photo.sizes[messageObj.media.photo.sizes.length - 1].location);
      if (attachmentLocation) {
        attachmentsLoading = true;

        if (messageObj.media.caption) {
          messageNodeWrapper.className += ' message-attachment-has-caption';
          messageText = messageObj.media.caption;
        }
        messageNodeWrapper.className += ' message-attachment-wrapper';

        const messageAttachment = document.createElement('div');
        messageAttachment.className = 'message-attachment';
        messageNode.appendChild(messageAttachment);

        const location = attachmentLocation;
        const loadAttachmentPromise = loadImage(attachmentLocation);
        attachmentsLoadingPromises.push(loadAttachmentPromise);
        loadAttachmentPromise.then((img) => {
          messageAttachment.appendChild(img);
        }).catch(() => {
          messageAttachment.className = 'attachment-default';
          createDefaultImage(messageAttachment);
        }).finally(() => {
          setTimeout(function () {
            const newScrollHeight = messagesContainerNode.scrollHeight;
            messagesContainerNode.scrollTop = initialScrollTop + newScrollHeight - initialScrollHeight;
          }, 1);
        });
      } else if (!message) {
        return;
      }


      // if (users[from_id]) {
      //   const nameNode = document.createElement('span');
      //   nameNode.innerText = users[from_id].first_name + ' ' + users[from_id].last_name;
      //   messageNode.appendChild(nameNode);
      // }

      if (messageText) {
        const messageTextNode = document.createElement('span');
        messageTextNode.className = 'message-text';
        messageTextNode.innerText = messageText;
        messageNode.appendChild(messageTextNode);

        const messageTextPlaceForDate = document.createElement('div');
        messageTextPlaceForDate.className = 'message-text-after';
        messageTextPlaceForDate.innerText = ' ';
        messageNode.appendChild(messageTextPlaceForDate);
      }

      if (attachmentLocation && !messageText) {
        messageNode.classList.add('message-attachment-with-no-text');
      }

      messageNodeWrapper.appendChild(messageNode);
      container.appendChild(messageNodeWrapper);
    });

    Promise.all(attachmentsLoadingPromises).finally(() => {
      attachmentsLoading = false;
    });

    if (doInitialFor === lastPeer) {
      doInitialFor = null;
      setTimeout(function () {
        messagesContainerNode.scrollTop = 99999999;
      }, 1);
    } else {
      //const prevScrollHeight = messagesContainerNode.scrollHeight;
      // setTimeout(function () {
      //   const newScrollHeight = messagesContainerNode.scrollHeight;
      //   messagesContainerNode.scrollTop += newScrollHeight - prevScrollHeight;
      // }, 1);
    }
    messagesListNode.insertBefore(container, messagesListNode.firstChild);
  }

  function initRegistrationPage(getState, setState, showPage) {
    const registrationForm = document.querySelector('#registration-form');
    const firstNameNode = document.querySelector('#registration-form-first-name');
    const lastNameNode = document.querySelector('#registration-form-last-name');
    registrationForm.addEventListener('submit', getRegistrationFormOnSubmit(
      firstNameNode, lastNameNode, getState, setState, saveAuth, showPage
    ));
  }

  T19.appHelpers = {
    initLoginForm,
    initLoginCodeForm,
    initPasswordForm,
    buildChatsList,
    selectChat,
    initMain,
    removeAuth,
    saveAuth,
    initRegistrationPage,
  };

})(window.T19);
