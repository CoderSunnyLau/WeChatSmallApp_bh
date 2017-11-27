let _searchContent = ''
Component({
  properties: {},
  data: {
		searchTip: '输入品名(或拼音首字母) 、厂商、品牌'
  },
  methods: {
		scanBill: function () {
			wx.scanCode({
				success: function () {
					console.log('success')
				}
			})
		},
		saveContent: function(e){
			_searchContent = e.detail.value
		},
		search: function(e){
			//console.log(e)
			var myEventDetail = {
				value: _searchContent
			}
			var myEventOption = e.currentTarget
			this.triggerEvent('myevent',myEventDetail,myEventOption)
		}
  }
})
