Component({
	properties: {
		dialogTxt: String,
		showDialog: Boolean
	},
	data: {
		showDialog: false,
		dialogTxt: '弹窗内容'
	},
	methods: {
		closeDialog() {
			this.setData({
				showDialog: false
			})
		}
	}
})