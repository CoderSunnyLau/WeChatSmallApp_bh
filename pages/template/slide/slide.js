Page({
	data: {
		tabArr: ['默认', '销量', '人气'],
		isSelect: 0,
		openScreen: false,
		animationData: {},
		leftNavArr: ['西药', '食品', '中成药', '医疗器械', '生物制药', '化妆品', '重要饮品', '日用品'],
		rightNavArr: ['感冒发热', '咳嗽痰喘', '抗生素', '心脑血管', '糖尿病', '消化道', '妇科', '泌尿生殖', '抗过敏',
			'抗病毒', '耳鼻口腔', '肝胆', '维生素矿物质', '眼科', '皮肤组织', '抗肿瘤', '中枢神经', '内分泌', '其他']
	},
	onLoad: function (options) {
		var _mArr = []
		for(let i=0;i<100;i++){
			_mArr.push(i)
		}
		this.setData({
			mArr: _mArr
		})
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

		if (_status == 'close') {
			this.setData({
				openScreen: true
			})
		}
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
						contentHeight: _tipHeight + 'px'
					})
				}
			})
		}).exec()
	}
})