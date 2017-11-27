const app = getApp()
const httpUtil = require('../../../../utils/httpUtil.js')
var _userData

Page({
	data: {
		isSelect: 0,
		hasProduct: undefined
	},
	onLoad: function (options) {
		var that = this
		_userData = wx.getStorageSync('userData')
		//console.log(_userData)

		if (options.searchContent == 'undefined') {
			options.searchContent = ''
		}
		that.setData({
			searchContent: options.searchContent
		})

		if(options.entry == 'home'){
			that.setData({
				tabArr: ['所有商品', '订货历史']
			})
			wx.setNavigationBarTitle({
				title: '快速下单'
			})
		}
		else{
			that.setData({
				tabArr: ['默认', '销量','人气','筛选']
			})
			wx.setNavigationBarTitle({
				title: '商品分类'
			})
		}

		that.getProduct()

	},
	getProduct: function () {
		var that = this
		var _url = '/_shop/' + _userData.storeCode + '/search.shtml?withSkus=true&sv=' + that.data.searchContent

		wx.showLoading();
		httpUtil.getHttp({
			action: 'VSCommon.urlRequest',
			url: _url,
			start: 0,
			limit: 5
		}, function (callback, success) {
			if (success) {
				console.log(callback)
				let _productArr = []
				if (callback.success && callback.results.length > 0) {

					let _callbackArr = JSON.parse(JSON.stringify(callback.results))
					for (let i = 0; i < _callbackArr.length; i++) {
						let skus = _callbackArr[i].skus
						for (let sku in skus) {
							let _productItem = JSON.parse(JSON.stringify(_callbackArr[i]))
							_productItem.productMsg = JSON.parse(JSON.stringify(skus[sku]))
							_productItem.shopcartAmount = 1
							_productArr.push(_productItem)
						}
					}
					that.setData({
						hasProduct: true,
						productArr: _productArr
					})
				}
				else {
					that.setData({
						hasProduct: false
					})
				}
				wx.hideLoading();
			}
			else {
				wx.showModal({
					title: '提示',
					content: '网络有误，请检查是否能正常上网',
					showCancel: false
				})
			}
		})
	},
	tabSelect: function (e) {
		this.setData({
			isSelect: e.currentTarget.dataset.tidx
		})

	},
	searchPro: function (e) {
		this.setData({
			searchContent: e.detail.value
		})
		this.getProduct()
	},
	toDetail: function(e){
		let _productId = e.currentTarget.dataset.productid
		wx.navigateTo({
			url: 'productDetail/productDetail?productId=' + _productId,
		})
	},
	amountSave: function(e){
		var that = this
		if(e.detail.value >= 1){
			that.data.productArr[e.currentTarget.dataset.index].shopcartAmount = parseInt(e.detail.value)
		}
	},
	addToShopcart: function(e){
		var paramer = this.data.productArr[e.currentTarget.dataset.index]

		if(paramer.productMsg.stockTag.amount >= paramer.shopcartAmount){
			if (paramer.shopcartAmount % paramer.productMsg.modCount == 0) {
				httpUtil.getHttp({
					action: 'VSShop.addProduct',
					widthReward: false,
					orderType: 'normal',
					cartProductDS: '{"records":[{"itemType":"product",' + '"orgId":"' + _userData.orgId + '",' + '"bizCenterId":"' + _userData.bizCenterId + '",' + '"itemId":"' + e.currentTarget.dataset.productid + '",' + '"skuId":"' + e.currentTarget.dataset.skuid + '",' + '"amount":"' + paramer.shopcartAmount + '"}]}'
				}, function (callback, success) {
					if (callback.success) {
						wx.showToast({
							title: '加入购物车成功'
						})
					}
				})
			}
			else {
				wx.showModal({
					title: '提示',
					content: '此商品不拆零销售，数量必须是' + paramer.productMsg.modCount + '的倍数。',
					showCancel: false
				})
			}
		}
		else{
			wx.showModal({
				title: '提示',
				content: '您所选购的商品当前库存量小于订购数量，如需订购请联系客服',
				showCancel: false
			})
		}
	},
	changeAmount: function(e){
		let _productArr = this.data.productArr
		let paramer = _productArr[e.currentTarget.dataset.index]
		if (e.currentTarget.dataset.status == 'reduce'){
			if (paramer.shopcartAmount - 1 > 0){
				paramer.shopcartAmount = parseInt(paramer.shopcartAmount) - 1
			}
		}
		else{
			paramer.shopcartAmount = parseInt(paramer.shopcartAmount) + 1
		}
		this.setData({
			productArr: _productArr
		})
	}
})