const httpUtil = require('../../../utils/httpUtil.js')
var _userData
var _showcaseArr

Page({
  data: {
    isDrop: false,
		showItem: false
  },
  onLoad: function (options) {
    _userData = wx.getStorageSync('userData')
		_showcaseArr = []
    let that = this
		
		httpUtil.getHttp({
			action: 'VSPubSelect.getShowcases',
			orgId: _userData.storeOrgId,
			bizCenterId: _userData.bizCenterId
		},
		function(callback,success){
			if(success){
				//console.log(callback)
				if(callback.success){
					var callbackArr = callback.results[0].children
					console.log(callbackArr)
					that.setData({
						firstArr: callbackArr
					})
				}
			}
		})
  },
	dropItem: function (e) {
		let that = this
		that.setData({
			isSelect: e.currentTarget.dataset.idx,
			isDrop: !that.data.isDrop
		})
  },
  toSearch: function (e) {
    wx.navigateTo({
      url: '../showcase/search/search?searchContent=' + e.detail.value + '&entry=showcase'
    })
  }
})