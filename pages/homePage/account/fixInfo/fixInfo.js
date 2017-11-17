// pages/account/account.js
const http = require('../../../../utils/httpUtil.js');
const ry = require('../../../../utils/util.js');
var _this = {};

Page({
	data: {
		user: {},
		gender: ["男", "女", "不公开"]
	},
	onLoad: function(options){
		_this = this;
		this.setData({
			user: options
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
				}else{
					ry.alert(res.message);
				}
			}
		});
	}
});