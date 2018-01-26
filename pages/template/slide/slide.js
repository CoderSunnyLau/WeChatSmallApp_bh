Page({
	data: {
		tabArr: ['默认', '销量', '人气'],
		isSelect: 0,
		headerShow: true,
		openScreen: false,
		animationData: {},
		headerHeight: 0,
		tabHeight: 0,
		pageHeight: 0,
		backTop: true,
		testTxt: '放在data里试试'
	},
	// onReady: function(){
	// 	console.log(this)
	// 	console.log(this.selectComponent('#bar'))
	// 	this.bar = this.selectComponent('#bar')
	// },
	onLoad: function (options) {	
		var _mArr = []
		for(let i=0;i<100;i++){
			_mArr.push(i)
		}
		this.setData({
			mArr: _mArr
		})
		// wx.request({
		// 	url: 'http://www.ry600.com/jsonaction/websiteaction.action?action=VSCommon.urlRequest&url=%2F_shop%2Fpnlf%2Fsearch.shtml%3FwithSkus%3Dtrue%26sv%3D%26sn%3D10&limit=5',
		// 	header: { cookie: '_serviceId=99c98f88d21c493b91616a81c36ed212'},
		// 	success: function(res){
		// 		console.log(res.data)
		// 	}
		// })
		this.getHeight()
	},
	selectItem: function (e) {
		//console.log(e.currentTarget.dataset.idx)
		this.setData({
			isSelect: e.currentTarget.dataset.idx
		})
	},
	tabSelect: function (e) {
		this.setData({
			isSelect: e.currentTarget.dataset.tidx
		})
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
			if(_status == 'close'){
				this.setData({
					openScreen: false
				})
			}
		}.bind(this),100)
	},
	getHeight: function () {
		var that = this
		wx.createSelectorQuery().selectAll('#msg,#bar,#tab').boundingClientRect(function (res) {
			var _tipHeight = 0
			// var _res = JSON.parse(JSON.stringify(res))
			for (let i = 0; i < res.length; i++) {
				console.log(res[i])
				_tipHeight = _tipHeight + res[i].height
			}
			that.setData({
				headerHeight: res[0].height + res[1].height,
				barHeight: res[2].height
			})
			wx.getSystemInfo({
				success: function (res) {
					console.log(res.windowHeight)
					_tipHeight = res.windowHeight - _tipHeight
					that.setData({
						contentHeight: _tipHeight + 'px',
						pageHeight: res.windowHeight
					})
				}
			})
		}).exec()
	},
	// scrollEvent: function(e){
	// 	let that = this
	// 	let animation = wx.createAnimation({
	// 		duration: 200,
	// 		timingFunction: 'linear',
	// 		delay: 0
	// 	})
	// 	this.animation = animation
	// 	if(e.detail.scrollTop > 350){
	// 		that.setData({
	// 			headerShow: false,
	// 			backTop: true,
	// 			contentHeight: (that.data.pageHeight - that.data.barHeight) + 'px'
	// 		})
			
	// 		// animation.opacity(1).translateY(0).step()
	// 		// that.setData({
	// 		// 	headerAnimation: animation.export()
	// 		// })
	// 		// setTimeout(function () {
	// 		// 	animation.opacity(0).translateY(-83).step()
	// 		// 	that.setData({
	// 		// 		headerAnimation: animation
	// 		// 	})
	// 		// }.bind(this), 200)
	// 	}
	// 	else{
	// 		// animation.opacity(0).translateY(83).step()
	// 		// that.setData({
	// 		// 	headerAnimation: animation.export()
	// 		// })
	// 		// setTimeout(function () {
	// 		// 	animation.opacity(1).translateY(0).step()
	// 		// 	that.setData({
	// 		// 		headerAnimation: animation
	// 		// 	})
	// 		// }.bind(this), 200)
	// 		that.setData({
	// 			headerShow: true,
	// 			backTop: false,
	// 			contentHeight: (that.data.pageHeight - that.data.headerHeight - that.data.barHeight) + 'px'
	// 		})
	// 	}
	// },
	backTop: function(){
		this.setData({
			scrollTop: 0
		})
	},
	changeTxt: function(){
		this.setData({
			testTxt: '改变下文字试试'
		})
	},
	showBox: function(){
		this.setData({
			boxShow: true
		})
	}
})