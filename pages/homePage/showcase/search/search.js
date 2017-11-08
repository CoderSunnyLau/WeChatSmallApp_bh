import { appHeader } from '../../../../component/appHeader/appHeader.js'
const app = getApp()

Page({
  data: {
    tabArr: ['所有商品','订货历史'],
    isSelect: 0
  },
  onLoad: function (options) {
    console.log(options)
    var that = this
    if(options.searchContent != 'undefined'){
      that.setData({
        '_headerData_.inputContent': options.searchContent
      })
    }
    new appHeader()
  },
  inputEvent: function(){
    console.log('商品搜索')
  },
  tabSelect: function(e){
    this.setData({
      isSelect: e.currentTarget.dataset.tidx
    })
  }
})