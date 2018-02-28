// pages/homePage/account/myBill/myBill.js
const http = require('../../../../utils/httpUtil.js')
const ry = require('../../../../utils/util.js')
let _this = {};
let searchCnt = "";
let crrPage = 0;
let before = 0, after;
let topHeight = 0;
let bTop = 0, aTop;
const errorImg = "http://file.ry600.com/defaultimg/files/Product/photo_s.jpg";
Page({
	data: {
		crrIndex: 0,
		tabs: [
			{stateName: "全部订单", state: ""},
			{stateName: "待付款", state: "noPay"},
			{stateName: "待收货", state: "noArrival"},
			{stateName:"已完成", state: "finish"},
			{stateName:"已取消", state: "cancel"}
		],
		bills: [],
		scrollHeight: 0,
		showSearchBar: true,
		noRes: ""
	},
	onLoad: function(){
		_this = this;
		wx.getSystemInfo({success: function(res){
			_this.setData({
				scrollHeight: res.windowHeight + "px"
			});
		}});
		wx.createSelectorQuery().selectAll('#search_bar, #tabs').boundingClientRect(function(res){
			for(var i = 0; i < res.length; i++){
				topHeight += res[i].height;
			}
		}).exec();
		
		this.getBills();
	},
	changeTab: function(e){
		let crrIdx = e.currentTarget.dataset.index
		this.setData({
			bills: {},
			crrIndex: crrIdx
		});
		crrPage = 0;
		_this.getBills(crrPage, searchCnt, _this.data.tabs[crrIdx].state);
	},
	getBills: function(pgNum, searchCnt, state){
		ry.loading();
		http.getHttp({
			action: 'VSShop.getMyBills',
			pgNum: pgNum || 0,
			limit: 5,
			searchBillId: searchCnt || "",
			bbState: state || ""
		}, function(res, success){
			wx.hideLoading();
			if(success){
			// var res = {
			// 	"message": "",
			// 	"results": [
			// 		{ "billId": "18020927213", "buyerName": "湛江市万邦药业有限公司", "createTime": "2018-02-09 09:39:36", "payModeId": "6zj0lsn78muu5mxe", "payModeName": "货到付款", "payState": "未支付", "payment": 29.5, "products": [{ "amount": 5, "batchNo": "", "billId": "18020927213", "billType": "", "giveToken": 0, "itemType": "product", "mainSortNum": 0, "orgId": "7pa1kzpfc8dz4afh", "orgProductId": "3wfyc0ux6rcu7a7n", "originalAmount": 0, "originalPayment": 0, "originalPrice": 0, "packAmount": 1, "packUnits": "瓶", "packageId": "", "payment": 7, "photoUrl": "http://file.eheres.org/defaultimg/files/Product/photo_s.jpg", "price": 1.4, "productCaption": "乳酸依沙吖啶溶液 100ml 广东恒健制药有限公司", "productCodeOfOrg": "97109", "productId": "9fxanfdf2gdepzgk", "remark": "", "rewardId": "", "saleTag": "", "shopProductId": "911e523e4acd05f7", "skuCode": "97109", "skuId": "0tys0509atcyx2lv", "sortNum": 1, "specDesc": "", "tokenPrice": 0, "units": "瓶", "url": "/_shop/product-911e523e4acd05f7.shtml?skuId=0tys0509atcyx2lv" }, { "amount": 1, "batchNo": "", "billId": "18020927213", "billType": "", "giveToken": 0, "itemType": "product", "mainSortNum": 0, "orgId": "7pa1kzpfc8dz4afh", "orgProductId": "3rv18y02d55p9kq1", "originalAmount": 0, "originalPayment": 0, "originalPrice": 0, "packAmount": 1, "packUnits": "盒", "packageId": "", "payment": 16.5, "photoUrl": "http://file.eheres.org/defaultimg/files/Product/photo_s.jpg", "price": 16.5, "productCaption": "邦迪 100片 上海强生有限公司", "productCodeOfOrg": "96680", "productId": "8nodzjpvbxpw7gsk", "remark": "", "rewardId": "", "saleTag": "", "shopProductId": "5136c3e239863b30", "skuCode": "96680", "skuId": "3nenrmsi8nd7x0yx", "sortNum": 2, "specDesc": "标准", "tokenPrice": 0, "units": "盒", "url": "/_shop/product-5136c3e239863b30.shtml?skuId=3nenrmsi8nd7x0yx" }, { "amount": 1, "batchNo": "", "billId": "18020927213", "billType": "", "giveToken": 0, "itemType": "product", "mainSortNum": 0, "orgId": "7pa1kzpfc8dz4afh", "orgProductId": "4744xeea5ey6rjmx", "originalAmount": 0, "originalPayment": 0, "originalPrice": 0, "packAmount": 1, "packUnits": "包", "packageId": "", "payment": 6, "photoUrl": "http://file.eheres.org/defaultimg/files/Product/photo_s.jpg", "price": 6, "productCaption": "医用棉签(大) 12cm*50支*20袋 南昌爱博医疗器械有限公司", "productCodeOfOrg": "121672", "productId": "808w9w9e6gesbcuc", "remark": "", "rewardId": "", "saleTag": "", "shopProductId": "774a089d37705b6d", "skuCode": "121672", "skuId": "0u4hzciq4t8wey3t", "sortNum": 3, "specDesc": "标准", "tokenPrice": 0, "units": "包", "url": "/_shop/product-774a089d37705b6d.shtml?skuId=0u4hzciq4t8wey3t" }], "sellerName": "湛江市万邦药业有限公司(万邦药业)", "state": "waitSellerConfirmed", "stateName": "待卖家确认" }, 
			// 		{ "billId": "18020927212", "buyerName": "湛江市万邦药业有限公司", "createTime": "2018-02-09 09:38:57", "payModeId": "6zj0lsn78muu5mxe", "payModeName": "货到付款", "payState": "未支付", "payment": 67.12, "products": [{ "amount": 2, "batchNo": "", "billId": "18020927212", "billType": "", "giveToken": 0, "itemType": "product", "mainSortNum": 0, "orgId": "7pa1kzpfc8dz4afh", "orgProductId": "6fqoxuzmbvryf8dl", "originalAmount": 0, "originalPayment": 0, "originalPrice": 0, "packAmount": 1, "packUnits": "盒", "packageId": "", "payment": 0.02, "photoUrl": "http://file.eheres.org/defaultimg/files/Product/photo_s.jpg", "price": 0.01, "productCaption": "清热消炎宁胶囊 0.32g*12粒 广州白云山敬修堂药业股份有限公司 敬修堂", "productCodeOfOrg": "130665", "productId": "2njfq9za1nbm0cdd", "remark": "", "rewardId": "", "saleTag": "", "shopProductId": "b04d235bbf00a303", "skuCode": "130665", "skuId": "53qn6nfmbtsztwyx", "sortNum": 1, "specDesc": "标准", "tokenPrice": 0, "units": "盒", "url": "/_shop/product-b04d235bbf00a303.shtml?skuId=53qn6nfmbtsztwyx" }, { "amount": 1, "batchNo": "", "billId": "18020927212", "billType": "", "giveToken": 0, "itemType": "product", "mainSortNum": 0, "orgId": "7pa1kzpfc8dz4afh", "orgProductId": "8hyrn4uh1h97myq3", "originalAmount": 0, "originalPayment": 0, "originalPrice": 0, "packAmount": 1, "packUnits": "盒", "packageId": "", "payment": 63.2, "photoUrl": "http://file.eheres.org/defaultimg/files/Product/photo_s.jpg", "price": 63.2, "productCaption": "韩金靓染发霜(紫色) 100ml 中山市佳丽精细化工有限公司", "productCodeOfOrg": "144173", "productId": "cf3p102328odmqfa", "remark": "", "rewardId": "", "saleTag": "", "shopProductId": "06611a01df081731", "skuCode": "144173", "skuId": "bmft1utl2yixb4gb", "sortNum": 2, "specDesc": "", "tokenPrice": 0, "units": "盒", "url": "/_shop/product-06611a01df081731.shtml?skuId=bmft1utl2yixb4gb" }, { "amount": 3, "batchNo": "", "billId": "18020927212", "billType": "", "giveToken": 0, "itemType": "product", "mainSortNum": 0, "orgId": "7pa1kzpfc8dz4afh", "orgProductId": "2krqb38i09hdx9nt", "originalAmount": 0, "originalPayment": 0, "originalPrice": 0, "packAmount": 1, "packUnits": "包", "packageId": "", "payment": 3.9, "photoUrl": "http://file.eheres.org/defaultimg/files/Product/photo_s.jpg", "price": 1.3, "productCaption": "一次性使用口罩 10个 南昌市惠临医疗器械有限公司", "productCodeOfOrg": "206102", "productId": "8tlrbb0y953ftu4k", "remark": "", "rewardId": "", "saleTag": "", "shopProductId": "55d563dc3c9f6849", "skuCode": "206102", "skuId": "20s9jxuq7jwesmjt", "sortNum": 3, "specDesc": "标准", "tokenPrice": 0, "units": "包", "url": "/_shop/product-55d563dc3c9f6849.shtml?skuId=20s9jxuq7jwesmjt" }], "sellerName": "湛江市万邦药业有限公司(万邦药业)", "state": "waitSellerConfirmed", "stateName": "待卖家确认" }, 
			// 		{ "billId": "18020827204", "buyerName": "湛江市万邦药业有限公司", "createTime": "2018-02-08 10:33:30", "payModeId": "6zj0lsn78muu5mxe", "payModeName": "货到付款", "payState": "未支付", "payment": 16.6, "products": [{ "amount": 10, "batchNo": "", "billId": "18020827204", "billType": "", "giveToken": 0, "itemType": "product", "mainSortNum": 0, "orgId": "7pa1kzpfc8dz4afh", "orgProductId": "5oggv86aa6m16p0p", "originalAmount": 0, "originalPayment": 0, "originalPrice": 0, "packAmount": 1, "packUnits": "瓶", "packageId": "", "payment": 9, "photoUrl": "http://file.eheres.org/defaultimg/files/Product/photo_s.jpg", "price": 0.9, "productCaption": "过氧化氢溶液(双氧水) 100ml 成都明日制药有限公司", "productCodeOfOrg": "159096", "productId": "ajz01nyqc5lysatg", "remark": "", "rewardId": "", "saleTag": "", "shopProductId": "de48f231c0778df1", "skuCode": "159096", "skuId": "6xvkegiqb07dirs9", "sortNum": 1, "specDesc": "标准", "tokenPrice": 0, "units": "瓶", "url": "/_shop/product-de48f231c0778df1.shtml?skuId=6xvkegiqb07dirs9" }, { "amount": 4, "batchNo": "", "billId": "18020827204", "billType": "", "giveToken": 0, "itemType": "product", "mainSortNum": 0, "orgId": "7pa1kzpfc8dz4afh", "orgProductId": "91wudie9d20jr26u", "originalAmount": 0, "originalPayment": 0, "originalPrice": 0, "packAmount": 1, "packUnits": "瓶", "packageId": "", "payment": 7.6, "photoUrl": "http://file.eheres.org/defaultimg/files/Product/photo_s.jpg", "price": 1.9, "productCaption": "安捷牌来苏水消毒液 500ml 德州安捷高科消毒制品有限公司", "productCodeOfOrg": "203130", "productId": "cjv622ly4dmhwi12", "remark": "", "rewardId": "", "saleTag": "", "shopProductId": "736b677fb1f49231", "skuCode": "203130", "skuId": "a1foe3c17mohlmmu", "sortNum": 2, "specDesc": "", "tokenPrice": 0, "units": "瓶", "url": "/_shop/product-736b677fb1f49231.shtml?skuId=a1foe3c17mohlmmu" }], "sellerName": "湛江市万邦药业有限公司(万邦药业)", "state": "waitSellerConfirmed", "stateName": "待卖家确认" }, 
			// 		{ "billId": "18020827203", "buyerName": "湛江市万邦药业有限公司", "createTime": "2018-02-08 10:32:56", "payModeId": "6zj0lsn78muu5mxe", "payModeName": "货到付款", "payState": "未支付", "payment": 13.1, "products": [{ "amount": 7, "batchNo": "", "billId": "18020827203", "billType": "", "giveToken": 0, "itemType": "product", "mainSortNum": 0, "orgId": "7pa1kzpfc8dz4afh", "orgProductId": "7n2ysppt1v2aezyz", "originalAmount": 0, "originalPayment": 0, "originalPrice": 0, "packAmount": 1, "packUnits": "个", "packageId": "", "payment": 1.4, "photoUrl": "http://file.eheres.org/defaultimg/files/Product/photo_s.jpg", "price": 0.2, "productCaption": "一次性服药瓶(方瓶) 60ml 广西陆川县诚信包装材料厂", "productCodeOfOrg": "100304", "productId": "blwxqnpw9d6gry2u", "remark": "", "rewardId": "", "saleTag": "", "shopProductId": "a4c9a1be9e0f1da1", "skuCode": "100304", "skuId": "8sim5v751l7bpy1n", "sortNum": 1, "specDesc": "", "tokenPrice": 0, "units": "个", "url": "/_shop/product-a4c9a1be9e0f1da1.shtml?skuId=8sim5v751l7bpy1n" }, { "amount": 4, "batchNo": "", "billId": "18020827203", "billType": "", "giveToken": 0, "itemType": "product", "mainSortNum": 0, "orgId": "7pa1kzpfc8dz4afh", "orgProductId": "3wfyc0ux6rcu7a7n", "originalAmount": 0, "originalPayment": 0, "originalPrice": 0, "packAmount": 1, "packUnits": "瓶", "packageId": "", "payment": 5.6, "photoUrl": "http://file.eheres.org/defaultimg/files/Product/photo_s.jpg", "price": 1.4, "productCaption": "乳酸依沙吖啶溶液 100ml 广东恒健制药有限公司", "productCodeOfOrg": "97109", "productId": "9fxanfdf2gdepzgk", "remark": "", "rewardId": "", "saleTag": "", "shopProductId": "911e523e4acd05f7", "skuCode": "97109", "skuId": "0tys0509atcyx2lv", "sortNum": 2, "specDesc": "", "tokenPrice": 0, "units": "瓶", "url": "/_shop/product-911e523e4acd05f7.shtml?skuId=0tys0509atcyx2lv" }, { "amount": 1, "batchNo": "", "billId": "18020827203", "billType": "", "giveToken": 0, "itemType": "product", "mainSortNum": 0, "orgId": "7pa1kzpfc8dz4afh", "orgProductId": "49d5mu5e6s9z7cx5", "originalAmount": 0, "originalPayment": 0, "originalPrice": 0, "packAmount": 1, "packUnits": "盒", "packageId": "", "payment": 2.1, "photoUrl": "http://file.eheres.org/defaultimg/files/Product/photo_s.jpg", "price": 2.1, "productCaption": "碘伏棉球 20球 广州市醒目医药科技有限公司", "productCodeOfOrg": "203716", "productId": "75v4qhle3xngw5hg", "remark": "", "rewardId": "", "saleTag": "", "shopProductId": "0b969eeb21820348", "skuCode": "203716", "skuId": "57t589iacpdcmuqx", "sortNum": 3, "specDesc": "标准", "tokenPrice": 0, "units": "盒", "url": "/_shop/product-0b969eeb21820348.shtml?skuId=57t589iacpdcmuqx" }, { "amount": 1, "batchNo": "", "billId": "18020827203", "billType": "", "giveToken": 0, "itemType": "product", "mainSortNum": 0, "orgId": "7pa1kzpfc8dz4afh", "orgProductId": "7pcjfxwh2yyv187q", "originalAmount": 0, "originalPayment": 0, "originalPrice": 0, "packAmount": 1, "packUnits": "瓶", "packageId": "", "payment": 4, "photoUrl": "http://file.eheres.org/defaultimg/files/Product/photo_s.jpg", "price": 4, "productCaption": "安捷牌75%乙醇消毒液(酒精) 500ml 德州安捷高科消毒制品有限公司", "productCodeOfOrg": "203133", "productId": "b8qh0zaucpjd9r2e", "remark": "", "rewardId": "", "saleTag": "", "shopProductId": "0fb4aef990f22d7b", "skuCode": "203133", "skuId": "bjgzbdk111wsps5y", "sortNum": 4, "specDesc": "", "tokenPrice": 0, "units": "瓶", "url": "/_shop/product-0fb4aef990f22d7b.shtml?skuId=bjgzbdk111wsps5y" }], "sellerName": "湛江市万邦药业有限公司(万邦药业)", "state": "waitSellerConfirmed", "stateName": "待卖家确认" }, 
			// 		{ "billId": "18020827202", "buyerName": "湛江市万邦药业有限公司", "createTime": "2018-02-08 10:31:45", "payModeId": "6zj0lsn78muu5mxe", "payModeName": "货到付款", "payState": "未支付", "payment": 25.1, "products": [{ "amount": 2, "batchNo": "", "billId": "18020827202", "billType": "", "giveToken": 0, "itemType": "product", "mainSortNum": 0, "orgId": "7pa1kzpfc8dz4afh", "orgProductId": "3rrfe80y9mvrxkix", "originalAmount": 0, "originalPayment": 0, "originalPrice": 0, "packAmount": 1, "packUnits": "支", "packageId": "", "payment": 11.6, "photoUrl": "http://file.eheres.org/defaultimg/files/Product/photo_s.jpg", "price": 5.8, "productCaption": "盐酸环丙沙星乳膏(亿帆) 30mg:10g 安徽新陇海药业有限公司", "productCodeOfOrg": "160393", "productId": "al3sdz826u7vqkec", "remark": "", "rewardId": "", "saleTag": "", "shopProductId": "43c02c6a27564388", "skuCode": "160393", "skuId": "4ymyng2qbtsxyb6x", "sortNum": 1, "specDesc": "标准", "tokenPrice": 0, "units": "支", "url": "/_shop/product-43c02c6a27564388.shtml?skuId=4ymyng2qbtsxyb6x" }, { "amount": 4, "batchNo": "", "billId": "18020827202", "billType": "", "giveToken": 0, "itemType": "product", "mainSortNum": 0, "orgId": "7pa1kzpfc8dz4afh", "orgProductId": "2mzn25gi0v6oako9", "originalAmount": 0, "originalPayment": 0, "originalPrice": 0, "packAmount": 1, "packUnits": "瓶", "packageId": "", "payment": 5.2, "photoUrl": "http://file.eheres.org/defaultimg/files/Product/photo_s.jpg", "price": 1.3, "productCaption": "乳酸依沙吖啶溶液(利凡诺溶液) 0.1%*100ml 广东南国药业有限公司", "productCodeOfOrg": "96570", "productId": "btitdzte150oncn8", "remark": "", "rewardId": "", "saleTag": "", "shopProductId": "a4a893eef0828087", "skuCode": "96570", "skuId": "1cl0yw4i1qr8lnvt", "sortNum": 2, "specDesc": "标准", "tokenPrice": 0, "units": "瓶", "url": "/_shop/product-a4a893eef0828087.shtml?skuId=1cl0yw4i1qr8lnvt" }, { "amount": 1, "batchNo": "", "billId": "18020827202", "billType": "", "giveToken": 0, "itemType": "product", "mainSortNum": 0, "orgId": "7pa1kzpfc8dz4afh", "orgProductId": "34yeroki6u91kl61", "originalAmount": 0, "originalPayment": 0, "originalPrice": 0, "packAmount": 1, "packUnits": "盒", "packageId": "", "payment": 8.3, "photoUrl": "http://file.eheres.org/defaultimg/files/Product/photo_s.jpg", "price": 8.3, "productCaption": "抗病毒口服液 10ml*10支 江苏新先制药有限公司", "productCodeOfOrg": "98999", "productId": "ci6fb34l6ger2f2c", "remark": "", "rewardId": "", "saleTag": "", "shopProductId": "0b1f8dfeb24c31f1", "skuCode": "98999", "skuId": "2do6p1r62cgnc755", "sortNum": 3, "specDesc": "标准", "tokenPrice": 0, "units": "盒", "url": "/_shop/product-0b1f8dfeb24c31f1.shtml?skuId=2do6p1r62cgnc755" }], "sellerName": "湛江市万邦药业有限公司(万邦药业)", "state": "waitSellerConfirmed", "stateName": "待卖家确认" }], 
			// 		"success": true, 
			// 		"totals": 430, 
			// 		"userName": "wbyy" 
			// 	};
				if(res.success){
					var _bills = res.results;
					for(var i = 0; i < _bills.length; i++){
						var _bill = _bills[i];
						if(_bill.payModeName.indexOf("在线支付") > -1){
							_bill.payModeName = "在线支付";
						}
					}
					var crrIdx = _this.data.crrIndex;
					if(pgNum){
						_this.setData({
							bills: _this.data.bills.concat(res.results)
						});
					}else{
						_this.setData({
							bills: res.results
						});
					}
					if(!res.results.length){
						_this.setData({
							noRes: true
						});
					}else{
						_this.setData({
							noRes: false
						});
					}
				}else{
					ry.alert(res.message);
				}
			}
		});
	},
	searchInput: function(e){
		searchCnt = e.detail.value;
	},
	searchBill: function(){
		crrPage = 0;
		let _data = _this.data;
		_this.getBills(crrPage, searchCnt, _data.tabs[_data.crrIndex].state);
	},
	scroll: function(e){
		after = e.timeStamp;
		if(after - before > 100){
			before = after;
			_this.scrollFn(e);
		}
	},
	scrollFn: function(e){
		aTop = e.detail.scrollTop;
		if(aTop > bTop && aTop > 50){
			_this.setData({
				showSearchBar: false
			});
		}else{
			_this.setData({
				showSearchBar: true
			});
		}
		bTop = aTop;
	},
	billDetail: function(e){
		let billId = e.currentTarget.dataset.billid;
		wx.navigateTo({
			url: 'billInfo/billInfo?billId=' + billId,
		});
	},
	loadMore: function(){
		let _data = _this.data;
		if(!_data.noRes){
			_this.getBills(++crrPage, searchCnt, _data.tabs[_data.crrIndex].state);
		}
	},
	imgError: function(e){
		let idx = e.currentTarget.dataset.idx;
		let bid = idx.split(",")[0];
		let pid = idx.split(",")[1];
		let photoTemp = "bills[" + bid + "].products[" + pid + "].photoUrl";
		_this.setData({
			[photoTemp]: errorImg
		});
	}
})