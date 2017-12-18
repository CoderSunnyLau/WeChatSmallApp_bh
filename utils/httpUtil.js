var httpUrl = getApp().globalData.domainName + '/jsonaction/websiteaction.action'
var mHeader = { Cookie: "_clientId=a9fc9c62ceaf44f39e1a36729408e21c; Domain=ry600.com; Expires=Thu, 16-Dec-2027 08:47:30 GMT; Path=/,_serviceId=cf21e456e0ce45499b4722ef76d0e3c7; Path=/,_relOrgId=afvnal1p3sa59q79"}

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