const httpUtil = require('../../utils/httpUtil.js')
var _userData
var _page

Component({
	properties: {},
	data: {
		radioSelect: 0
	},
	attached: function () {
		_userData = wx.getStorageSync('userData')
		_page = getCurrentPages()[0].route

		this.setData({
			storeName: _userData.storeName,
			orgName: _userData.orgName
		})
	},
	methods: {
		showOrg: function (e) {
			console.log(_userData)
			let that = this
			let _orgArr = []
			for (let i = 0; i < _userData.orgsArr.length; i++) {
				_orgArr.push(_userData.orgsArr[i].orgName)
			}
			that.setData({
				isOrg: true,
				drawerTitle: '当前机构选择',
				orgArr: _orgArr
			})
			that.powerDrawer(e)
		},
		showStores: function (e) {
			let that = this

			that.setData({
				isOrg: false,
				drawerTitle: '我的供应商',
				storesArr: _userData.storesArr
			})
			// if(that.data.storesArr.length > 0){
				that.powerDrawer(e)
			// }
			// else{
			// 	wx.showModal({
			// 		title: '提示',
			// 		content: '当前机构没有更多的供应商选择',
			// 		showCancel: false
			// 	})
			// }
		},
		selectOrg: function (e) {
			this.setData({
				radioSelect: e.currentTarget.dataset.idx
			})
		},
		changeOrg: function (e) {
			let idx = this.data.radioSelect
			let that = this
			if(that.data.isOrg){
				_userData.orgName = _userData.orgsArr[idx].orgName
				_userData.orgId = _userData.orgsArr[idx].orgId
				var httpPromise = new Promise(function(resolve,reject){
					httpUtil.getHttp({
						action: 'VSUser.changeRelOrg',
						orgId: _userData.orgId
					},function(callback,success){
						if(callback.success){
							resolve()
						}
					})
				})
				httpPromise.then(function(val){
					let _header = httpUtil.getHeader().cookie
					let _cookieArr = _header.split(',_rel')
					_header = _cookieArr[0] + ',_relOrgId=' + _userData.orgId
					//_header.cookie = _header.cookie + ',_relOrgId=' + _userData.orgId
					httpUtil.saveHeader(_header)

					httpUtil.getHttp({
						action: 'VSShop.getRelStores'
					},function(callback){
						if(callback.success){
							console.log(callback.results)
							_userData.storesArr = callback.results
							that.setData({
								orgName: _userData.orgName
							})
							for(var i=0;i<_userData.storesArr.length;i++){
								if (that.data.storeName == _userData.storesArr[i].storeName){
									break;
								}
							}
							wx.setStorageSync('userData', _userData)
							if(i >= _userData.storesArr.length){
								wx.reLaunch({
									url: '/pages/noCooperate/noCooperate'
								})
							}
							else{
								//if (i < _userData.storesArr.length && _page == 'pages/noCooperate/noCooperate') {
									wx.switchTab({
										url: '/pages/homePage/home/home'
									})
								//}
							}
							if(that.data.orgArr.length )
							that.powerDrawer(e)
						}
					})
				})	
			}
			else{
				//_userData
				console.log(that.data.storesArr)
				_userData.storeName = _userData.storesArr[idx].storeName
				_userData.storeOrgId = _userData.storesArr[idx].storeOrgId
				_userData.storeCode = _userData.storesArr[idx].storeCode
				_userData.bizCenterId = _userData.storesArr[idx].bizCenterId
				wx.setStorageSync('userData', _userData)
				that.setData({
					storeName: _userData.storeName
				})
				//if (_page == 'pages/noCooperate/noCooperate'){
					wx.switchTab({
						url: '/pages/homePage/home/home'
					})
				//}
				that.powerDrawer(e)
			}
		},
		powerDrawer: function (e) {
			var that = this
			var currentStatus = e.currentTarget.dataset.status

			if (currentStatus == 'close') {
				that.setData({
					showModalStatus: false,
					radioSelect: 0
				})
			}

			if (currentStatus == "open") {
				that.setData({
					showModalStatus: true
				});
			}
		}
	}
})
