Page({
	data: {},
	onLoad: function (options) {},
	toShopcase: function () {
		wx.switchTab({
			url: '../showcase/showcase'
		})
	},
	scanTo: function (e) {
		wx.navigateTo({
			url: '../showcase/search/search?searchContent=' + e.detail.result + '&type=quickBill'
		})
	},
	searchTo: function (e) {
		wx.navigateTo({
			url: '../showcase/search/search?searchContent=' + e.detail.searchContent + '&type=quickBill'
		})
	},
	quickBill: function () {
		wx.navigateTo({
			url: '../showcase/search/search?searchContent=&type=quickBill'
		})
	},
	onReady: function () {
		var _userData = wx.getStorageSync('userData')
		for (var i = 0; i < _userData.storesArr.length; i++) {
			if (_userData.storeOrgId == _userData.storesArr[i].storeOrgId) {
				break;
			}
		}
		if (i >= _userData.storesArr.length) {
			wx.reLaunch({
				url: '/pages/noCooperate/noCooperate',
			})
		}
	},
	scanBill: function(){
		wx.scanCode({
			success: function(res){
				wx.navigateTo({
					url: '../showcase/search/search?searchContent=' + res.result + '&type=quickBill'
				})
			}
		})
	}
})