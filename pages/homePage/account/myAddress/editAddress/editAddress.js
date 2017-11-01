// pages/homePage/account/myAddress/editAddress/editAddress.js
const http = require('../../../../../utils/httpUtil.js');

Page({
	data: {
		addressId: '',
		ad: {},
		loading: true,
		region: []
	},
	onLoad: function(options){
		// this.initAddress();
		var _this = this;
		if(options.addressId){
			_this.setData({
				addressId: options.addressId
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
		http.postHttp({
			action: 'VSShop.saveAddress',
			addressDS: JSON.stringify(_ad)
		}, function(res, success){
			if(success){
				if(res.success){
					wx.showToast({
						title: '保存成功',
						duration: 800,
						complete: function(){
							wx.redirectTo({
								url: '../myAddress',
							})
						}
					});
				}
			}
		});
	}
})