import { appHeader } from '../../../component/appHeader/appHeader.js'
const app = getApp()

Page({
  data: {},
  onLoad: function (options) {
    new appHeader()
    console.log(app.globalData.msgData)
  },
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
  },
  search: function(){
    wx.navigateTo({
      url: '../showcase/search/search?searchContent=' + this.data.searchContent + '&entry=home'
    })
  }
})