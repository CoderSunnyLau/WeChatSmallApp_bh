import { appHeader } from '../../../component/appHeader/appHeader.js'
const app = getApp()

Page({
	data: {},
	onLoad: function (options) {},
	onReady: function () {
		new appHeader()
	},
	toShopcase: function () {
		wx.switchTab({
			url: '../showcase/showcase'
		})
	},
	search: function () {
		wx.navigateTo({
			url: '../showcase/search/search?searchContent=' + this.data.searchContent + '&entry=home'
		})
	}
})