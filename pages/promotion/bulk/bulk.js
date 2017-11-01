// pages/promotion/bulk/bulk.js
const http = require('../../../utils/httpUtil.js')

Page({
	data: {
		
	},
	onLoad: function(options){
		http.getHttp({
			action: 'VSShop.getBulkProducts'
		}, function(res, success){
			if(success){
				if(res.success){
					console.log(res);
				}
			}
		});
	}
})