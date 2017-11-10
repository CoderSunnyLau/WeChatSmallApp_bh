import { appHeader } from '../../../component/appHeader/appHeader.js'
const httpUtil = require('../../../utils/httpUtil.js')
var _userData
var showcaseArr

Page({
  data: {
    isSelect: 0,
    leftNavArr: ['西药', '食品', '中成药', '医疗器械', '生物制药', '化妆品', '重要饮品', '日用品'],
    rightNavArr: ['感冒发热', '咳嗽痰喘', '抗生素', '心脑血管', '糖尿病', '消化道', '妇科', '泌尿生殖', '抗过敏',
      '抗病毒', '耳鼻口腔', '肝胆', '维生素矿物质', '眼科', '皮肤组织', '抗肿瘤', '中枢神经', '内分泌', '其他']
  },
  onLoad: function (options) {
    new appHeader()
    _userData = wx.getStorageSync('userData')
    var that = this

    httpUtil.getHttp({
      action: 'VSPubSelect.getShowcases',
      orgId: _userData.orgId,
      bizCenterId: _userData.bizCenterId
    }, function (callback, success) {
      if (success) {
        if (callback.success) {
          showcaseArr = callback.results[0].children
          let _leftArr = [], _rightArr = []
          for (let i = 0; i < showcaseArr.length; i++) {
            _leftArr.push(showcaseArr[i].showcaseName)
          }
          for (let i = 0; i < showcaseArr[0].children.length; i++) {
            _rightArr.push(showcaseArr[0].children[i].showcaseName)
          }
          that.setData({
            leftNavArr: _leftArr,
            navTitle: _leftArr[0],
            rightNavArr: _rightArr
          })
        }
      }

    })
  },
  selectItem: function (e) {
    let _showcaseArr = showcaseArr[e.currentTarget.dataset.idx]
    let _rightArr = []
    for(let i=0;i<_showcaseArr.children.length;i++){
      _rightArr.push(_showcaseArr.childrenArr[i].show)
    }

    this.setData({
      isSelect: e.currentTarget.dataset.idx
    })
  },
  search: function () {
    wx.navigateTo({
      url: '../showcase/search/search?searchContent=' + this.data.searchContent + '&entry=showcase'
    })
  }
})