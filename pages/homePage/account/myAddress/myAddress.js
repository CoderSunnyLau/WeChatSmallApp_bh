// pages/homePage/account/myAdress/myAddress.js
const http = require('../../../../utils/httpUtil.js')

Page({
	data: {
		ads: [],
		loading: true
	},
	onLoad: function(){
		this.addressesLoad();
	},
	onShow: function () {
		this.addressesLoad();
	},
	addressesLoad: function(){
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
					console.log(res.results[0])
				}
			}
		});
	}
})