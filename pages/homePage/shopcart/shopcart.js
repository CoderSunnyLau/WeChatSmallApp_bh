// pages/shopcart/shopcart.js
const http = require('../../../utils/httpUtil.js')

Page({
	data: {
		edit: false,
		isTouchMove: false,
		crrPdtIdx: '',
		startX: 0, //开始坐标
		startY: 0,
		storeName: '样板展示平台',
		blocks: [],
		selCount: 0,
		count: 1,
		loading: false,
		countInputTemp: 1,
		countFocusTemp: 1,
		giftEditIdx: '',
		giftsTemp: []
	},
	onLoad: function(){this.loadShopcart()},
	onShow: function(){this.loadShopcart()},
	onPullDownRefresh: function(){
		this.loadShopcart(function(){
			wx.stopPullDownRefresh();
		});
	},
	loadShopcart: function(callback){
		const _this = this;
		const _data = this.data;
		http.getHttp({
			action: 'VSShop.getShopCart',
			widthReward: true,
			orgId: '',
			bizCenterId: '',
			onlyAmount: false
		}, function(res, success){
			if(success && res.success){
				let blocksTemp = [];
				for(let i = 0; i < res.results[0].blocks.length; i++){
					blocksTemp.push(res.results[0].blocks[i]);
				}
				_this.setData({
					blocks: blocksTemp,
					selCount: res.results[0].selCount,
					count: res.results[0].count
				});
				if(callback){
					callback();
				}
			}else{
				var msg = success ? res.message : '网络错误';
				wx.showModal({
					title: '提示',
					content: msg,
					showCancel: false,
					success: function(res){
						if(res.confirm){
							wx.redirectTo({
								url: '../../loginPage/login/login',
							})
						}
					}
				});
			}
		});
	},
  	touchStart: function(e){
      	this.setData({
			startX: e.changedTouches[0].clientX,
			startY: e.changedTouches[0].clientY,
			isTouchMove: false,
			crrPdtIdx: ''
		});
  	},
 	touchMove: function (e) {
    	var _this = this,
			startX = _this.data.startX,//起始X
			startY = _this.data.startY,//起始Y
     		touchMoveX = e.changedTouches[0].clientX,//滑動變化坐標
			touchMoveY = e.changedTouches[0].clientY,//滑動變化坐標
      	//滑動角度
		angle = _this.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
		if (Math.abs(angle) > 30) return;
		if (touchMoveX > startX) { //右滑
			this.setData({
				isTouchMove: false
			});
		} else { //左滑
			this.setData({
				isTouchMove: true,
				crrPdtIdx: e.currentTarget.dataset.pdtidx
			});
		}
	},
	/**
	 * 计算滑动角度
	 * @param {Object} start 起点坐标
	 * @param {Object} end 终点坐标
   	*/
	angle: function (start, end) {
		var _X = end.X - start.X,
			_Y = end.Y - start.Y;
		return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
	},
	fixShopcart: function (e, params, callback) {
		this.setData({
			crrPdtIdx: '',
			loading: true
		});
		var _this = this,
			pdtidx = e.currentTarget.dataset.pdtidx,
			blockidx = e.currentTarget.dataset.blockidx,
			cartItem = {},
			blockId,
			cartItemId;
		if(pdtidx){
			blockId = _this.data.blocks[pdtidx.split(',')[0]].blockId;
			cartItemId = _this.data.blocks[pdtidx.split(',')[0]].items[pdtidx.split(',')[1]].cartItemId;
		}else if(typeof(blockidx) == 'number'){
			blockId = _this.data.blocks[blockidx].blockId;
			cartItemId = 'All';
		}else if(typeof(blockidx) == 'string'){
			blockId = blockidx;
		}
		if(cartItemId){
			cartItem = {
				cartItemId: cartItemId
			}
		}
		var postData = Object.assign({
			widthReward: true,
			blockId: blockId
		}, params, cartItem);
		http.postHttp(postData, function(res, success){
			if(success){
				if(res.success){
					console.log(res)
					_this.setData({
						loading: false,
						blocks: res.results[0].blocks,
						selCount: res.results[0].selCount,
						count: res.results[0].count
					});
					if(callback){
						callback();
					}
				}
			}
		});
	},
	selPdt: function(e){
		this.fixShopcart(e, {
			action: 'VSShop.selectProduct',
			selected: !e.currentTarget.dataset.selected
		});
	},
	delPdt: function(e){
		this.fixShopcart(e, {
			action: 'VSShop.delProduct',
			selected: !e.currentTarget.dataset.selected
		});
  	},
	collectPdt: function(e){
		var _this = this,
			pdtidx = e.currentTarget.dataset.pdtidx,
			shopProductId = _this.data.blocks[pdtidx.split(',')[0]].items[pdtidx.split(',')[1]].sku.shopProductId,
			pdtTitle = _this.data.blocks[pdtidx.split(',')[0]].items[pdtidx.split(',')[1]].sku.productCaption;
		this.setData({
			crrPdtIdx: '',
			loading: true
		});
		http.postHttp({
			action: 'VSCommon.addFavorite',
			resType: 'ProductOfShop',
			resId: shopProductId,
			resName: pdtTitle,
			url: '/_shop/product-' + shopProductId + '.shtml'
		}, function(res, success){
			if(success){
				if(res.success){
					_this.setData({
						loading: false
					});
					wx.showToast({
						title: '已收藏',
						icon: 'success',
						duration: 800
					});
				}
			}
		});
	},
	countFocus: function(e){
		var _this = this;
		this.setData({
			countFocusTemp: e.detail.value
		});
	},
	countInput: function (e) {
		var idxArr = e.currentTarget.dataset.pdtidx.split(',');
		var inputTemp = 'blocks[' + idxArr[0] + '].items[' + idxArr[1] + '].amount';
		this.setData({
			[inputTemp]: e.detail.value
		});
	},
	changeCount: function (e, method) {
		var _this = this,
			idxArr = e.currentTarget.dataset.pdtidx.split(','),
			method = e.currentTarget.dataset.changemethod,
			blockId = this.data.blocks[idxArr[0]].blockId,
			cartItemId = this.data.blocks[idxArr[0]].items[idxArr[1]].cartItemId,
			addUp, amount;
		switch(method){
			case 'input': addUp = false; amount = e.detail.value; break;
			case 'sub': addUp = true; amount = -1; break;
			case 'add': addUp = true; amount = 1; break;
		}
		if (!addUp && (amount == this.data.countFocusTemp)){
			return;
		}else{
			_this.setData({
				loading: true
			});
			http.postHttp({
				action: 'VSShop.updateAmount',
				widthReward: true,
				blockId: blockId,
				cartItemId: cartItemId,
				addUp: addUp,
				amount: amount
			}, function(res, success){
				if(success){
					if(res.success){
						_this.setData({
							loading: false,
							blocks: res.results[0].blocks
						});
					}
				}
			});
		}
	},
	clearShopcart: function(){
		var _this = this;
		wx.showModal({
			title: '提示',
			content: '你确定要清空购物车吗？（此操作不可逆）',
			success: function(res){
				if(res.confirm){
					_this.setData({
						loading: true
					});
					http.postHttp({
						action: 'VSShop.removeAll',
						widthReward: false,
						orgId: '',
						bizCenterId: ''
					}, function(res, success){
						if(success){
							if(res.success){
								_this.setData({
									loading: false,
									blocks: res.results[0].blocks,
									edit: false
								});
								console.log(res);
							}
						}
					});
				}else{
					return;
				}
			}
		});
	},
	doEdit: function(){
		this.setData({
			edit: !this.data.edit
		});
	},
	editGift: function (e) {
		var _this = this;
		var idxArr = e.currentTarget.dataset.pdtidx.split(',');
		if(this.data.giftEditIdx == e.currentTarget.dataset.pdtidx){
			var thisGifts = 'blocks[' + idxArr[0] + '].items[' + idxArr[1] + '].rewards[0].gifts';
			var thisGiftsTemp = _this.data.giftsTemp;
			this.setData({
				[thisGifts]: thisGiftsTemp,
				giftEditIdx: '',
				giftsTemp: []
			});
		}else{
			this.setData({
				giftsTemp: _this.data.blocks[idxArr[0]].items[idxArr[1]].rewards[0].gifts,
				giftEditIdx: e.currentTarget.dataset.pdtidx
			});
		}
	},
	selGift: function(e){
		var idxArr = e.currentTarget.dataset.pdtidx.split(',');
		var giftIdx = e.currentTarget.dataset.giftidx;
		var giftAmountTemp = 'blocks[' + idxArr[0] + '].items[' + idxArr[1] + '].rewards[0].gifts[' + giftIdx + '].amount';
		if(e.currentTarget.dataset.selected){
			this.setData({
				[giftAmountTemp]: 0
			});
		}else{
			this.setData({
				[giftAmountTemp]: 1
			});
		}
	},
	giftAmountInput: function(e){
		var idxArr = e.currentTarget.dataset.pdtidx.split(',');
		var giftIdx = e.currentTarget.dataset.giftidx;
		var giftAmountTemp = 'blocks[' + idxArr[0] + '].items[' + idxArr[1] + '].rewards[0].gifts[' + giftIdx + '].amount';
		this.setData({
			[giftAmountTemp]: e.detail.value
		});
	},
	changeGift: function(e){
		var _this = this;
		var idxArr = e.currentTarget.dataset.pdtidx.split(',');
		var giftCount = 0;
		var selGifts = [];
		var maxGiftCount = _this.data.blocks[idxArr[0]].items[idxArr[1]].rewards[0].giftCount;
		var gifts = _this.data.blocks[idxArr[0]].items[idxArr[1]].rewards[0].gifts;
		var thisRewards = 'blocks[' + idxArr[0] + '].items[' + idxArr[1] + '].rewards';
		for(var i = 0; i < gifts.length; i++){
			var gift = gifts[i];
			giftCount = giftCount + parseInt(gift.amount);
			if(gift.amount != 0){
				selGifts.push({cartItemId: gift.cartItemId, amount: String(gift.amount)});
			}
		}
		if(giftCount > maxGiftCount){
			wx.showModal({
				title: '提示',
				content: '最多可以选择' + maxGiftCount + '件商品',
				showCancel: false
			});
		}else{
			_this.setData({
				loading: true
			});
			console.log(selGifts);
			http.postHttp({
				action: 'VSShop.selectRewardItems',
				widthReward: true,
				rewardId: e.currentTarget.dataset.rewardid,
				rewardItemDS: '{records:' + JSON.stringify(selGifts) + '}',
				blockId: _this.data.blocks[idxArr[0]].blockId
			}, function(res, success){
				if(success){
					if(res.success){
						console.log(res);
						_this.setData({
							giftEditIdx: '',
							[thisRewards]: res.results[0].blocks[idxArr[0]].items[idxArr[1]].rewards,
							loading: false
						});
					}
				}
			});
		}
	},
	buy: function(e){
		wx.navigateTo({
			url: 'orderCheckout/orderCheckout?blockId=' + e.currentTarget.dataset.blockid,
		});
	}
})