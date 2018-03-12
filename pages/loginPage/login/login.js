const app = getApp()
const http = require('../../../utils/httpUtil.js')
const md5 = require('../../../utils/md5.js')
const base64 = require('../../../utils/base64.js')
const ry = require('../../../utils/util.js')

var _this = {};
Page({
	data: {
		inputArr: ['', ''],
		vs: app.globalData.version,
		focusIdx: -1
	},
	onLoad: function(){
		_this = this;
		wx.getStorage({
			key: 'userData',
			success: function(res){
				_this.setData({
					inputArr: [res.data.userName, res.data.password]
				});
				if(res.data.autoLogin == 'true'){
					_this.doLogin();
				}
			}
		});
		// wx.login({
		// 	success: function(res){
		// 		console.log(res.code);
		// 		wx.request({
		// 			url: 'https://api.weixin.qq.com/sns/jscode2session',
		// 			data: {
		// 				appid: 'wx812f52591fe47137',
		// 				secret: 'f23d93e403dec4505ff1ef1b7e61c9f4',
		// 				js_code: res.code,
		// 				grant_type: 'authorization_code'
		// 			},
		// 			success: function(r){
		// 				console.log(r.data.openid)
		// 			}
		// 		});
		// 	}
		// });
	},
	inputFn: function(e){
		var inputTemp = 'inputArr[' + e.currentTarget.dataset.index + ']';
		this.setData({
			[inputTemp]: e.detail.value,
			tip: ''
		});
	},
	doLogin: function(){
		var inputArr = this.data.inputArr;
		if(!inputArr[0]){
			ry.alert('请输入用户名');
			console.log(inputArr)
		}else if(!inputArr[1]){
			ry.alert('请输入密码');
		}else{
			http.loginHttp({
				act: 'login',
				userName: inputArr[0],
				password: md5.hexMD5(inputArr[1]),
				userScope: 1
			}, function(res, success){
				if(success){
					if(res.data.success){
						try{
							http.saveHeader(res.header['Set-Cookie']);
						}catch(e){
							console.log(e);
						}
						var _orgData = base64.decode(res.data.message);
						_this.setData({
							tip: '登录成功'
						});
						let _userData = wx.getStorageSync('userData');
						if(_userData && (_userData.userName != inputArr[0] || _userData.password != inputArr[1])){
							_userData.userName = inputArr[0];
							_userData.password = inputArr[1];
						}
						if(_userData.userName == inputArr[0] && _userData.orgName && _userData.storeName){
							let _header = http.getHeader();
							_header.cookie = _header.cookie + ',_relOrgId=' + _userData.orgId;
							http.saveHeader(_header.cookie);
							_userData.autoLogin = 'true';
							wx.setStorageSync('userData', _userData);
							wx.switchTab({
								url: '/pages/homePage/home/home'
							});
						}else{
							_userData = {};
							_userData.userName = inputArr[0];
							_userData.password = inputArr[1];
							_userData.autoLogin = 'true';
							wx.setStorageSync('userData', _userData);
							wx.redirectTo({
								url: '/pages/select/select?isOrg=true&orgData=' + JSON.stringify(_orgData)
							});
						}
					}else{
						_this.setData({
							tip: '用户名或密码错误'
						});
					}
				}else{
					ry.alert('请求失败,请点击页面右上角菜单按钮，打开调试后重试');
				}
			});
		}
	},
	inputFocus: function(e){
		var idx = e.currentTarget.dataset.index * 1;
		this.setData({
			focusIdx: idx
		});
	},
	inputBlur: function(){
		this.setData({
			focusIdx: -1
		});
	},
	clear: function(e){
		var idx = e.currentTarget.dataset.index * 1;
		var inputTemp = 'inputArr[' + idx + ']';
		this.setData({
			[inputTemp]: '',
			focusIdx: idx
		});
	}
});