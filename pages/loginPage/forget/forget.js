// pages/loginPage/forget/forget.js
const ry = require('../../../utils/util.js');
const http = require('../../../utils/httpUtil.js');
const app = getApp();
var _this,
	imgSrc = app.globalData.domainName + '/jcaptcha.action',
	domain = app.globalData.domainName.split("//")[1],
	lastDomain = [domain.split(".")[1],domain.split(".")[2]].join("."),
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
		if(!countTemp){
			wx.request({
				// url: 'http://login.' + lastDomain + '/userCenterAuth.jsp?domain=' + domain + '&userAppAuthUrl=%2FuserAppAuth.action&target=http%3A%2F%2F' + domain + '2Fssostate.action%3F_%3D1513652172775',
				url: imgSrc + '?dc_=' + (new Date()).getTime(),
				success: function(res){
					http.saveHeader(res.header['Set-Cookie']);
					countTemp++;
					_this.getImg();
				},
				fail: function(res){
					console.log("fail:",res);
				}
			});
		}else{
			var Cookie = http.getHeader().cookie;
			wx.downloadFile({
				url: img,
				header: {Cookie: Cookie},
				success: function(res){
					_this.setData({
						checkImg: res.tempFilePath
					});
				}
			});
		}
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
					// "checkCode": _this.data.checkValid
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
						_this.getImg();
						ry.alert(res.message);
					}
				}
			});
		}
	}
})