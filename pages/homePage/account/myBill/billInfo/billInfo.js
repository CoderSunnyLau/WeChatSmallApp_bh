// pages/homePage/account/myBill/billInfo/billInfo.js
const http = require('../../../../../utils/httpUtil.js')
const ry = require('../../../../../utils/util.js')

let billId = "";
let _this = {};
const errorImg = "http://file.ry600.com/defaultimg/files/Product/photo_s.jpg";

Page({
	data: {
		bill: {},
		loading: true,
		deadline: "------------"
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
					console.log(res.results[0].payModeName)
					let bill = res.results[0];
					if(bill.onLinePay){
						if(bill.payModeName.indexOf("endTime")){
							var end = bill.payModeName.split("endTime='")[1];
							if(end){
								end = end.split("'>")[0];
								if(end)
									_this.countDown(end);
							}
						}
						bill.payModeName = bill.payModeName.split("<span")[0];
					}
					_this.setData({
						bill: bill,
						loading: false
					});
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
	},
	countDown: function(end){
		end = new Date(end).getTime();  //最后支付期限
		function interval(){
			setTimeout(function(){
				var left = parseInt(end - new Date().getTime());  //剩余支付时间（毫秒数）
				var day = parseInt(left / 86400000),
					hour = parseInt(left / 3600000) % 24,
					min = parseInt(left / 60000) % 60,
					sec = parseInt(left / 1000) % 60;
				if(isNaN(day) || isNaN(hour) || isNaN(min) || isNaN(sec)){}else{
					_this.setData({
						deadline: "剩余支付时间：" + day + "天" + hour + "小时" + min + "分" + sec + "秒"
					});
				}
				interval();
			}, 1000);
		}
		interval();
	}
})