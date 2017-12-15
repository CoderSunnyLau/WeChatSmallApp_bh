const app = getApp()
const httpUtil = require('../../../../utils/httpUtil.js')
var _userData
var itemIdx
var _searchContent

Page({
	data: {
		isSelect: 0,
		hasProduct: undefined,
		productArr: [],
		canScroll: true,
		scrollTop: 0,
		showTop: false
	},
	onLoad: function (options) {
		console.log(options)
		var that = this
		_userData = wx.getStorageSync('userData')
		itemIdx = 0

		if (options.searchContent == 'undefined') {
			options.searchContent = ''
		}
		_searchContent = options.searchContent

		if (options.type == 'quickBill') {
			that.setData({
				isQuickBill: true,
				tabArr: ['所有商品', '订货历史']
			})
			wx.setNavigationBarTitle({
				title: '快速采购'
			})
		}
		else {
			that.setData({
				isQuickBill: false,
				tabArr: ['默认', '销量', '人气']
			})
			wx.setNavigationBarTitle({
				title: '商品分类'
			})
		}

		that.getHeight()
		that.getProduct(0,_searchContent)
	},
	getProduct: function (start, _searchContent) {
		var that = this
		var _url = '/_shop/' + _userData.storeCode + '/search.shtml?withSkus=true&sv=' + _searchContent + '&sn=' + start

		wx.showLoading();
		httpUtil.postHttp({
			action: 'VSCommon.urlRequest',
			url: _url,
			// withFacet: true,
			limit: 5
		}, function (callback, success) {
			let _productArr = []
			if (callback.success) {
				//console.log(JSON.parse(callback.attachData))
				var _listArr = that.data.productArr
				if (callback.results.length > 0) {
					let _callbackArr = JSON.parse(JSON.stringify(callback.results))
					//console.log(_callbackArr)
					for (let i = 0; i < _callbackArr.length; i++) {
						let skus = _callbackArr[i].skus
						for (let sku in skus) {
							let _productItem = JSON.parse(JSON.stringify(_callbackArr[i]))
							_productItem.productMsg = JSON.parse(JSON.stringify(skus[sku]))
							_productItem.shopcartAmount = 1
							_productArr.push(_productItem)
						}
					}
					_listArr.push.apply(_listArr, _productArr)
					that.setData({
						hasProduct: true,
						productArr: _listArr
					})
				}
				else if(_listArr.length > 0){
					that.setData({
						canScroll: false
					})
					wx.showModal({
						title: '提示',
						content: '没有更多商品了',
						showCancel: false,
						success: function(res){
							if(res.confirm){
								that.setData({
									canScroll: true
								})
							}
						}
					})
				}
				else{
					itemIdx = 0
					that.setData({
						hasProduct: false
					})
				}
			}
			wx.hideLoading();
		})
	},
	tabSelect: function (e) {
		this.setData({
			isSelect: e.currentTarget.dataset.tidx
		})
	},
	searchPro: function (e) {
		itemIdx = 0
		_searchContent = e.detail.searchContent
		this.setData({
			productArr: []
		})
		this.getProduct(0, _searchContent)
	},
	scanPro: function (e) {
		itemIdx = 0
		_searchContent = e.detail.result
		this.setData({
			productArr: []
		})
		this.getProduct(0, _searchContent)
	},
	toDetail: function (e) {
		let _productId = e.currentTarget.dataset.productid
		wx.navigateTo({
			url: 'productDetail/productDetail?productId=' + _productId,
		})
	},
	amountSave: function (e) {
		var that = this
		if (e.detail.value >= 1) {
			that.data.productArr[e.currentTarget.dataset.index].shopcartAmount = parseInt(e.detail.value)
		}
	},
	addToShopcart: function (e) {
		var paramer = this.data.productArr[e.currentTarget.dataset.index]

		if (paramer.productMsg.stockTag.amount >= paramer.shopcartAmount) {
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
		else {
			wx.showModal({
				title: '提示',
				content: '您所选购的商品当前库存量小于订购数量，如需订购请联系客服',
				showCancel: false
			})
		}
	},
	changeAmount: function (e) {
		let _productArr = this.data.productArr
		let paramer = _productArr[e.currentTarget.dataset.index]
		if (e.currentTarget.dataset.status == 'reduce') {
			if (paramer.shopcartAmount - 1 > 0) {
				paramer.shopcartAmount = parseInt(paramer.shopcartAmount) - 1
			}
		}
		else {
			paramer.shopcartAmount = parseInt(paramer.shopcartAmount) + 1
		}
		this.setData({
			productArr: _productArr
		})
	},
	getHeight: function () {
		var that = this
		wx.createSelectorQuery().selectAll('#msg,#bar,#tab').boundingClientRect(function (res) {
			var _tipHeight = 0
			for (let i = 0; i < res.length; i++) {
				_tipHeight = _tipHeight + res[i].height
			}
			wx.getSystemInfo({
				success: function (res) {
					_tipHeight = res.windowHeight - _tipHeight
					that.setData({
						tipHeight: (_tipHeight - 38) + 'px',
						contentHeight: _tipHeight + 'px'
					})
				}
			})
		}).exec()
	},
	moreProduct: function () {
		itemIdx = itemIdx + 5
		this.getProduct(itemIdx, _searchContent)
	},
	showScreen: function (e) {
		var _status = e.currentTarget.dataset.status

		var animation = wx.createAnimation({
			duration: 200,
			timingFunction: 'ease',
			delay: 0
		})
		this.animation = animation

		animation.opacity(0).translateX(329).step()

		this.setData({
			animationData: animation.export(),
			openScreen: true
		})
		setTimeout(function () {
			animation.opacity(1).translateX(0).step()
			this.setData({
				animationData: animation
			})
			if (_status == 'close') {
				this.setData({
					openScreen: false
				})
			}
		}.bind(this), 100)

		if (_status == 'close') {
			this.setData({
				openScreen: true
			})
		}
	},
	scrollEvent: function(e){
		let that = this
		if(e.detail.scrollTop > 1000){
			that.setData({
				showTop: true
			})
		}
		else{
			that.setData({
				showTop: false
			})
		}
	},
	backTop: function(){
		this.setData({
			scrollTop: 0
		})
	}
})