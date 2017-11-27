var httpUrl = getApp().globalData.domainName + '/jsonaction/websiteaction.action'
var mHeader = { Cookie: '_clientId = acf50dc3c2af4d7baf8930c58c918b97; Domain=ry600.com; Expires=Thu, 25-Nov - 2027 09: 02:38 GMT; Path=/,_serviceId=67a1a8835b2b45a5aa6417a3ccee96f4; Path=/, _relOrgId=afvnal1p3sa59q79'}

function loginHttp(options, callback) {
  wx.request({
    url: 'http://login.ry600.com/userCenterLogin.jsp',
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