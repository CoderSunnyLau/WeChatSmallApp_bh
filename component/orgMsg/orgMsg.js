// component/orgMsg/orgMsg.js
Component({
  /**
   * 组件的属性列表
   */
	properties: {
	},

  /**
   * 组件的初始数据
   */
	data: {
		storeName: wx.getStorageSync('userData').storeName,
		orgName: wx.getStorageSync('userData').orgName
	},

  /**
   * 组件的方法列表
   */
	methods: {
		powerDrawer: function (e) {
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
