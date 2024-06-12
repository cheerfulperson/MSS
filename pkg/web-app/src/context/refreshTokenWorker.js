var interval;
self.onmessage = function (e) {
  var expireAt = e.data.expireAt;
  if (expireAt) {
    if (interval) {
      this.clearInterval(interval);
    }
    interval = this.setInterval(function () {
      var refreshDelay = expireAt - Date.now() - 14000;
      var isExpired = refreshDelay < 0;
      self.postMessage(isExpired);
    }, 10000);
  }
};
