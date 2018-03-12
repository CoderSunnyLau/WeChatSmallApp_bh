// pages/homePage/shopcart/orderCheckout/orderSubmitSuccess/orderSubmitSuccess.js
const http = require('../../../../../utils/httpUtil.js');
const ry = require('../../../../../utils/util.js');
var _this;
Page({
	data: {
		bill: {},
		billId: ""
	},
	onLoad: function(option){
		_this = this;
		ry.loading();
		if(JSON.stringify(option) != "{}" && option.billId){
			_this.setData({
				billId: option.billId
			});
		}
		http.getHttp({
			action: "VSShop.getBillInfo",
			billId: _this.data.billId
		}, function(res, success){
			if(success){
				if(res.success){
					var b = res.results[0];
					if (b.onLinePay){
						b.payModeName = b.payModeName.split("<span")[0];
					}
					var bill = {
						sellerName: b.sellerName,
						payModeName: b.payModeName,
						payableAmount: b.payableAmount
					}
					_this.setData({
						bill: bill
					});
				}else{
					ry.alert(res.message);
				}
			}
			wx.hideLoading();
		});
	}
})