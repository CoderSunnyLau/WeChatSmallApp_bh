Page({
	data: {
		tabArr: ['默认', '销量', '人气'],
		isSelect: 0,
		openScreen: false,
		animationData: {},
		leftNavArr: ['西药', '食品', '中成药', '医疗器械', '生物制药', '化妆品', '重要饮品', '日用品'],
		rightNavArr: ['感冒发热', '咳嗽痰喘', '抗生素', '心脑血管', '糖尿病', '消化道', '妇科', '泌尿生殖', '抗过敏',
			'抗病毒', '耳鼻口腔', '肝胆', '维生素矿物质', '眼科', '皮肤组织', '抗肿瘤', '中枢神经', '内分泌', '其他'],
		mArr: [
			{
				title: '111',
				child: ['aa','bb','cc']
			},
			{
				title: '222',
				child: ['dd', 'ee', 'ff']
			},
			{
				title: '333',
				child: ['gg', 'hh', 'ii']
			},
		],
		idx: 2
	},
	onLoad: function (options) {

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
	}
})