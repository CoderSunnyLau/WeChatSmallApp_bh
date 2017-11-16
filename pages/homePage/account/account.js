// pages/account/account.js
const http = require('../../../utils/httpUtil.js')
import { appHeader } from '../../../component/appHeader/appHeader.js'
let load = false;
let _this = {};

Page({
	data: {
		userIcon: 'http://file.ry600.com/snapshot//files/af/afvnal1p3sa59q79/2017-02-08/79l897i7bao7gd3o.gif',
		userName: '',
		fullName: ''
	},
	onLoad: function(){
		new appHeader();
		_this = this;
		this.load();
	},
	onShow: function(){
		if(load){this.load();}
	},
	load: function(){
		http.getHttp({action: 'VSUser.getBasicInfo'},function(res, success){
			if(success){
				if(res.success){
					let user = res.results[0];
					_this.setData({
						userName: user.userName,
						fullName: user.fullName,
						userIcon: 'http://www.ry600.com' + user.photoUrl
					});
					load = true;
				}else{
					wx.reLaunch({
						url: '/pages/loginPage/login/login',
					});
				}
			}
		});
	},
	orderList: function(){
		wx.navigateTo({
			url: 'orderList/orderList',
		});
	},
	logout: function(){
		wx.showLoading({
			title: '正在退出',
			mask: true
		});
		wx.request({
			url: 'http://bh.ry600.com/userLogout.action',
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