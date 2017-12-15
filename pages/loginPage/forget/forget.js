// pages/loginPage/forget/forget.js
const ry = require('../../../utils/util.js');
const http = require('../../../utils/httpUtil.js');
var _this,
	imgSrc = 'http://m.ry600.com/jcaptcha.action',
	countTemp = 0;
Page({
	data: {
		title: '找回密码',
		checkImg: '',
		userName: '',
		checkValid: ''
	},
	onLoad: function(){
		_this = this;
		this.getImg();
	},
	userInput: function(e){
		this.setData({
			userName: e.detail.value
		});
	},
	checkInput: function(e){
		this.setData({
			checkValid: e.detail.value
		});
	},
	refreshImg: function(){
		this.getImg();
	},
	getImg: function(){
		var img = imgSrc + '?dc_=' + (new Date()).getTime();
		wx.request({
			url: img,
			header: http.getHeader(),
			success: function(res){
				if(countTemp){
					_this.setData({
						checkImg: img
					});
				}else{
					countTemp++;
					http.saveHeader(res.header['Set-Cookie']);
					_this.getImg();
				}
			}
		});
	},
	doCheck: function(){
		var _data = this.data;
		if(!_data.userName){
			ry.alert('请输入用户名');
		}else if(!_data.checkValid){
			ry.alert('请输入验证码');
		}else{
			ry.loading();
			http.getHttp({
				action: 'VSAccount.getUserPwdInfo',
				_captcha: _this.data.checkValid,
				masterDS: JSON.stringify({
					"userName": _this.data.userName,
					"coughs": _this.data.checkValid
				})
			}, function(res, success){
				wx.hideLoading();
				if(success){
					if(res.success){
						var info = JSON.stringify(res.results[0]);
						wx.navigateTo({
							url: 'forgetCheck?info=' + info,
						});
					}else{
						ry.alert(res.message);
					}
				}
			});
		}
	}
})