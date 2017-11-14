// pages/homePage/shopcart/orderCheckout/orderCheckout.js
const http = require('../../../../utils/httpUtil.js')
var blockId = '';
var show = false;
var _this = {};
var tTemp = null;
var animateTTemp = null;
var dlvIdx = -1;

Page({
	data: {
		editRemarkTemp: false,
		loading: true,
		order: {},
		load: true,
		coupon: {},
		dlvDtlIdx: [0, 0, 0],
		delivery: [
			["只工作日送货（双休日、假日不送）", "工作日、双休日与假日均可送货", "只双休日、假日送货（工作日不送）"],
			["不需要确认", "送货前确认"],
			["现金", "POS刷卡", "支票"]
		],
		showDlvDtl: false,
		animationData: {},
		animationBg: {},
		animationBox: {}
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
	selDelivery: function(){
		this.animationOut();
		this.setData({
			loading: true
		});
		var freightsTemp = _this.data.order.blocks[0].delivery.freights[dlvIdx];
		var dlv = _this.data.delivery;
		var idx = _this.data.dlvDtlIdx;
		http.postHttp({
			action: 'VSShop.saveDelivery',
			orderId: _this.data.order.blocks[0].blockId,
			blockId: _this.data.order.blocks[0].blockId,
			deliveryDS: JSON.stringify({
				"freightId": freightsTemp.freightId,
				"deliveryTime": dlv[0][idx[0]],
				"phoneConfirm": idx[1],
				"payWay": dlv[2][idx[2]]
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
	deliveryChange: function(e){
		dlvIdx = e.detail.value;
		this.animationIn();
	},
	dlvDtlChange: function(e){
		this.setData({
			dlvDtlIdx: e.detail.value
		});
		console.log(e.detail.value)
	},
	editRemark: function(){
		this.setData({
			editRemarkTemp: !_this.data.editRemarkTemp
		});
	},
	saveOrder: function(e){

	},
	animationIn: function(){
		this.setData({
			showDlvDtl: true
		});
		clearTimeout(animateTTemp);
		//上滑进入
		var up = wx.createAnimation({
			duration: 200
		});
		up.bottom(0).step();
		//淡入
		var fadeIn = wx.createAnimation({
			duration: 200
		});
		fadeIn.opacity(0.5).step();
		this.setData({
			animationBox: up.export(),
			animationBg: fadeIn.export()
		});
	},
	animationOut: function(){
		clearTimeout(animateTTemp);
		//下滑出
		var down = wx.createAnimation({
			duration: 200
		});
		down.bottom(-600 + 'rpx').step();
		//淡出
		var fadeOut = wx.createAnimation({
			duration: 200
		});
		fadeOut.opacity(0).step();
		this.setData({
			animationBox: down.export(),
			animationBg: fadeOut.export()
		});
		animateTTemp = setTimeout(function(){
			_this.setData({
				showDlvDtl: false
			});
		}, 250);
	}
})