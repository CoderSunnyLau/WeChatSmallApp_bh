const app = getApp()
const httpUtil = require('../../../utils/httpUtil.js')
const ry = require('../../../utils/util.js')
var _userData
var itemIdx
var _searchContent
var _showcaseId = ''
var showcaseIdx = 0
var _searchSort = ''

Page({
	data: {
		isSelect: 0,
		hasProduct: false,
		products: [],
		canScroll: true,
		scrollTop: 0,
		showTop: false,
		loading: false,
		// tabArr: ['所有商品', '订货历史'],
		noMore: false,
		isHistory: false,
		isShowcase: false
	},
	onLoad: function (options) {

		var that = this
		_userData = wx.getStorageSync('userData')
		itemIdx = 0

		if (options.searchContent == 'undefined' || !options.searchContent) {
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
			if (options.type == 'showcase') {
				_showcaseId = options.showcaseId
				that.setData({
					isShowcase: true
				})
			}
			that.setData({
				isQuickBill: false,
				tabArr: [{
					text: '综合',
					sort: 'default-desc'
				},{
					text: '销量',
					sort: 'salesCount-desc'
				},{
					text: '评论',
					sort: 'commentCount-desc'
				},{
					text: '价格',
					sort: 'price'
				}]
			})
			wx.setNavigationBarTitle({
				title: '商品搜索'
			})
		}

		that.getHeight()	
		if (that.data.isShowcase) {
			that.showcasePro(0)
		}
		else {
			that.getProduct(0, _searchContent)
		}
	},
	getProduct: function (start, _searchContent) {
		var that = this
		var _url = '/_shop/' + _userData.storeCode + '/search.shtml?withSkus=true&sv=' + _searchContent + '&sn=' + start
		if (that.data.isHistory && that.data.isQuickBill) {			 
			_url = _url + '&ffs=isBuy:1'
		}
		if (_searchSort != '' && !that.data.isQuickBill) {
			_url = _url + '&fst=' + _searchSort
		}

		wx.showLoading();
		httpUtil.getHttp({
			action: 'VSCommon.urlRequest',
			url: _url,
			// withFacet: true,
			limit: 5
		}, function (callback) {
			let _products = that.data.products
			if (callback.success) {
				_products.push.apply(_products, callback.results)

				if (_products.length > 0) {
					//初始化每个商品的加入购物车数量
					for (let i = 0; i < _products.length; i++) {
						for (let sku in _products[i].skus) {
							_products[i].skus[sku].shopcartAmount = 1
						}
					}

					if (start + 5 > callback.totals) {
						that.setData({
							noMore: true,
							hasProduct: true,
							products: _products
						})
					}
					else {
						that.setData({
							hasProduct: true,
							products: _products
						})
					}
				}
				else {
					itemIdx = 0
					that.setData({
						hasProduct: false
					})
				}
			}
			else {
				itemIdx = 0
				that.setData({
					hasProduct: false
				})
				ry.alert(callback.message);
			}
			wx.hideLoading();
		})
	},
	tabSelect: function (e) {
		var _tIdx = e.currentTarget.dataset.tidx

		if(this.data.isQuickBill){
			if (_tIdx == 0) {
				this.setData({
					products: [],
					isSelect: _tIdx,
					isHistory: false,
					noMore: false,
					isShowcase: false
				})
			}
			else {
				this.setData({
					products: [],
					isSelect: _tIdx,
					isHistory: true,
					noMore: false,
					isShowcase: false
				})
			}
		}
		else{
			_searchSort = e.currentTarget.dataset.sort
			this.setData({
				products: [],
				isSelect: _tIdx,
				noMore: false,
				isShowcase: false
			})
		}
		
		this.getProduct(0, _searchContent)
	},
	searchPro: function (e) {
		itemIdx = 0
		_searchContent = e.detail.searchContent
		this.setData({
			products: [],
			noMore: false,
			isSelect: 0,
			isHistory: false,
			isShowcase: false
		})
		this.getProduct(0, _searchContent)
	},
	scanPro: function (e) {
		itemIdx = 0
		_searchContent = e.detail.result
		this.setData({
			products: [],
			noMore: false,
			isSelect: 0,
			isHistory: false,
			isShowcase: false
		})
		this.getProduct(0, _searchContent)
	},
	toDetail: function (e) {
		let _productId = e.currentTarget.dataset.productid
		wx.navigateTo({
			url: '../productDetail/productDetail?productId=' + _productId,
		})
	},
	amountSave: function (e) {
		let _products = this.data.products
		let paramer = _products[e.currentTarget.dataset.index].skus[e.currentTarget.dataset.skuid]
		if (e.detail.value >= 1) {
			paramer.shopcartAmount = parseInt(e.detail.value)
			this.setData({
				products: _products
			})
		}
	},
	addToShopcart: function (e) {
		let that = this
		let paramer = this.data.products[e.currentTarget.dataset.index].skus[e.currentTarget.dataset.skuid]
		console.log(paramer)

		if (paramer.stockTag.amount >= paramer.shopcartAmount) {
			if (paramer.shopcartAmount % paramer.modCount == 0) {
				that.setData({
					loading: true
				})
				httpUtil.getHttp({
					action: 'VSShop.addProduct',
					widthReward: false,
					orderType: 'normal',
					cartProductDS: '{"records":[{"itemType":"product",' + '"orgId":"' + _userData.storeOrgId + '",' + '"bizCenterId":"' + _userData.bizCenterId + '",' + '"itemId":"' + e.currentTarget.dataset.productid + '",' + '"skuId":"' + e.currentTarget.dataset.skuid + '",' + '"amount":"' + paramer.shopcartAmount + '"}]}'
				}, function (callback, success) {
					that.setData({
						loading: false
					})
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
					content: '此商品不拆零销售，数量必须是' + paramer.modCount + '的倍数。',
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
		let _products = this.data.products
		let paramer = _products[e.currentTarget.dataset.index].skus[e.currentTarget.dataset.skuid]
		if (e.currentTarget.dataset.status == 'reduce') {
			if (paramer.shopcartAmount - 1 > 0) {
				paramer.shopcartAmount = parseInt(paramer.shopcartAmount) - 1
			}
		}
		else {
			paramer.shopcartAmount = parseInt(paramer.shopcartAmount) + 1
		}
		this.setData({
			products: _products
		})
	},
	//获取屏幕高度，设置scroll-view高度
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
	//滚动加载更多商品
	moreProduct: function () {
		if (this.data.isShowcase) {
			showcaseIdx = showcaseIdx + 10
			this.showcasePro(showcaseIdx)
		}
		else {
			itemIdx = itemIdx + 5
			if (!this.data.noPro) {
				this.getProduct(itemIdx, _searchContent)
			}
		}
	},
	//监听滑动距离，到了一定距离就显示返回顶部按钮
	scrollEvent: function (e) {
		let that = this
		if (e.detail.scrollTop > 1000) {
			that.setData({
				showTop: true
			})
		}
		else {
			that.setData({
				showTop: false
			})
		}
	},
	//返回顶部事件
	backTop: function () {
		this.setData({
			scrollTop: 0
		})
	},
	//点击筛选按钮,侧边商品分类滑动动画
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
	//商品分类搜索事件
	showcasePro(_start) {
		console.log(_showcaseId)
		var that = this
		wx.showLoading()
		httpUtil.getHttp({
			action: 'VSShop.getPrductsShowcase',
			pgNum: _start,
			limit: 10,
			showcaseId: _showcaseId,
			orgId: _userData.orgId,
			bizCenterId: _userData.bizCenterId
		}, callback => {
			let _products = that.data.products
			let _results = []
			if (callback.success) {
				//商品分类返回结果规范化
				for(let i = 0; i < callback.results.length;i++){
					_results.push(callback.results[i].productInfoWithSku)
				}
				_products.push.apply(_products, _results)

				if (_products.length > 0) {
					//初始化每个商品的加入购物车数量
					for (let i = 0; i < _products.length; i++) {
						for (let sku in _products[i].skus) {
							_products[i].skus[sku].shopcartAmount = 1
						}
					}

					// console.log(_products)
					if (_start + 10 > callback.totals) {
						that.setData({
							noMore: true,
							hasProduct: true,
							products: _products
						})
					}
					else {
						that.setData({
							hasProduct: true,
							products: _products
						})
					}
				}
				else {
					itemIdx = 0
					that.setData({
						hasProduct: false
					})
				}
			}
			else {
				itemIdx = 0
				that.setData({
					hasProduct: false
				})
				ry.alert(callback.message);
			}
			wx.hideLoading();
		})	
	}
})