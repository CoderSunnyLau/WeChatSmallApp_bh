const httpUtil = require('../../../utils/httpUtil.js')
var _userData
var _showcaseArr

Page({
	data: {
		isDrop: false,
		showItem: false,
		isSelect: 0,
		leftNavArr: ['西药', '食品', '中成药', '医疗器械', '生物制药', '化妆品', '重要饮品', '日用品', 'sss', 'asdaa', '2122', 'asdasd'],
		rightNavArr: ['感冒发热', '咳嗽痰喘', '抗生素', '心脑血管', '糖尿病', '消化道', '妇科', '泌尿生殖', '抗过敏',
			'抗病毒', '耳鼻口腔', '肝胆', '维生素矿物质', '眼科', '皮肤组织', '抗肿瘤', '中枢神经', '内分泌', '其他']
	},
	onLoad: function (options) {
		_userData = wx.getStorageSync('userData')
		//console.log(_userData)
		_showcaseArr = []
		let that = this

		this.getHeight()
		wx.showLoading({
			title: '加载中...',
		})
		httpUtil.getHttp({
			action: 'VSPubSelect.getShowcases',
			orgId: _userData.storeOrgId,
			bizCenterId: _userData.bizCenterId
		},
			function (callback, success) {
				if (callback.success) {
					wx.hideLoading()
					_showcaseArr = callback.results[0].children
					that.setData({
						showcaseArr: callback.results[0].children
					})
				}
			})
	},
	dropItem: function (e) {
		let that = this
		that.setData({
			isSelect: e.currentTarget.dataset.idx,
			isDrop: !that.data.isDrop
		})
	},
	scanTo: function (e) {
		wx.navigateTo({
			url: '../showcase/search/search?searchContent=' + e.detail.result + '&type=shopcase'
		})
	},
	searchTo: function (e) {
		wx.navigateTo({
			url: '../showcase/search/search?searchContent=' + e.detail.searchContent + '&type=shopcase'
		})
	},
	selectItem: function (e) {
		//console.log(e.currentTarget.dataset.idx)
		this.setData({
			isSelect: e.currentTarget.dataset.idx
		})
	},
	getHeight: function () {
		var that = this
		wx.createSelectorQuery().selectAll('#msg,#bar').boundingClientRect(function (res) {
			var _contentHeight = 0
			for (let i = 0; i < res.length; i++) {
				_contentHeight = _contentHeight + res[i].height
			}
			wx.getSystemInfo({
				success: function (res) {
					_contentHeight = res.windowHeight - _contentHeight
					that.setData({
						contentHeight: _contentHeight + 'px'
					})
				}
			})
		}).exec()
	},
	searchPro(e){
		console.log(e)
		// wx.navigateTo({
		// 	url: '../showcase/search/search?searchContent=&type=shopcase&showcaseId=' + e.currentTarget.dataset.showcaseid
		// })
	}
})