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
		testTxt: '放在data里试试',
		showDialog: false
	},
	// onReady: function(){
	// 	console.log(this)
	// 	console.log(this.selectComponent('#bar'))
	// 	this.bar = this.selectComponent('#bar')
	// },
	onLoad: function (options) {
		console.log(this.data.tabArr)
		var _mArr = []
		for (let i = 0; i < 100; i++) {
			_mArr.push(i)
		}
		this.setData({
			mArr: _mArr
		})
		this.showcasePro()
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
			if (_status == 'close') {
				this.setData({
					openScreen: false
				})
			}
		}.bind(this), 100)
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
	backTop: function () {
		this.setData({
			scrollTop: 0
		})
	},
	changeTxt: function () {
		this.setData({
			testTxt: '改变下文字试试'
		})
	},
	showBox: function (e) {
		if (e.currentTarget.dataset.status == 'open') {
			this.setData({
				boxShow: true
			})
		}
		else {
			this.setData({
				boxShow: false
			})
		}
	},
	showDialog: function () {
		this.setData({
			showDialog: true,
			dialogTxt: '自定义弹窗内容'
		})
	},
	showcasePro() {
		wx.request({
			url: 'http://bh.eheres.org/jsonaction/websiteaction.action',
			data: {
				action: 'VSShop.getPrductsShowcase',
				pgNum: 0,
				limit: 5,
				showcaseId: '2fa7tkipcmorbcjh',
				orgId: 'afvnal1p3sa59q79',
				bizCenterId: 'csjvfa5d2qsqzdsn'
			},
			header: {cookie:'_clientId=0f98fc1dc3a3414583458d870714bfd5; _serviceId=1968560451564d25b030679938e66a18; storeCode=wbyy; _relOrgId=7pa1kzpfc8dz4afh'},
			success(res) {
				console.log(res)
			}
		})
	}
})