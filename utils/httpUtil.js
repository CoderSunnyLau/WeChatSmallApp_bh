var httpUrl = getApp().globalData.domainName + '/jsonaction/websiteaction.action'
var mHeader = { cookie:'_clientId=dd81a58da1ad42ac95dee6034d711c70; Domain=ry600.com; Expires=Fri, 22-Oct-2027 08:08:08 GMT; Path=/,_serviceId=e0f554d0fd5d4aaa9e9b40a8f8f013fa; Path=/'}

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