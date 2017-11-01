Page({
  data: {},
  onLoad: function (options) {},
  toShopcase: function(){
    wx.switchTab({
      url: '../showcase/showcase'
    })
  },
  scanBill: function(){
    wx.scanCode({
      success: function(){
        console.log('success')
      }
    })
  }
})