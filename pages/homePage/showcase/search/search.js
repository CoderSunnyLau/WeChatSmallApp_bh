import { appHeader } from '../../../../component/appHeader/appHeader.js'
const app = getApp()
const httpUtil = require('../../../../utils/httpUtil.js')
var _userData

Page({
	data: {
		tabArr: ['所有商品', '订货历史'],
		isSelect: 0,
		hasProduct: false
	},
	onLoad: function (options) {
		console.log(options)
		var that = this
		_userData = wx.getStorageSync('userData')
		console.log(_userData)

		if (options.searchContent != 'undefined') {
			that.setData({
				'_headerData_.inputContent': options.searchContent
			})
		}
		new appHeader()

		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					tipHeight: res.windowHeight * 2
				})
			},
		})
	},
	inputEvent: function () {
		console.log('商品搜索')
	},
	tabSelect: function (e) {
		this.setData({
			isSelect: e.currentTarget.dataset.tidx
		})

	},
	search: function () {
		//console.log(this.data.searchContent)
		var that = this
		var _url = '/_shop/' + _userData.storeCode +'/search.shtml'
		console.log(_url)
		_url = encodeURI(_url)
		console.log(_url)
		
		httpUtil.getHttp({
			action: 'VSCommon.urlRequest',
			url: decodeURI(_url),
			withSkus: true,
			sv: that.data.searchContent
		},function(callback,success){
			if(success){
				console.log(callback)
			}
		})
	}
})