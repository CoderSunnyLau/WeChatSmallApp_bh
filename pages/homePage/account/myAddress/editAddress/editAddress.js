// pages/homePage/account/myAddress/editAddress/editAddress.js
const http = require('../../../../../utils/httpUtil.js');
var index = [0,0,0];
var tTemp = null;
var col = 0;
Page({
	data: {
		addressId: '',
		ad: {},
		loading: true,
		region: [],
		fix: false,
		zoneArr: [[], [], []],
		zoneAllArr: [[], [], []],
		zoneIndex: [0, 0, 0],
		showZone: true,
		finished: false
	},
	clickFn: function(){
		this.setData({
			click: true
		});
	},
	onLoad: function(options){
		this.initZones();
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
					}
				}
			});
		}else{
			_this.setData({
				loading: false
			});
		}
	},
	selZone: function(){
		this.setData({
			showZone: true
		});
		var _this = this;
		setTimeout(function(){
			_this.setData({
				click: true
			})
		}, 500);
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
					if(typeof(callback) == 'function')
						callback(res, success);
				}
			}
		});
	},
	initZones: function(){
		var _this = this;
		_this.getZones('', function(res, success){
			var pArrTemp = [];
			for(var i = 0; i < res.results.length; i++){
				pArrTemp.push(res.results[i].zoneName);
			}
			var all0 = 'zoneAllArr[' + 0 + ']';
			_this.setData({
				[all0]: res.results
			});
			console.log(_this.data)

			//city
			_this.getZones(res.results[0].zoneId, function(res, success){
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
						_this.getZones(res.results[0].zoneId, function(res, success){
							if(success){
								if(res.success){
									var dArrTemp = [];
									for(var i = 0; i < res.results.length; i++){
										dArrTemp.push(res.results[i].zoneName);
									}
									var all2 = 'zoneAllArr[' + 2 + ']';
									var p = 'ad.canton';
									var c = 'ad.city';
									var d = 'ad.county';
									_this.setData({
										[all2]: res.results,
										[p]: _this.data.zoneAllArr[0][0].zoneName,
										[c]: _this.data.zoneAllArr[1][0].zoneName,
										[d]: res.results[0].zoneName
									});
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
		if(val[0] != index[0]){
			col = 0;
			// Province is changed
			_this.setData({
				zoneIndex: [val[0], 0, 0]
			});
			_this.timeoutChangeFn(col, val[col], function(){
				_this.timeoutChangeFn(col + 1, 0, function(){});
			});
		}else if(val[1] != index[1]){
			// City is changed
			_this.setData({
				zoneIndex: [val[0], val[1], 0]
			});
			col = 1;
			_this.timeoutChangeFn(col, val[col], function(){});
		}else if(val[2] != index[2]){
			// D is changed
			col = 2;
			_this.setData({
				zoneIndex: [val[0], val[1], val[2]]
			});
		}
		index = val;
		console.log(val)
		console.log(this.data)
	},
	timeoutChangeFn: function(col, val, callback){
		var _this = this;
		_this.getZones(_this.data.zoneAllArr[col][val].zoneId, function(res, success){
			if(success){
				if(res.success){
					var colTemp = 'zoneAllArr[' + (col + 1) + ']';
					_this.setData({
						[colTemp]: res.results
					});
					if(typeof(callback) == 'function'){
						callback();
					}
				}
			}
		});
	},
	bindRegionChange: function(e){
		var pTemp = 'ad.canton', cTemp = 'ad.city', dTemp = 'ad.county'
		this.setData({
			region: e.detail.value,
			[pTemp]: e.detail.value[0],
			[cTemp]: e.detail.value[1],
			[dTemp]: e.detail.value[2]
		});
		console.log(this.data)
	},
	inputFn: function(e){
		var fieldTemp = e.currentTarget.dataset.field;
		this.setData({
			[fieldTemp]: e.detail.value
		});
	},
	saveAddress: function(){
		var _this = this;
		var _ad = this.data.ad;
		var msg = '';
		if(!_ad.consignee){
			msg = '请输入收货人姓名';
		}else if(!_ad.mobile){
			msg = '请输入收货人手机号码';
		}else if(!_this.data.region){
			msg = '请选择所在区域';
		}else if(!_ad.address){
			msg = '请输入详细地址';
		}
		if(msg){
			wx.showModal({
				title: '提示',
				content: msg,
				showCancel: false
			});
			return false;
		}
		_this.setData({
			loading: true
		});
		http.postHttp({
			action: 'VSShop.saveAddress',
			addressDS: JSON.stringify(_ad)
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
				}
			}
		});
	},
	delAddress: function(){
		var _this = this;
		wx.showModal({
			title: '提示',
			content: '您确定要删除此收货地址吗？',
			success: function(res){
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
							}
						}
					});
				}else{
					return false;
				}
			}
		});
	},
	cancelSelZone: function(){
		this.setData({
			showZone: false
		});
	},
	confirmSelZone: function(){
		clearTimeout(tTemp);
		var _this = this;
		var p = 'ad.canton';
		var c = 'ad.city';
		var d = 'ad.county';
		_this.setData({
			[p]: _this.data.zoneAllArr[0][_this.data.zoneIndex[0]].zoneName,
			[c]: _this.data.zoneAllArr[1][_this.data.zoneIndex[1]].zoneName,
			[d]: _this.data.zoneAllArr[2][_this.data.zoneIndex[2]].zoneName,
			showZone: false
		});
		console.log(_this.data)
	}
})