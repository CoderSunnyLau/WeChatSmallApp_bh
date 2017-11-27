const app = getApp()
const httpUtil = require('../../utils/httpUtil.js')
var _msgData
var orgArr
var radioIdx

Page({
	data: {
		orgArr: [],
		isOrg: true,
		isCooperate: true,
		radioSelect: 0
	},
	onLoad: function (options) {
		var that = this
		orgArr = []
		if(options.orgData){
			_msgData = JSON.parse(options.orgData)
		}

		if (options.isOrg == 'true') {
			for (let i = 0; i < _msgData.orgs.length; i++) {
				orgArr.push(_msgData.orgs[i].orgName)
			}
			that.setData({
				isOrg: true,
				orgName: '选择机构',
				orgArr: orgArr
			})
		}
		else {
			let _userData = wx.getStorageSync('userData')
			let _header = httpUtil.getHeader()
			_header.cookie = _header.cookie + ',_relOrgId=' + _userData.orgId
			httpUtil.saveHeader(_header.cookie)

			httpUtil.getHttp({
				action: 'VSShop.getRelStores',
			}, function (callback, success) {
				//console.log(callback)
				if (success) {
					if (callback.success) {
						_userData.orgsArr = _msgData.orgs
						_userData.storesArr = callback.results
						wx.setStorageSync('userData', _userData)
						if(callback.results.length > 0){
							that.setData({
								isCooperate: true,
								relOrgArr: callback.results
							})
						}
						else{
							that.setData({
								isCooperate: false
							})
						}
					}
					else {
						that.setData({
							isCooperate: false
						})
					}
				}
			})
			that.setData({
				isOrg: false,
				orgName: '选择供应商'
			})
		}
	},
	submitOrg: function () {
		var that = this
		if (that.data.isOrg) {
			let httpPromise = new Promise(function (resolve, reject) {
				httpUtil.getHttp({
					action: 'VSUser.changeRelOrg',
					orgId: _msgData.orgs[radioIdx].orgId
				}, function (callback, success) {
					if (success) {
						let _userData = wx.getStorageSync('userData')
						_userData.orgName = _msgData.orgs[radioIdx].orgName
						_userData.orgId = _msgData.orgs[radioIdx].orgId

						wx.setStorageSync('userData', _userData)
						resolve()
					}
				})
			})
			httpPromise.then(function (val) {
				wx.navigateTo({
					url: 'select?isOrg=false'
				})
			})
		}
		else {
			let _userData = wx.getStorageSync('userData')
			_userData.bizCenterId = that.data.relOrgArr[radioIdx].bizCenterId
			_userData.storeName = that.data.relOrgArr[radioIdx].storeName
			_userData.storeOrgId = that.data.relOrgArr[radioIdx].storeOrgId
			_userData.storeCode = that.data.relOrgArr[radioIdx].storeCode

			wx.setStorageSync('userData', _userData)
			wx.switchTab({
				url: '/pages/homePage/home/home'
			})
		}
	},
	selectOrg: function (e) {

		radioIdx = e.currentTarget.dataset.idx

		this.setData({
			radioSelect: radioIdx
		})
	},
	logout: function () {
		wx.request({
			url: 'http://bh.ry600.com/userLogout.action',
			method: 'GET',
			header: httpUtil.getHeader(),
			success: function (res) {
				console.log(res);
				console.log(2)
			},
			fail: function (res) {
				console.log(res)
				console.log(1)
			}
		});
		var userData = wx.getStorageSync('userData');
		userData.autoLogin = 'false';
		wx.setStorage({
			key: 'userData',
			data: userData,
			success: function (res) {
				wx.reLaunch({
					url: '/pages/loginPage/login/login',
				});
			}
		});
	},
	onShow: function(){
		radioIdx = 0
		this.setData({
			radioSelect: 0
		})
	}
})