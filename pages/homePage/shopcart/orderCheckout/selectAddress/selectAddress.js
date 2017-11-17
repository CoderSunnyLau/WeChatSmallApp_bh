const http = require('../../../../../utils/httpUtil.js');
const ry = require('../../../../../utils/util.js');
var orderId = '';
var load = false;

Page({
	data: {
		ads: [],
		ad:{},
		loading: true
	},
	onLoad: function(options){
		orderId = options.orderId;
		this.addressesLoad(orderId, function(){
			load = true;
		});
	},
	onShow: function(){
		if(load && orderId)
			this.addressesLoad(orderId);
	},
	addressesLoad: function(oid, callback){
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
					if(typeof(callback) == 'function'){
						callback();
					}
				}else{
					ry.alert(res.message);
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
							}else{
								ry.alert(res.message);
							}
						}
					});
				}else{
					ry.alert(res.message);
				}
			}
		});
	}
})