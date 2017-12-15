// pages/loginPage/forget/forgetSet.js
const md5 = require('../../../utils/md5.js');
const http = require('../../../utils/httpUtil.js');
const ry = require('../../../utils/util.js');

var pwds = ['', ''],
	_this = {};
Page({
	data: {
		activateCode: 'c1184242-1c69-421a-8dfb-2e790802bdb9',
		userName: 'ryliuwf99'
	},
	onLoad: function(options){
		_this = this;
		if(options.activateCode && options.userName){
			console.log(options)
			this.setData({
				activateCode: options.activateCode,
				userName: options.userName
			});
			console.log(this.data)
		}
	},
	pwdInput: function(e){
		var idx = parseInt(e.currentTarget.dataset.index),
			val = e.detail.value;
		pwds[idx] = val;
	},
	resetPwd: function(){
		var msg = '';
		if(!pwds[0]){
			msg = '请输入新密码';
		}else if(pwds[0].length < 6){
			msg = '密码不能少于6位';
		}else if(!pwds[1]){
			msg = '请再次输入密码';
		}else if(pwds[0] != pwds[1]){
			msg = '两次输入的密码不一致';
		}
		if(msg){
			ry.alert(msg);
			return false;
		}else{
			wx.showLoading();
			http.postHttp({
				action: 'VSAccount.setPassword',
				masterDS: JSON.stringify({
					"userName": _this.data.userName,
					"activateCode": _this.data.activateCode,
					"password": md5.hexMD5(pwds[0]),
					"passwordConf": md5.hexMD5(pwds[1])
				})
			}, function(res, success){
				if(success){
					if(res.success){
						wx.hideLoading();
						ry.alert('密码重置成功！即将跳转到登录页，请您用新密码登录。', function(r){
							if(r.confirm){
								wx.reLaunch({
									url: '../login/login',
								});
							}
						});
					}else{
						ry.alert(res.message);
					}
				}
			});
		}
	}
})