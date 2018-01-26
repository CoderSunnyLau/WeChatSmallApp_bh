var httpUrl = getApp().globalData.domainName + '/jsonaction/websiteaction.action'
var mHeader = { Cookie: "_clientId=86f67491791e49b29bdd36fe24413d14; _relOrgId=7pa1kzpfc8dz4afh; jiathis_rdc=%7B%22http%3A//bh.eheres.org/_shop/product-b04d235bbf00a303.shtml%22%3A%220%7C1516949430395%22%7D; _serviceId=1c5326d637cd4083b277ba33115a4314; storeCode=wbyy"}

function loginHttp(options, callback) {
  wx.request({
    url: 'http://login.ry600.com/userCenterLogin.jsp',
    // url: 'http://bh.eheres.org/userCenterLogin.jsp',
    data: options,
    method: 'POST',
    header: {"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
    success: function(res){
      callback(res, true);
    },
    fail: function(res){
      callback(res, false);
    }
  });
}

function saveHeader(e) {
  mHeader = {'cookie': e};
}

function getHeader() {
  return mHeader;
}

function getHttp(options, callback) {
  wx.request({
    url: httpUrl,
		header: Object.assign(mHeader, { "content-type": "application/x-www-form-urlencoded; charset=UTF-8" }),
    data: options,
    method: 'GET',		
    success: function(res){
      callback(res.data, true);
    },
    fail: function(res){
	  wx.hideLoading();
      wx.showModal({
		title: '提示',
		content: '网络错误',
		showCancel: false
	  });
    }
  });
}

function postHttp(options, callback) {
  wx.request({
    url: httpUrl,
    data: options,
    method: 'POST',
	header: Object.assign(mHeader, {"content-type": "application/x-www-form-urlencoded; charset=UTF-8"}),
    success: function(res){
      callback(res.data, true);
    },
    fail: function(res){
	  wx.hideLoading();
      wx.showModal({
		title: '提示',
		content: '网络错误',
		showCancel: false
	  });
    }
  });
}

module.exports = {
  loginHttp: loginHttp,
  saveHeader: saveHeader,
  getHttp: getHttp,
  postHttp: postHttp,
  getHeader: getHeader
}