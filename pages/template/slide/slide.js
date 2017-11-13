Page({
	data: {
		showItem: false,
		index: 0,
		a:0,
		b:1
	},
	onLoad: function (options) {		
	},
	dropClick: function(e){
		let that = this

		that.setData({
			isSelect: e.currentTarget.dataset.idx,
			showItem: !that.data.showItem,
			isDrop: !that.data.isDrop
		})

	}
})