// pages/account/account.js
const http = require('../../../../utils/httpUtil.js')

Page({
	data: {
		user: {},
		gender: ["男", "女", "不公开"]
	},
	onLoad: function(){
		const _this = this;
		http.getHttp({action: 'VSUser.getBasicInfo'},function(res, success){
			if(success){
				if(res.success){
					_this.setData({
						user: res.results[0]
					});
					console.log(res.results[0])
				}
			}
		});
	},
	inputFn: function(e){
		this.setData({
			['user.fullName']: e.detail.value
		});
	},
	setGender: function(e){
		this.setData({
			['user.gender']: e.detail.value
		});
	},
	setBirthday: function(e){
		this.setData({
			['user.birthday']: e.detail.value
		});
	},
	saveInfo: function(){
		var _this = this;
		http.postHttp({
			action: 'VSUser.saveBasicInfo',
			masterDS: JSON.stringify(_this.data.user)
		}, function(res, success){
			if(success){
				if(res.success){
					wx.showToast({
						title: '修改成功',
						duration: 800,
						success: function(){
							setTimeout(function(){
								wx.navigateBack({});
							}, 800);
						}
					});
				}
			}
		});
	}
});