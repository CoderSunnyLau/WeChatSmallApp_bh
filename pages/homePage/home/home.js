Page({
	data: {},
	onLoad: function (options) {},
	toShopcase: function () {
		wx.switchTab({
			url: '../showcase/showcase'
		})
	},
	toSearch: function (e) {
		wx.navigateTo({
			url: '../showcase/search/search?searchContent=' + e.detail.value + '&entry=home'
		})
	}
})