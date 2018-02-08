// pages/homePage/account/orderList/orderList.js
const http = require('../../../../utils/httpUtil.js')
const ry = require('../../../../utils/util.js')
let _this = {};
Page({
	data: {
		crrIndex: 0,
		bills: [{state: "全部订单", list: []}, {state: "待付款"}, {state: "待收货"}, {state:"已完成"},{state:"已取消"}]
	},
	onLoad: function(){
		_this = this;
		this.getBills();
	},
	changeTab: function(e){
		this.setData({
			crrIndex: e.currentTarget.dataset.index
		});
	},
	getBills: function(pgNum, state){
		http.getHttp({
			action: 'VSShop.getMyBills',
			pgNum: pgNum || 0,
			limit: 5,
			bbState: state || ""
		}, function(res, success){
			if(success){
				if(res.success){
					var _bills = res.results;
					for(var i = 0; i < _bills.length; i++){
						var _bill = _bills[i];
						if(_bill.payModeName.indexOf("在线支付") > -1){
							_bill.payModeName = "在线支付";
						}
					}
					var billsTemp = "bills[" + _this.data.crrIndex + "].list";
					_this.setData({
						[billsTemp]: res.results
					});
				}else{
					ry.alert(res.message);
				}
			}
		});
	}
})