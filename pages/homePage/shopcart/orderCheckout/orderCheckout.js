// pages/homePage/shopcart/orderCheckout/orderCheckout.js
const http = require('../../../../utils/httpUtil.js')
var blockId = '';
var show = false;
var _this = {};

Page({
	data: {
		editRemarkTemp: false,
		loading: true,
		order: {},
		load: true,
		coupon: {}
	},
	onLoad: function(options){
		_this = this;
		blockId = options.blockId;
		this.load(blockId, function(){
			show = true;
			_this.saveInvoice(blockId);
		});
		this.getCoupons(blockId);
	},
	onShow: function(){
		if(show){
			this.load(blockId);
		}
	},
	load: function(bid, callback){
		this.setData({
			loading: true
		});
		wx.request({
			url: 'http://bh.ry600.com/_shop/order.shtml',
			data: {orderId: bid},
			header: http.getHeader(),
			success: function(res){
				http.getHttp({
					action: 'VSShop.getShopOrderInfo',
					withProduct: true,
					orderId: bid
				}, function(res2, success){
					if(success){
						if(res2.success){
							_this.setData({
								order: res2.results[0],
								load: false,
								loading: false
							});
							if(typeof(callback) == 'function'){callback();}
						}
					}
				});
			}
		});
	},
	getCoupons: function(bid){
		http.getHttp({
			action: 'VSShop.getCashAccount',
			orderId: bid,
			accType: "Coupon"
		}, function(res, success){
			if(success){
				if(res.success){
					_this.setData({
						coupon: res.results[0]
					});
				}
			}
		});
	},
	saveInvoice: function(bid){
		http.postHttp({
			action: 'VSShop.saveInvoice',
			orderId: bid,
			invoiceDS: JSON.stringify(Object.assign(_this.data.order.invoice, {"needInvoice":"1", "invoiceItem":"药品"}))
		}, function(){});
	},
	selTransaction: function(e){
		this.setData({
			loading: true
		});
		http.postHttp({
			action: 'VSShop.saveTransaction',
			orderId: _this.data.order.blocks[0].blockId,
			transactionDS: JSON.stringify({"payModeId": _this.data.order.transaction.pays[e.detail.value].payModeId})
		}, function(res, success){
			if(success){
				if(res.success){
					_this.setData({
						order: res.results[0],
						loading: false
					});
				}
			}
		});
	},
	selDelivery: function(e){
		this.setData({
			loading: true
		});
		var freightsTemp = _this.data.order.blocks[0].delivery.freights[e.detail.value];
		http.postHttp({
			action: 'VSShop.saveDelivery',
			orderId: _this.data.order.blocks[0].blockId,
			blockId: _this.data.order.blocks[0].blockId,
			deliveryDS: JSON.stringify({
				"freightId": freightsTemp.freightId,
				"deliveryTime": "只工作日送货（双休日、假日不送）",
				"phoneConfirm": "0",
				"payWay": "现金"
			})
		}, function(res, success){
			if(success){
				if(res.success){
					_this.setData({
						order: res.results[0],
						loading: false
					});
				}
			}
		});
	},
	editRemark: function(e){
		
	},
	saveOrder: function(e){

	}
})