App({
  onLaunch: function () {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    // domainName: 'http://www.ry600.com',
    domainName: 'http://bh.eheres.org',
    userInfo: null,
    version: '0.0.37'
  }
})