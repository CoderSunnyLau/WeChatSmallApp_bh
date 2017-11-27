Page({
	data: {},
	onLoad: function (options) {
		this.setData({
			arr: [{
				aa: 'arr111',
				bb: 'arr222'
			}],
			mArr: [{
				cc: 'mArr333'
			},{
				cc: '222'
			}]
		})
		console.log(typeof(this.data.arr))
	},
	addToShopcart: function(e){
		console.log(e)
	}
})