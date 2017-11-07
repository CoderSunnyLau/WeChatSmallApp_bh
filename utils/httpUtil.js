var httpUrl = getApp().globalData.domainName + '/jsonaction/websiteaction.action'
var mHeader = { cookie:'_clientId=3fcdb1188b3848b2af75977ef5e7e786; Domain=ry600.com; Expires=Fri, 05-Nov-2027 07:49:43 GMT; Path=/,_serviceId=cc9fd26a767f4640b098dadbc4896bf5; Path=/'}

function loginHttp(options, callback) {
  wx.request({
    url: 'http://login.ry600.com/userCenterLogin.jsp',
    data: options,
    method: 'POST',
    header: {"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
    success: function (res) {
      console.log(res)
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
  getHeader: getHeader
}