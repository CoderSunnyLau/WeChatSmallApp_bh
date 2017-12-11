// pages/loginPage/forget/forgetCheck.js
const http = require('../../../utils/httpUtil.js');
const ry = require('../../../utils/util.js');
var _this, info;
Page({
	data: {
		info: {
			bindMail:true,
			bindMobile:true,
			mail:"3*******1@qq.com",
			mobile:"155*****0523",
			userName: "ryliuwf"
		},
		checkCode: '',
		way: 'mobile'
	},
	onLoad: function (options) {
		_this = this;
		if(options.info){
			this.setData({
				info: JSON.parse(options.info)
			});
			info = this.data.info;
		}
	},
	checkInput: function(e){
		this.setData({
			checkCode: e.detail.value
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
		http.getHttp({
			action: 'VSAccount.confirmPwdInfo',
			userName: info.userName,
			confirmType: way,
			validCode: _this.data.checkCode
		}, function(res, success){
			if(success){
				if(res.success){
					console.log(res);
				}else{
					ry.alert(res.message);
				}
			}
		});
	}
})