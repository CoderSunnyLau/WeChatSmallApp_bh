// pages/homePage/account/orderList/orderList.js
const http = require('../../../../utils/httpUtil.js')
Page({
	data: {
		tabs: ['未使用礼券', '已使用礼券', '过期礼券'],
		crrIndex: 0,
		items: [],
		coupons: [],
		state: 'noUse',
		crrItem: -1
	},
	onLoad: function(){
		this.load('overdue');
	},
	load: function(state){
		var _this = this;
		http.getHttp({
			action: 'VSShop.getMyCoupons',
			state: state,
			pgNum: 0,
			limit: 20
		}, function(res, success){
			if(success){
				if(res.success){
					_this.setData({
						coupons: res.results
					});
				}
			}
		});
	},
	delItem: function(e){
		var _this = this;
		wx.showModal({
			title: '提示',
			content: '你确定要将此商品从收藏夹中删除吗？',
			success: function(res){
				if(res.confirm){
					http.postHttp({
						action: 'VSCommon.delFavorite',
						resType: 'ProductOfShop',
						resId: e.currentTarget.dataset.resid
					}, function(res, success){
						if(success){
							if(res.success){
								wx.showToast({
									title: '已删除',
									duration: 800,
									success: function(){
										setTimeout(function(){
											_this.load();
										}, 800);
									}
								})
							}
						}
					});
				}else{
					return false;
				}
			}
		})
	},
	changeTab: function(e){
		var curr = e.currentTarget.dataset.index;
		var stateTemp = curr == 0 ? 'noUse' : (curr == 1 ? 'used' : 'overdue');
		this.setData({
			coupons: [],
			crrIndex: e.currentTarget.dataset.index,
			state: stateTemp
		});
		this.load(stateTemp);
	},
	showDetail: function(e){
		var idx = e.currentTarget.dataset.index;
		idx = this.data.crrItem == idx ? -1 : idx;
		this.setData({
			crrItem: idx
		});
		console.log(idx)
	}
})