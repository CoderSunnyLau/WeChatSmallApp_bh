// pages/homePage/account/myAdress/myAddress.js
const http = require('../../../../utils/httpUtil.js');
const ry = require('../../../../utils/util.js');
var load = false;

Page({
	data: {
		ads: [],
		loading: true
	},
	onLoad: function(){
		this.addressesLoad();
	},
	onShow: function(){
		if(load){this.addressesLoad();}
	},
	addressesLoad: function(callback){
		var _this = this;
		http.getHttp({
			action: 'VSShop.getAddresses'
		}, function(res, success){
			if(success){
				if(res.success){
					_this.setData({
						ads: res.results,
						loading: false
					});
				}else{
					ry.alert(res.message);
				}
			}
			load = true;
		});
	}
})