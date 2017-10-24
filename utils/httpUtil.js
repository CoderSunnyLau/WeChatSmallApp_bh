var httpUrl = getApp().globalData.domainName + '/jsonaction/websiteaction.action'
var mHeader = { cookie:'_clientId=07bdde2ba8ef41b789216ff0a6af1517; Domain=ry600.com; Expires=Fri, 22-Oct-2027 10:08:56 GMT; Path=/,_serviceId=96bda97339834c74812b58ae2b7fe563; Path=/'}

function loginHttp(options, callback) {
  wx.request({
    url: 'http://login.ry600.com/userCenterLogin.jsp',
    data: options,
    method: 'GET',
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
    header: mHeader,
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
		header: Object.assign(mHeader, {"content-type": "application/x-www-form-urlencoded"}),
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
  mHeader: mHeader,
  getHeader: getHeader
}