// pages/homePage/account/orderList/orderList.js
const http = require('../../../../utils/httpUtil.js')
Page({
	data: {
		tabs: ['收藏商品', '全部收藏'],
		crrIndex: 0,
		items: []
	},
	onLoad: function(){
		this.load();
	},
	load: function(){
		var _this = this;
		http.getHttp({
			action: 'VSCommon.getUserFavorites',
			url: '/_user/favorite.shtml',
			pgNum: 0,
			limit: 20,
			markType: 'ALL'
		}, function(res, success){
			if(success){
				if(res.success){
					_this.setData({
						items: res.results[0].results
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
		this.setData({
			crrIndex: e.currentTarget.dataset.index
		});
	}
})