var httpUrl = getApp().globalData.domainName + '/jsonaction/websiteaction.action'
var mHeader = { cookie:'_clientId=d1f78b23b6424f29a6f6fd395bd295b0; Domain=ry600.com; Expires=Mon, 25-Oct-2027 08:09:56 GMT; Path=/,_serviceId=76555a36affe46ce8e4c5fc21291974c; Path=/'}

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
  mHeader: mHeader,
  getHeader: getHeader
}