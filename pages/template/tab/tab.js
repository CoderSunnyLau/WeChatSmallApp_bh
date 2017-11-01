// pages/template/tab/tab.js
let _tabData = {
    '_tabbar_.tabs': ['特价', '团购', '专柜', '促销活动'],
    '_tabbar_.crrIndex': 0
}

let tab = {
	_switch: function(e){
		var indexTemp = 'tabData.crrIndex';
		this.setData({
			[indexTemp]: e.currentTarget.dataset.index
		});
		wx.redirectTo({
			url: '/pages/promotion/bulk/bulk',
		})
	}
}

function tabbar(){
	let  pages = getCurrentPages();
	let crrPage = pages[pages.length - 1];
	this._page = crrPage;
	Object.assign(crrPage, tab);
	crrPage.tabbar = this;
	crrPage.setData(_tabData);
	return this;
}
module.exports = {
	tabbar
}

// let _tmpData = {
// 	'_testTmp_.tmpTxt': '测试模板数据测试'
// }

// let _tmpEvent = {
// 	testClick: function () {
// 		wx.showModal({
// 			title: '提示',
// 			content: this.data.inputContent
// 		})
// 	},
// 	saveContent: function (e) {
// 		console.log(e.detail.value)
// 		this.setData({
// 			inputContent: e.detail.value
// 		})
// 	}
// }

// function testTmp() {
// 	let _this = this
// 	let pages = getCurrentPages()
// 	let curPage = pages[pages.length - 1]

// 	this._page = curPage

// 	Object.assign(curPage, _tmpEvent)
// 	curPage.testTmp = this

// 	//console.log(curPage.data)
// 	curPage.setData(_tmpData)

// 	return this
// }

// module.exports = {
// 	testTmp
// }