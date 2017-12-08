Page({
	data: {},
	onLoad: function (options) {},
	toShopcase: function () {
		wx.switchTab({
			url: '../showcase/showcase'
		})
	},
	scanTo: function(e){
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
			url: '../showcase/search/search?searchContent=' + '' + '&type=quickBill'
		})
	}
})