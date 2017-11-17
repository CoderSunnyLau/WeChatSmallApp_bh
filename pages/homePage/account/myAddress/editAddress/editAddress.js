// pages/homePage/account/myAddress/editAddress/editAddress.js
const http = require('../../../../../utils/httpUtil.js');
const ry = require('../../../../../utils/util.js');
var indexTemp = [0,0,0];
var zoneAllTemp = [];
var tTemp = null;
var animateTTemp = null;
var col = 0;
Page({
	data: {
		addressId: '',
		ad: {},
		loading: true,
		fix: false,
		zoneAllArr: [[], [], []],
		zoneIndex: [0, 0, 0],
		showZone: false,
		animationData: {},
		animationBg: {},
		animationBox: {}
	},
	onLoad: function(options){
		var _this = this;
		if(options.addressId){
			_this.setData({
				addressId: options.addressId,
				fix: true
			});
			http.getHttp({
				action: 'VSShop.getAddress',
				addressId: options.addressId
			}, function(res, success){
				if(success){
					if(res.success){
						_this.setData({
							ad: res.results[0],
							loading: false
						});
						_this.initZones();
					}else{
						ry.alert(res.message);
					}
				}
			});
		}else{
			_this.setData({
				loading: false
			});
			_this.initZones();
		}	
	},
	initZones: function(){
		var _this = this;
		var ad = this.data.ad;
		var cantonId, cityId, zoneId;
		var val = [];
		_this.getZones('', function(res, success){
			var pArrTemp = [];
			for(var i = 0; i < res.results.length; i++){
				pArrTemp.push(res.results[i].zoneName);
			}
			var all0 = 'zoneAllArr[' + 0 + ']';
			_this.setData({
				[all0]: res.results
			});

			//city
			if(ad.cantonId){
				cantonId = ad.cantonId;
				val[0] = pArrTemp.indexOf(ad.canton);
			}else{
				cantonId = res.results[0].zoneId;
				val[0] = 0;
			}
			_this.getZones(cantonId, function(res, success){
				if(success){
					if(res.success){
						var cArrTemp = [];
						for(var i = 0; i < res.results.length; i++){
							cArrTemp.push(res.results[i].zoneName);
						}
						var all1 = 'zoneAllArr[' + 1 + ']';
						_this.setData({
							[all1]: res.results
						});

						//dxx
						if(ad.city){
							cityId = ad.cityId;
							val[1] = cArrTemp.indexOf(ad.city);
						}else{
							cityId = res.results[0].zoneId;
							val[1] = 0;
						}
						_this.getZones(cityId, function (res, success){
							if(success){
								if(res.success){
									var dArrTemp = [];
									for(var i = 0; i < res.results.length; i++){
										dArrTemp.push(res.results[i].zoneName);
									}
									if(ad.county){
										val[2] = dArrTemp.indexOf(ad.county);
									}else{
										val[2] = 0;
									}
									var all2 = 'zoneAllArr[' + 2 + ']';
									var p = 'ad.canton';
									var c = 'ad.city';
									var d = 'ad.county';
									try{
										_this.setData({
											[all2]: res.results,
											[p]: _this.data.zoneAllArr[0][val[0]].zoneName,
											[c]: _this.data.zoneAllArr[1][val[1]].zoneName,
											[d]: res.results[val[2]].zoneName
										});
										_this.setData({
											zoneIndex: val
										});
									}catch(e){
										console.log(e);
									}
								}
							}
						});
					}
				}
			});
		});
	},
	zoneChange: function(e){
		var _this = this;
		clearTimeout(tTemp);
		tTemp = setTimeout(function(){_this.timeoutFn(e);}, 100);
	},
	timeoutFn: function(e){
		var _this = this;
		var val = e.detail.value;
		var _idx = this.data.zoneIndex;
		if(val[0] != _idx[0]){
			col = 0;
			// Province is changed
			_this.setData({
				zoneIndex: [val[0], 0, 0]
			});
			_this.timeoutChangeFn(col, val[col], function(){
				_this.timeoutChangeFn(col + 1, 0, function(){});
			});
		}else if(val[1] != _idx[1]){
			// City is changed
			_this.setData({
				zoneIndex: [val[0], val[1], 0]
			});
			col = 1;
			_this.timeoutChangeFn(col, val[col], function(){});
		}else if(val[2] != _idx[2]){
			// D is changed
			col = 2;
			_this.setData({
				zoneIndex: [val[0], val[1], val[2]]
			});
		}
		_idx = _this.data.zoneIndex.concat();
	},
	timeoutChangeFn: function(col, val, callback){
		var _this = this;
		_this.getZones(_this.data.zoneAllArr[col][val].zoneId, function(res, success){
			if(success){
				if(res.success){
					var colTemp = 'zoneAllArr[' + (col + 1) + ']';
					var idxTemp = 'zoneValue[' + (col + 1) + ']';
					_this.setData({
						[colTemp]: res.results,
						[idxTemp]: 0
					});
					if(typeof(callback) == 'function'){
						callback();
					}
				}
			}
		});
	},
	getZones: function(pId, callback){
		var _this = this;
		http.getHttp({
			action: 'VSConfig.getZones',
			countryId: '0000000000000000',
			pId: pId
		}, function(res, success){
			if(success){
				if(res.success){
					if(typeof (callback) == 'function'){callback(res, success);}
				}
			}
		});
	},
	inputFn: function(e){
		var fieldTemp = e.currentTarget.dataset.field;
		this.setData({
			[fieldTemp]: e.detail.value
		});
	},
	saveAddress: function(){
		var _this = this;
		var ad = this.data.ad;
		var msg = '';
		if(!ad.consignee){
			msg = '请输入收货人姓名';
		}else if(!ad.mobile){
			msg = '请输入收货人手机号码';
		}else if(!ad.canton || !ad.city || !ad.county){
			msg = '请选择所在地区';
		}else if(!ad.address){
			msg = '请输入详细地址';
		}
		if(msg){
			ry.alert(msg);
			return false;
		}
		_this.setData({
			loading: true
		});
		http.postHttp({
			action: 'VSShop.saveAddress',
			addressDS: JSON.stringify(ad)
		}, function(res, success){
			if(success){
				if(res.success){
					_this.setData({
						loading: false
					});
					wx.showToast({
						title: '保存成功',
						duration: 800,
						complete: function(){
							setTimeout(function(){
								wx.navigateBack({
									url: '../myAddress',
								});
							}, 800);
						}
					});
				}else{
					ry.alert(res.message);
				}
			}
		});
	},
	delAddress: function(){
		var _this = this;
		ry.confirm('您确定要删除此收货地址吗？', function(res){
			if(res.confirm){
				_this.setData({
					loading: true
				});
				http.postHttp({
					action: 'VSShop.delAddress',
					addressId: _this.data.addressId
				}, function(res, success){
					if(success){
						if(res.success){
							_this.setData({
								loading: false
							});
							wx.showToast({
								title: '删除成功',
								duration: 800,
								complete: function(){
									setTimeout(function(){
										wx.navigateBack({
											url: '../myAddress',
										});
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
	selZone: function(){
		indexTemp = this.data.zoneIndex.concat();
		zoneAllTemp = this.data.zoneAllArr.concat();
		this.setData({
			showZone: true
		});
		this.animationIn();
	},
	cancelSelZone: function(){
		this.setData({
			zoneIndex: indexTemp.concat(),
			zoneAllArr: zoneAllTemp.concat()
		});
		this.animationOut();
	},
	confirmSelZone: function(){
		clearTimeout(tTemp);
		var p = 'ad.canton', c = 'ad.city', d = 'ad.county';
		var pi = 'ad.cantonId', ci = 'ad.cityId', di = 'ad.zoneId';
		var all = this.data.zoneAllArr, idx = this.data.zoneIndex;
		this.setData({
			[p]: all[0][idx[0]].zoneName,
			[c]: all[1][idx[1]].zoneName,
			[d]: all[2][idx[2]].zoneName,
			[pi]: all[0][idx[0]].zoneId,
			[ci]: all[1][idx[1]].zoneId,
			[di]: all[2][idx[2]].zoneId
		});
		this.animationOut();
	},
	animationIn: function(){
		clearTimeout(animateTTemp);
		//上滑进入
		var up = wx.createAnimation({
			duration: 200
		});
		up.bottom(0).step();
		//淡入
		var fadeIn = wx.createAnimation({
			duration: 200
		});
		fadeIn.opacity(0.5).step();
		this.setData({
			animationBox: up.export(),
			animationBg: fadeIn.export()
		});
	},
	animationOut: function(){
		clearTimeout(animateTTemp);
		var _this = this;
		//下滑出
		var down = wx.createAnimation({
			duration: 200
		});
		down.bottom(-600 + 'rpx').step();
		//淡出
		var fadeOut = wx.createAnimation({
			duration: 200
		});
		fadeOut.opacity(0).step();
		this.setData({
			animationBox: down.export(),
			animationBg: fadeOut.export()
		});
		animateTTemp = setTimeout(function(){
			_this.setData({
				showZone: false
			});
		}, 250);
	}
})