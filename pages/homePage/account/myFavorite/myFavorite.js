// pages/homePage/account/orderList/orderList.js
const http = require('../../../../utils/httpUtil.js');
const ry = require('../../../../utils/util.js');
var _this = {};

Page({
	data: {
		tabs: ['收藏商品', '全部收藏'],
		crrIndex: 0,
		items: [],
		page: 0,
		length: -1,
		all: false
	},
	onLoad: function(){
		_this = this;
		this.load(0);
		// console.log(_this.data);
		wx.createSelectorQuery().select('#blank').boundingClientRect(function(rect){
			console.log(rect)
		});
		wx.getSystemInfo({
			success: function(res) {
				_this.setData({
					height: res.screenHeight - 68
				});
			},
		});
	},
	load: function(page){
		if(_this.data.all){
			return false;
		}
		ry.loading();
		http.getHttp({
			action: 'VSCommon.getUserFavorites',
			url: '/_user/favorite.shtml',
			pgNum: page,
			limit: 5,
			markType: 'ALL'
		}, function(res, success){
			if(success){
				if(res.success){
					var rsItems = res.results[0].results;
					var itemsTemp = (page < _this.data.page || page == 0) ? rsItems : _this.data.items.concat(rsItems);
					var lengthTemp = (page == 0) ? 0 : -1;
					_this.setData({
						items: itemsTemp,
						page: page,
						length: lengthTemp
					});
					if(!rsItems.length && page){
						_this.setData({
							all: true
						});
					}
				}else{
					ry.alert(res.message);
				}
			}
			wx.hideLoading();
		});
	},
	delItem: function(e){
		var fIdx = e.currentTarget.dataset.idx;
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
											_this.setData({
												page: 0,
												all: false
											});
											_this.load(0);
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
			}
		})
	},
	changeTab: function(e){
		this.setData({
			crrIndex: e.currentTarget.dataset.index
		});
	},
	loadMore: function(e){
		var page = _this.data.page + 1;
		console.log(page)
		this.load(page);
	}
})