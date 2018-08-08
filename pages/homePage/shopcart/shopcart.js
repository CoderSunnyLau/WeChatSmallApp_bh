// pages/shopcart/shopcart.js
const http = require('../../../utils/httpUtil.js');
const ry = require('../../../utils/util.js');
const user = wx.getStorageSync('userData');
var load = false;
var _this = {};

Page({
	data: {
		edit: false,
		isTouchMove: false,
		crrPdtIdx: '',
		startX: 0, //开始坐标
		startY: 0,
		blocks: [],
		selCount: 0,
		count: 1,
		loading: true,
		countInputTemp: 1,
		countFocusTemp: 1,
		giftEditIdx: '',
		giftsTemp: []
	},
	onLoad: function(){
		_this = this;
		this.loadShopcart(function(){
			load = true;
			_this.setData({loading:false});
			console.log(_this.data.blocks[0]);
		});
	},
	onShow: function(){
		if(load){this.loadShopcart()}
	},
	onPullDownRefresh: function(){
		this.loadShopcart(function(){
			wx.stopPullDownRefresh();
		});
	},
	loadShopcart: function(callback){
		var _data = this.data;
		http.getHttp({
			action: 'VSShop.getShopCart',
			widthReward: true,
			orgId: '',
			bizCenterId: '',
			onlyAmount: false
		}, function(res, success){
			if(success){
				if(res.success){
					let blocksTemp = [];
					for(let i = 0; i < res.results[0].blocks.length; i++){
						blocksTemp.push(res.results[0].blocks[i]);
					}
					console.log(blocksTemp)
					_this.setBlock(blocksTemp);
					_this.setData({
						// blocks: blocksTemp,
						selCount: res.results[0].selCount,
						count: res.results[0].count
					});
					if(callback){
						callback();
					}
				}else{
					ry.alert(res.message);
				}
			}
		});
	},
  	touchStart: function(e){
		if(e.changedTouches[0]){
			this.setData({
				startX: e.changedTouches[0].clientX,
				startY: e.changedTouches[0].clientY,
				isTouchMove: false,
				crrPdtIdx: ''
			});
		}
  	},
 	touchMove: function(e){
		if(e.changedTouches[0]){
			var startX = _this.data.startX,//起始X
				startY = _this.data.startY,//起始Y
				touchMoveX = e.changedTouches[0].clientX,//滑動變化坐標
				touchMoveY = e.changedTouches[0].clientY,//滑動變化坐標
			//滑動角度
			angle = _this.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
			if(Math.abs(angle) > 30) return;
			if(touchMoveX > startX){ //右滑
				this.setData({
					isTouchMove: false
				});
			}else{ //左滑
				this.setData({
					isTouchMove: true,
					crrPdtIdx: e.currentTarget.dataset.pdtidx
				});
			}
		}
	},
	/*
	 滑动角度
	 start 起点坐标
	 end 终点坐标
   	*/
	angle: function(start, end){
		var _X = end.X - start.X,
			_Y = end.Y - start.Y;
		return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
	},
	fixShopcart: function(e, params, callback){
		this.setData({
			crrPdtIdx: '',
			loading: true
		});
		var pdtidx = e.currentTarget.dataset.pdtidx,
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
			cartItem = {cartItemId: cartItemId}
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
				}else{
					ry.alert(res.message);
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
		var pdtidx = e.currentTarget.dataset.pdtidx,
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
				}else{
					ry.alert(res.message);
				}
			}
		});
	},
	countFocus: function(e){
		this.setData({
			countFocusTemp: e.detail.value
		});
	},
	countInput: function(e){
		var idxArr = e.currentTarget.dataset.pdtidx.split(',');
		var inputTemp = 'blocks[' + idxArr[0] + '].items[' + idxArr[1] + '].amount';
		this.setData({
			[inputTemp]: parseInt(e.detail.value)
		});
	},
	changeCount: function(e, method){
		var idxArr = e.currentTarget.dataset.pdtidx.split(','),
			method = e.currentTarget.dataset.changemethod,
			blockId = this.data.blocks[idxArr[0]].blockId,
			pdt = this.data.blocks[idxArr[0]].items[idxArr[1]],
			cartItemId = pdt.cartItemId,
			addUp, amount;
		var count = pdt.amount;
		var minOrder = pdt.package ? 0 : pdt.sku.minOrder;
		var modCount = pdt.package ? 0 : pdt.sku.modCount;
		var stock = pdt.package ? pdt.package.stockAmount : pdt.sku.stockTag.amount;
		switch(method){
			case 'input': addUp = false; amount = e.detail.value; count = amount; break;
			case 'sub': addUp = true; amount = -1; count = count + amount; break;
			case 'add': addUp = true; amount = 1; count = count + amount; break;
		}
		if(count > stock){
			ry.alert('库存不足，仅剩' + stock + (pdt.package ? '件' : pdt.sku.units));
			if(addUp){
				return;
			}else{
				addUp = false;
				amount = stock;
				if(stock){
					var amountTemp = 'blocks[' + idxArr[0] + '].items[' + idxArr[1] + '].amount';
					this.setData({
						[amountTemp]: stock
					});
				}
			}
		}
		if(!addUp && (amount == this.data.countFocusTemp)){
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
					}else{
						ry.alert(res.message);
					}
				}
			});
		}
	},
	clearShopcart: function(){
		ry.confirm('你确定要清空购物车吗？（此操作不可逆）', function(res){
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
						}else{
							ry.alert(res.message);
						}
					}
				});
			}else{
				return;
			}
		});
	},
	doEdit: function(){
		this.setData({
			edit: !this.data.edit
		});
	},
	editGift: function(e){
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
			ry.alert('最多可以选择' + maxGiftCount + '件商品');
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
					}else{
						ry.alert(res.message);
					}
				}
			});
		}
	},
	setBlock: function(blocks){
		for(var j = 0; j < blocks.length; j++){
			var block = blocks[j];
			if(block.rewards && block.rewards.length){
				for(var k = 0; k < block.rewards.length; k++){
					var reward = block.rewards[k],
						i = 0,
						hide = true,
						giftName = "";
					if((reward.ruleMode == 'present') || (reward.ruleMode == 'buy') || (reward.ruleMode == 'onePresent')){
						giftName = "gifts";
					}else if(reward.ruleMode=='stepPresent'){
						giftName = "giftPackages";
					}
					for(var gift in reward[giftName]){
						i = i + reward[giftName][gift].stockAmount;
					}
					if(i < reward.giftCount){
						hide = false;
					}
					blocks[j].rewards[k].i = i;
					blocks[j].rewards[k].hide = hide;
					console.log("i", reward)
				}
			}
		}
		console.log("blocks", blocks)
		_this.setData({
			blocks: blocks
		});
	},
	buy: function(e){
		var blk = _this.data.blocks[e.currentTarget.dataset.bid];
		var msg, msg2;
		for(var i = 0; i < blk.items.length; i++){
			var pdt = blk.items[i];
			var amt = pdt.amount;
			var stock = pdt.package ? pdt.package.stockAmount : pdt.sku.stockTag.amount;
			if(pdt.selected){
				if(amt > stock){
					msg = "部分商品库存不足，请您仔细核对商品数量。";
					break;
				}else if(!pdt.package && (amt % pdt.sku.modCount != 0)){
					msg = "部分商品不拆零销售，请您仔细核对商品数量。";
					break;
				}
				// 商品未達起訂量應該不可選擇。
				// else if(amt < pdt.sku.minOrder){
				// 	msg = "部分商品数量未达到起订量，请您仔细核对商品数量。";
				// 	break;
				// }
			}else{
				msg2 = "有部分商品未勾选，是否继续提交订单？";
			}
		}
		if(msg){
			ry.alert(msg);
			return;
		}else if(msg2){
			ry.confirm(msg2, function(res){
				if(res.cancel){
					return false;
				}else{
					wx.navigateTo({
						url: 'orderCheckout/orderCheckout?blockId=' + e.currentTarget.dataset.blockid,
					});
				}
			});
		}else{
			wx.navigateTo({
				url: 'orderCheckout/orderCheckout?blockId=' + e.currentTarget.dataset.blockid,
			});
		}
	}
})