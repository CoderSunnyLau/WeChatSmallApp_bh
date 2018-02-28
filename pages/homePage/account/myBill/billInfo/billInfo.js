// pages/homePage/account/myBill/billInfo/billInfo.js
const http = require('../../../../../utils/httpUtil.js')
const ry = require('../../../../../utils/util.js')

let billId = "";
let _this = {};
const errorImg = "http://file.ry600.com/defaultimg/files/Product/photo_s.jpg";

Page({
	data: {
		bill: {},
		loading: true
	},
	onLoad: function(options){
		_this = this;
		billId = options.billId;
		_this.getBillInfo();
	},
	getBillInfo: function(){
		ry.loading();
		http.getHttp({
			action: "VSShop.getBillInfo",
			billId: billId
		},function(res, success){
			if(success){
				if(res.success){
					let bill = res.results[0];
					if(bill.payModeName.indexOf("在线支付") > -1){
						bill.payModeName = "在线支付";
					}
					_this.setData({
						bill: bill,
						loading: false
					});
					console.log(res.results[0])
				}else{
					ry.alert(res.message);
				}
				wx.hideLoading();
			}
		});
	},
	imgError: function(e){
		console.log(e);
		let pid = e.currentTarget.dataset.pid;
		let photoTemp = "bill.products[" + pid + "].photoUrl";
		_this.setData({
			[photoTemp]: errorImg
		});
	}
})