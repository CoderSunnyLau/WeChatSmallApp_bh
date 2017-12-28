Component({
	properties: {},
	data: {},
	methods: {
		formSub: function (e) {
			let _detail = e.detail.value
			let _currentTarget = e.currentTarget
			this.triggerEvent('search', _detail, _currentTarget)
		},
		scanPro: function (e) {
			var that = this
			wx.scanCode({
				success: function (res) {
					let _detail = res
					that.triggerEvent('scan', _detail)
				}
			})
		},
		getHeight: function () {
			var that = this
			wx.createSelectorQuery().in(this).select('#bar').boundingClientRect(function (res) {
				that.setData({
					barHeight: res.height + 'px'
				})
			}).exec()
		}
	},
	ready: function () {
		//this.getHeight()
	}
})