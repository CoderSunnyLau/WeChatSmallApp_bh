// pages/homePage/account/orderList/orderList.js
const http = require('../../../../utils/httpUtil.js')
const ry = require('../../../../utils/util.js')
let _this = {};
let searchCnt = "";
let bTime = 0, aTime;
let bTop = 0, aTop;
let searchBarHeight = 0;
Page({
	data: {
		crrIndex: 0,
		bills: [{state: "全部订单", list: []}, {state: "待付款"}, {state: "待收货"}, {state:"已完成"},{state:"已取消"}],
		showSearchBar: true
	},
	onLoad: function(){
		_this = this;
        var query = wx.createSelectorQuery()
        query.select('#search_bar').boundingClientRect();
        query.exec(function (res) {
            searchBarHeight = res[0].height;
        });
		this.getBills();
	},
	changeTab: function(e){
		this.setData({
			crrIndex: e.currentTarget.dataset.index
		});
	},
	getBills: function(searchCnt, pgNum, state){
		ry.loading();
		http.getHttp({
			action: 'VSShop.getMyBills',
			pgNum: pgNum || 0,
			limit: 5,
			searchBillId: searchCnt || "",
			bbState: state || ""
		}, function(res, success){
			wx.hideLoading();
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
	},
	searchInput: function(e){
		searchCnt = e.detail.value;
	},
	searchBill: function(){
		_this.getBills(searchCnt);
	},
	scroll: function(e){
        aTime = e.timeStamp;
        if (aTime - bTime > 200){
            bTime = aTime;
			_this.scrollFn(e);
		}
	},
	scrollFn: function(e){
        aTop = e.detail.scrollTop;
        if(bTop > aTop){
            _this.setData({
                showSearchBar: true
            });
        }else if(e.detail.scrollTop >= searchBarHeight){
            _this.setData({
                showSearchBar: false
            });
        }
        bTop = aTop;
	}
})