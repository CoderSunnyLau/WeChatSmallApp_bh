var httpUrl = getApp().globalData.domainName + '/jsonaction/websiteaction.action'
var mHeader = { Cookie: "CNZZDATA1259325603=798555891-1503891175-http%253A%252F%252Fbh.ry600.com%252F%7C1503891175; _clientId=50e9af1f3d344f6c8d8b17bd344b67b3; UM_distinctid=15e6e78dc7f139-0f417f6295b24b-e313761-1fa400-15e6e78dc80ab2; CNZZDATA1260495474=792404843-1510189870-http%253A%252F%252Fbh.ry600.com%252F%7C1510189870; _relOrgId=di70684438lrfavs; _serviceId=364639f55ff246f3b76a99ab6270c836; JSESSIONID=pascunzwmbbh1cnbbjiigcpwv; CNZZDATA1256711448=72942336-1498805325-http%253A%252F%252Fbh.ry600.com%252F%7C1513214899"}

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