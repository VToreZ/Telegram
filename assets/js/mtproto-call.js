(function (T19) {
  if (!T19) {
    throw new Error('No T19 object in global scope.');
  }

  function apiCall(method, data) {
    if (Object.keys(data || {}).length > 0) {
      data.api_hash = T19.config.api_hash;
      data.api_id = T19.config.api_id;
    }
    return T19.mtp.authorize().then(() => {
      return T19.mtp.apiCall(method, data);
    });

    // if (methods instanceof Array) {
    //   return T19.mtp.authorize().then(() => {
    //     data.forEach(dataItem => {
    //       if (dataItem) {
    //         dataItem.api_hash = T19.config.api_hash;
    //         dataItem.api_id = T19.config.api_id;
    //       }
    //     });
    //     return T19.mtp.apiCalls(methods, data);
    //   });
    // } else {
    //   if (Object.keys(data || {}).length > 0) {
    //     data.api_hash = T19.config.api_hash;
    //     data.api_id = T19.config.api_id;
    //   }
    //   return T19.mtp.authorize().then(() => {
    //     return T19.mtp.apiCall(methods, data);
    //   });
    // }
  }

  T19.api = apiCall;
})(window.T19);
