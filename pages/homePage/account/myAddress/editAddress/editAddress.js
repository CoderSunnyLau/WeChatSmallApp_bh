// pages/homePage/account/myAddress/editAddress/editAddress.js
const http = require('../../../../../utils/httpUtil.js');

Page({
	data: {
		addressId: '',
		ad: {},
		loading: true,
		region: [],
		fix: false,
		pArr: [],
		cArr: ['请选择'],
		dArr: ['请选择'],
		zoneArr: [[],[],[]],
		zoneAllArr: [[], [], []],
		tTemp: null,
		zoneValue: [],
		zoneIndex: []
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
	getZones: function(pId, callback){
		var _this = this;
		http.getHttp({
			action: 'VSConfig.getZones',
			countryId: '0000000000000000',
			pId: pId
		}, function(res, success){
			if(success){
				if(res.success){
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
			var zone0 = 'zoneArr[' + 0 + ']';
			var val0 = 'zoneValue[' + 0 + ']';
			var all0 = 'zoneAllArr[' + 0 + ']';
			_this.setData({
				[zone0]: pArrTemp,
				[val0]: res.results[0].zoneName,
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
						var zone1 = 'zoneArr[' + 1 + ']';
						var val1 = 'zoneValue[' + 1 + ']';
						var all1 = 'zoneAllArr[' + 1 + ']';
						_this.setData({
							[zone1]: cArrTemp,
							[val1]: res.results[0].zoneName,
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
									var zone2 = 'zoneArr[' + 2 + ']';
									var val2 = 'zoneValue[' + 2 + ']';
									var all2 = 'zoneAllArr[' + 2 + ']';
									_this.setData({
										[zone2]: dArrTemp,
										[val2]: res.results[0].zoneName,
										[all2]: res.results
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
		clearTimeout(_this.data.tTemp);
		_this.setData({
			tTemp: setTimeout(function(){_this.timeoutFn(e);}, 300)
		});
	},
	timeoutFn: function(e){
		var _this = this;
		var col = e.detail.column;
		var val = e.detail.value;
		var colTemp = 'zoneValue[' + col + ']';
		var colIndex = 'zoneIndex[' + col + ']';
		this.setData({
			[colTemp]: _this.data.zoneArr[col][val],
			[colIndex]: val
		});
		if(col == 0){
			_this.setData({
				zoneIndex: [val, 0, 0]
			});
		}else if(col == 1){
			var lastTemp = 'zoneIndex[' + 2 + ']';
			_this.setData({
				[lastTemp]: 0
			});
		}
		console.log(_this.data.zoneIndex)
		if(col == 0){
			_this.setData({
				zoneIndex: [val, 0, 0]
			});
			_this.timeoutChangeFn(0, val, function(){
				_this.timeoutChangeFn(1, 0);
			});
		}else if(col == 1){
			var lastTemp = 'zoneIndex[' + 2 + ']';
			_this.setData({
				[lastTemp]: 0
			});
			_this.timeoutChangeFn(1, val);
		}
	},
	timeoutChangeFn: function(col, val, callback){
		var _this = this;
		_this.getZones(_this.data.zoneAllArr[col][val].zoneId, function(res, success){
			if(success){
				if(res.success){
					var colArrTemp = [];
					console.log(res)
					for(var i = 0; i < res.results.length; i++){
						colArrTemp.push(res.results[i].zoneName);
					}
					var zone = 'zoneArr[' + (col + 1) + ']';
					var val = 'zoneValue[' + (col + 1) + ']';
					var all = 'zoneAllArr[' + (col + 1) + ']';
					var index = 'zoneIndex[' + (col + 1) + ']';
					_this.setData({
						[zone]: colArrTemp,
						[val]: res.results[0].zoneName,
						[all]: res.results,
						[index]: 0
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
		})
	}
})