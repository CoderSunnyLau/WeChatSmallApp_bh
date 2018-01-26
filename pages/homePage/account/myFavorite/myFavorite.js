// pages/homePage/account/myFavorite/myFavorite.js
const http = require('../../../../utils/httpUtil.js');
const ry = require('../../../../utils/util.js');
var _this = {};
var page = 0;

Page({
	data: {
		tabs: ['收藏商品', '全部收藏'],
		crrIndex: 0,
		items: [],
		numFound: "--",
		all: false
	},
	onLoad: function(){
		_this = this;
		this.load(0);
	},
	load: function(_page){
		if(_this.data.all){
			return false;
		}
		ry.loading();
		http.getHttp({
			action: 'VSCommon.getUserFavorites',
			url: '/_user/favorite.shtml',
			pgNum: _page,
			limit: 20,
			markType: 'ALL'
		}, function(res, success){
			if(success){
				if(res.success){
					var rsItems = res.results[0].results;
					var itemsTemp = (_page < page || _page == 0) ? rsItems : _this.data.items.concat(rsItems);
					var lengthTemp = (_page == 0) ? 0 : -1;
					page = _page;
					_this.setData({
						items: itemsTemp,
						length: lengthTemp,
						numFound: res.results[0].numFound
					});
					if(!rsItems.length && _page){
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
										setTimeout(function () {
											page = 0;
											_this.setData({
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
	onReachBottom: function(e){
		var _page = page + 1;
		this.load(_page);
	}
})