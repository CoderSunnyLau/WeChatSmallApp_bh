import { appHeader } from '../../../../component/appHeader/appHeader.js'
const app = getApp()
const httpUtil = require('../../../../utils/httpUtil.js')
var _userData

Page({
	data: {
		isSelect: 0,
		hasProduct: false
	},
	onLoad: function (options) {
		var that = this
		_userData = wx.getStorageSync('userData')

		if (options.searchContent == 'undefined') {
			options.searchContent = ''
		}
		console.log(options)
		that.setData({
			'_headerData_.inputContent': options.searchContent,
			searchContent: options.searchContent
		})

		new appHeader()

		if(options.entry == 'home'){
			that.setData({
				tabArr: ['所有商品', '订货历史']
			})
		}
		else{
			that.setData({
				tabArr: ['默认', '销量','人气','筛选']
			})
		}

		that.search()

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
		var _url = '/_shop/' + _userData.storeCode + '/search.shtml?withSkus=true&sv=' + that.data.searchContent
		
		httpUtil.getHttp({
			action: 'VSCommon.urlRequest',
			url: _url,
			start: 0,
			limit: 5
		},function(callback,success){
			if(success){
				//console.log(callback)
				if(callback.success && callback.results.length>0){
					
					let _callbackArr = JSON.parse(JSON.stringify(callback.results))
					let _productArr = []
					for(let i=0;i<_callbackArr.length;i++){						
						let skus = _callbackArr[i].skus
						for(let sku in skus){
							let _productItem = JSON.parse(JSON.stringify(_callbackArr[i]))
							_productItem.productMsg = JSON.parse(JSON.stringify(skus[sku]))
							_productArr.push(_productItem)
						}
					}
					that.setData({
						hasProduct: true,
						productArr: _productArr
					})
				}
				else{
					that.setData({
						hasProduct: false
					})
				}
			}
			else{
				wx.showModal({
					title: '提示',
					content: '网络有误，请检查是否能正常上网',
					showCancel: false
				})
			}
		})
	},
	toDetail: function(e){
		let _productId = e.currentTarget.dataset.productid
		wx.navigateTo({
			url: 'productDetail/productDetail?productId=' + _productId,
		})
	}
})