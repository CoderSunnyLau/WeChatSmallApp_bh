const httpUtil = require('../../../../../utils/httpUtil.js')
Page({
	data: {
		imgUrl: [
			'http://file.ry600.com/files/Product/4q/4q7ehbtu05ydkwgv/photo_l.jpg',
			'http://file.ry600.com/files/Product/4q/4q7ehbtu05ydkwgv/1cssf3tp8d92bpin_l.jpg',
			'http://file.ry600.com/files/Product/4q/4q7ehbtu05ydkwgv/25z9pusd2o1x46b3_l.jpg'
		],
		dotColor: 'rgb(221,221,221)',
		activeDotColor: '#f50',
		isAdd: false,
		hasGroups: false
	},
	onLoad: function (options) {
		var that = this
		httpUtil.getHttp({
			action: 'VSShop.getProduct',
			productId: options.productId
		}, function (callback, success) {
			if (success) {
				if (callback.success) {
					console.log(callback.results[0])
					let skus = callback.results[0].skus
					let skuArr = new Array()
					for (let sku in skus) {
						console.log(skus[sku])
						skuArr.push(skus[sku])
					}
					console.log(skuArr)
					//var _msg = skuArr

					that.setData({
						msgArr: [skuArr[0]],
						skuArr: skuArr,
						productArr: callback.results
					})
				}
			}
		})
	}
})