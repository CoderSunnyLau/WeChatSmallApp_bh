var _userData
Component({
	properties: {},
	data: {},
	attached: function(){
		_userData = wx.getStorageSync('userData')
		this.setData({
			storeName: _userData.storeName,
			orgName: _userData.orgName
		})
	},
	methods: {
		powerDrawer: function (e) {
			console.log(wx.getStorageSync('userData'))
			this.triggerEvent('customevent', {}, { composed: true })
			let that = this
			var currentStatus = e.currentTarget.dataset.status
			var animation = wx.createAnimation({
				duration: 200,
				timingFunction: 'linear',
				delay: 0	
			})

			that.animation = animation

			animation.opacity(0).rotateX(-100).step()

			that.setData({
				animationData: animation.export()
			})

			setTimeout(function () {
				animation.opacity(1).rotateX(0).step()
				that.setData({
					animationData: animation
				})

				if (currentStatus == 'close') {
					that.setData({
						showModalStatus: false
					})
				}
			}.bind(that), 200)

			if (currentStatus == "open") {
				that.setData({
					showModalStatus: true
				});
			}
		}
	}
})
