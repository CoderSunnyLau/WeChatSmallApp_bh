var httpUrl = getApp().globalData.domainName + '/jsonaction/websiteaction.action'
var mHeader = {
	cookie:'_clientId=b9dab5d0f94c47cd927c5fe92e0e1c33; Domain=ry600.com; Expires=Sun, 14-Nov-2027 06:40:10 GMT; Path=/,_serviceId=8856d57d55124002be66e1e1eaa9d207; Path=/,_relOrgId=afvnal1p3sa59q79'}

function loginHttp(options, callback) {
  wx.request({
    url: 'http://login.ry600.com/userCenterLogin.jsp',
    data: options,
    method: 'POST',
    header: {"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
    success: function (res) {
      callback(res, true)
    },
    fail: function(res){
      callback(res, false)
    }
  })
}

function saveHeader(e) {
  mHeader = {'cookie': e}
}
function getHeader(){
  return mHeader;
}

function getHttp(options, callback) {
  wx.request({
    url: httpUrl,
		header: Object.assign(mHeader, { "content-type": "application/x-www-form-urlencoded; charset=UTF-8" }),
    data: options,
    method: 'GET',		
    success: function (res) {
      callback(res.data, true)
    },
    fail: function(res){
      callback(res, false)
    }
  })
}

function postHttp(options, callback) {
  wx.request({
    url: httpUrl,
    data: options,
    method: 'POST',
	  header: Object.assign(mHeader, {"content-type": "application/x-www-form-urlencoded; charset=UTF-8"}),
    success: function (res) {
      callback(res.data, true)
    },
    fail: function (res) {
      callback(res, false)
    }
  })
}

module.exports = {
  loginHttp: loginHttp,
  saveHeader: saveHeader,
  getHttp: getHttp,
  postHttp: postHttp,
  getHeader: getHeader
}