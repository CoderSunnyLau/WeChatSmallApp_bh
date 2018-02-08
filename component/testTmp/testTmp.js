Component({
	properties: {
		dialogTxt: String,
		showDialog: Boolean
	},
	data: {
		showDialog: true,
		dialogTxt: '弹窗内容'
	},
	methods: {
		closeDialog(){
			this.setData({
				showDialog: false
			})
		}
	}
})