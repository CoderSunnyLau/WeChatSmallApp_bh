// pages/account/account.js
const app = getApp()
const http = require('../../../utils/httpUtil.js')
const ry = require('../../../utils/util.js')
let load = false;
let _this = {};

Page({
	data: {
		userIcon: 'http://file.ry600.com/snapshot//files/af/afvnal1p3sa59q79/2017-02-08/79l897i7bao7gd3o.gif',
		user: {}
	},
	onLoad: function(){
		wx.showLoading();
		_this = this;
		this.load(function(){
			load = true;
			wx.hideLoading();
		});
	},
	onShow: function(){
		if(load){this.load();}
	},
	load: function(callback){
		http.getHttp({action: 'VSUser.getBasicInfo'},function(res, success){
			if(success){
				if(res.success){
					let user = res.results[0];
					_this.setData({
						user: res.results[0],
						userIcon: 'http://www.ry600.com' + user.photoUrl
					});
					if(typeof(callback) == 'function'){callback();}
				}else{
					wx.hideLoading();
					ry.alert(res.message, function(){
						wx.reLaunch({
							url: '/pages/loginPage/login/login'
						});
					});
				}
			}
		});
	},
	logout: function(){
		wx.showLoading({
			title: '正在退出',
			mask: true
		});
		wx.request({
			url: app.globalData.domainName+'/userLogout.action',
			method: 'GET',
			header: http.getHeader(),
			success: function(res){
				var userData = wx.getStorageSync('userData');
				if(userData){
					userData.autoLogin = 'false';
					wx.setStorage({
						key: 'userData',
						data: userData,
						success: function(res){
							wx.reLaunch({
								url: '/pages/loginPage/login/login',
							});
							wx.hideLoading();
						}
					});
				}else{
					wx.reLaunch({
						url: '/pages/loginPage/login/login',
					});
					wx.hideLoading();
				}
			},
			fail: function(res){
				console.log("請求失敗");
			}
		});
	}
});