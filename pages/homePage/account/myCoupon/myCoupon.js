// pages/homePage/account/orderList/orderList.js
const http = require('../../../../utils/httpUtil.js')
const ry = require('../../../../utils/util.js')

Page({
	data: {
		tabs: ['未使用礼券', '已使用礼券', '过期礼券'],
		crrIndex: 0,
		items: [],
		state: 'noUse',
		crrItem: -1,
		all: {
			noUse: {coupons: [], load: false, page: 1, all: false},
			used: {coupons: [], load: false, page: 1, all: false},
			overdue: {coupons: [], load: false, page: 1, all: false}
		}
	},
	onLoad: function(){
		this.load('noUse', 1);
	},
	load: function(state, page){
		var all = this.data.all;
		var _this = this;
		if(all[state].load && page == 1){
			return false;
		}else{
			_this.getCoupons(state, page, function(res){
				var allState = 'all.' + state;
				_this.setData({
					[allState]: Object.assign(all[state], {coupons: res.results, load: true, page: page})
				});
			});
		}
	},
	getCoupons: function(state, page, callback){
		wx.showLoading();
		http.getHttp({
			action: 'VSShop.getMyCoupons',
			state: state,
			pgNum: page,
			limit: 10
		}, function(res, success){
			if(success){
				if(res.success){
					if(typeof(callback) == 'function'){
						callback(res);
					}
				}else{
					ry.alert(res.msg);
				}
				wx.hideLoading();
			}
		});
	},
	delItem: function(e){
		var _this = this;
		ry.confirm('你确定要将此商品从收藏夹中删除吗？', function(res){
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
							});
						}else{
							ry.alert(res.message);
						}
					}
				});
			}else{
				return false;
			}
		});
	},
	changeTab: function(e){
		var curr = e.currentTarget.dataset.index;
		var stateTemp = curr == 0 ? 'noUse' : (curr == 1 ? 'used' : 'overdue');
		this.setData({
			crrIndex: e.currentTarget.dataset.index,
			state: stateTemp,
			crrItem: -1
		});
		this.load(stateTemp, 1);
	},
	showDetail: function(e){
		var idx = e.currentTarget.dataset.index;
		idx = this.data.crrItem == idx ? -1 : idx;
		this.setData({
			crrItem: idx
		});
	},
	onReachBottom: function(){
		var _this = this;
		var st = this.data.state;
		var all = this.data.all;
		if(all[st].all){
			return false;
		}else{
			this.getCoupons(st, all[st].page + 1, function(res){
				var allStatePg = 'all.' + st + '.page';
				var allStateCoupons = 'all.' + st + '.coupons';
				_this.setData({
					[allStatePg]: all[st].page + 1,
					[allStateCoupons]: _this.data.all[st].coupons.concat(res.results)
				});
				if(!res.results.length && res.totals){
					// all[st].all = true;
					var allStateAll = 'all.' + st + '.all';
					_this.setData({
						[allStateAll]: true
					});
				}
			});
		}
	}
})