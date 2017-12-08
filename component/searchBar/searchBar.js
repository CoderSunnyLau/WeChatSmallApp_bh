let _searchContent = ''
Component({
  properties: {},
  data: {
		searchTip: '输入品名(或拼音首字母) 、厂商、品牌'
  },
  methods: {
		saveScanCode: function () {
			var that = this
			wx.scanCode({
				success: function (res) {
					let _detail = res
					that.triggerEvent('scan', _detail)
				}
			})
		},
		saveSearchContent: function(e){
			let _detail = e.detail.value
			let _currentTarget = e.currentTarget
			this.triggerEvent('search', _detail, _currentTarget)
		}
  }
})
