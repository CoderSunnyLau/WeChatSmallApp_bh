// pages/loginPage/forget/forgetCheck.js
const http = require('../../../utils/httpUtil.js');
const ry = require('../../../utils/util.js');
var _this, info;
Page({
	data: {
		info: {
			// bindMail:true,
			// bindMobile:true,
			// mail:"3*******1@qq.com",
			// mobile:"155*****0523",
			// userName: "ryliuwf"
		},
		validCode: '',
		way: 'mobile'
	},
	onLoad: function (options) {
		_this = this;
		console.log(options);
		if(options.info){
			this.setData({
				info: JSON.parse(options.info)
			});
		}
		info = this.data.info;
		if(!info.bindMobile){
			this.setData({
				way: 'mail'
			});
		}
	},
	checkInput: function(e){
		this.setData({
			validCode: e.detail.value
		});
	},
	changeWay: function(e){
		var way = e.detail.value ? e.detail.value : e.currentTarget.dataset.name;
		this.setData({
			way: way
		});
	},
	sendValidCode: function(){
		http.getHttp({
			action: 'VSAccount.getValidCode',
			validKey: _this.data.info.userName,
			validType: _this.data.way
		}, function(res, success){
			if(success){
				ry.alert(res.message);
			}
		});
	},
	nextStep: function(){
		if(!_this.data.validCode){
			ry.alert('请输入验证码');
			return false;
		}
		ry.loading();
		http.getHttp({
			action: 'VSAccount.confirmPwdInfo',
			masterDS: JSON.stringify({
				"userName": info.userName,
				"confirmType": _this.data.way,
				"validCode": _this.data.validCode
			}),
		}, function(res, success){
			if(success){
				wx.hideLoading();
				if(res.success){
					wx.navigateTo({
						url: 'forgetSet?activateCode=' + res.results[0] + '&userName=' + info.userName
					});
				}else{
					ry.alert(res.message);
				}
			}
		});
	}
})