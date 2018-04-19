const httpUtil = require('../../../../../utils/httpUtil.js')
const ry = require('../../../../../utils/util.js')
var _userData
var shopcartAmount

Page({
	data: {
		skuSelect: 0,
		dotColor: 'rgb(221,221,221)',
		activeDotColor: '#f50',
		isAdd: false,
		hasGroups: false,
		shopcartAmount: 1
	},
	onLoad: function (options) {
		var that = this
		shopcartAmount = 1
		_userData = wx.getStorageSync('userData')
		ry.loading();
		var httpPromise = new Promise(function(resolve,reject){
			httpUtil.getHttp({
				action: 'VSShop.getProduct',
				productId: options.productId
			}, function (callback, success) {
				if (success) {
					wx.hideLoading();
					if (callback.success) {
						console.log(callback.results[0])
						let skus = callback.results[0].skus
						let skuArr = new Array()
						for (let sku in skus) {
							skuArr.push(skus[sku])
						}

						that.setData({
							msgArr: [skuArr[0]],
							skuArr: skuArr,
							productArr: callback.results
						})
						resolve()
					}else{
						ry.alert(callback.message);
					}
				}
			})
		})

		httpPromise.then(function(val){
			httpUtil.getHttp({
				action: 'VSCommon.getFavorite',
				resType: 'ProductOfShop',
				resId: options.productId
			},function(callback){
				console.log(callback)
				if(callback.success){
					if(callback.results[0] != null){
						that.setData({
							isAdd: true
						})
					}
				}
			})
		})
		
	},
	skuChange: function(e){
		var that = this
		shopcartAmount = 1
		that.setData({
			shopcartAmount: 1,
			msgArr: [that.data.skuArr[e.currentTarget.dataset.skuidx]],
			skuSelect: e.currentTarget.dataset.skuidx
		})
	},
	changeAmount: function(e){
		var that = this
		if(e.currentTarget.dataset.status == 'reduce'){
			if (parseInt(shopcartAmount) - 1 >= 1){
				shopcartAmount = parseInt(shopcartAmount) - 1
			}
		}
		else{
			shopcartAmount = parseInt(shopcartAmount) + 1
		}
		this.setData({
			shopcartAmount: shopcartAmount
		})
	},
	saveAmount: function(e){
		var that = this
		if(e.detail.value >= 1){
			shopcartAmount = parseInt(e.detail.value)
		}
	},
	addToShopcart: function(e){
		console.log(e.currentTarget.dataset)
		let _productArr = this.data.productArr
		let _skuArr = this.data.msgArr[0]
		console.log(shopcartAmount)
		if (shopcartAmount <= _skuArr.stockTag.amount){
			if(shopcartAmount % _skuArr.modCount == 0){
				httpUtil.getHttp({
					action: 'VSShop.addProduct',
					widthReward: false,
					orderType: 'normal',
					cartProductDS: '{"records":[{"itemType":"product",' + '"orgId":"' + _userData.storeOrgId + '",' + '"bizCenterId":"' + _userData.bizCenterId + '",' + '"itemId":"' + e.currentTarget.dataset.productid + '",' + '"skuId":"' + e.currentTarget.dataset.skuid + '",' + '"amount":"' + shopcartAmount + '"}]}'
				}, function (callback, success) {
					if (callback.success) {
						wx.showToast({
							title: '加入购物车成功'
						})
					}
				})
			}
			else{
				wx.showModal({
					title: '提示',
					content: '此商品不拆零销售，数量必须是' + _skuArr.modCount + '的倍数。',
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
	addFavorite: function(){
		let that = this
		if(!that.data.isAdd){
			wx.showLoading({
				title: '正在加入收藏夹中...',
			})
			httpUtil.postHttp({
				action: 'VSCommon.addFavorite',
				resType: 'ProductOfShop',
				resId: that.data.productArr[0].shopProductId,
				resName: that.data.productArr[0].productCaption
			},function(callback){
				if(callback.success){
					wx.hideLoading()
					that.setData({
						showDialog: true,
						dialogTxt: '成功添加 ' + that.data.productArr[0].productCaption + ' 到收藏夹',
						isAdd: true
					})
				}
			})
		}
		else{
			httpUtil.postHttp({
				action: 'VSCommon.delFavorite',
				resType: 'ProductOfShop',
				resId: that.data.productArr[0].shopProductId
			},function(callback){
				if (callback.success) {
					wx.showToast({
						title: '取消收藏成功 ！'
					})
					that.setData({
						isAdd: false
					})
				}
			})
		}
	}
})