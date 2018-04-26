const app = getApp()
const httpUtil = require('../../utils/httpUtil.js')
Page({
  data: {},
	onLoad: function (options) { },
	logout: function () {
		wx.request({
			url: app.globalData.domainName + '/userLogout.action',
			method: 'GET',
			header: httpUtil.getHeader(),
			success: function (res) {
				console.log(res);
				console.log(2)
			},
			fail: function (res) {
				console.log(res)
				console.log(1)
			}
		});
		var userData = wx.getStorageSync('userData');
		userData.autoLogin = 'false';
		wx.setStorage({
			key: 'userData',
			data: userData,
			success: function (res) {
				wx.reLaunch({
					url: '/pages/loginPage/login/login',
				});
			}
		});
	}
})