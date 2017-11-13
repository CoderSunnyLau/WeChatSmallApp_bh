App({
  onLaunch: function () {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    domainName: 'http://www.ry600.com',
    userInfo: null,
    version: '0.0.28'
  }
})