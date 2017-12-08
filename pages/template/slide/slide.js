Page({
	data: {
		tabArr: ['所有商品', '订货历史'],
		isSelect: 0
	},
	onLoad: function (options) {
		this.setData({
			arr: [{
				aa: 'arr111',
				bb: 'arr222'
			}],
			mArr: [{
				cc: 'mArr333'
			}, {
				cc: '222'
			}]
		})
		this.getHeight()
	},
	getHeight: function () {
		var that = this
		 wx.createSelectorQuery().in(that).selectAll('#msg,#bar,#tab').boundingClientRect(function (res) {
			console.log(res)
			var _height = 0
			for (let i = 0; i < res.length; i++) {
				console.log(res[i].height)
				_height = _height + res[i].height
			}
			wx.getSystemInfo({
				success: function (res) {
					_height = res.windowHeight - _height - 2
					that.setData({
						bgHeight: _height
					})
				}
			})
		}).exec()
	},
	searchPro: function (e) {
		console.log(e)
	},
	scanPro: function (e) {
		console.log(e)
	},
	tabSelect: function (e) {
		this.setData({
			isSelect: e.currentTarget.dataset.tidx
		})
	}
})