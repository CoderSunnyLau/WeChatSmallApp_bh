const http = require('../../../../../utils/httpUtil.js')
var orderId = '';

Page({
	data: {
		ads: [],
		ad:{},
		loading: true
	},
	onLoad: function(options){
		orderId = options.orderId;
		this.addressesLoad(orderId);
	},
	onShow: function(){
		if(orderId)
			this.addressesLoad(orderId);
	},
	addressesLoad: function(oid){
		var _this = this;
		http.getHttp({
			action: 'VSShop.getAddressOption',
			orderId: oid
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
	},
	selAddress: function(e){
		var _this = this;
		_this.setData({
			loading: true
		});
		http.getHttp({
			action: 'VSShop.getAddress',
			addressId: e.currentTarget.dataset.addressid
		}, function(res, success){
			if(success){
				if(res.success){
					_this.setData({
						ad: res.results[0]
					});
					var ad = _this.data.ad;
					http.postHttp({
						action: 'VSShop.saveOrderAddress',
						orderId: orderId,
						addressDS: JSON.stringify(ad)
					}, function(res, success){
						if(success){
							if(res.success){
								_this.setData({
									loading: false
								});
								wx.navigateBack({
									url: '../orderCheckout',
								});
							}
						}
					});
				}
			}
		});
	}
})