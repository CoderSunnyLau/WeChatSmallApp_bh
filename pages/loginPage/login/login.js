const app = getApp()
const http = require('../../../utils/httpUtil.js')
const md5 = require('../../../utils/md5.js')
const base64 = require('../../../utils/base64.js')
import { appHeader } from '../../../component/appHeader/appHeader.js'

Page({
  data: {
    userName: "",
    password: "",
    vs: app.globalData.version
  },
  onLoad: function () {
    var _this = this;
    wx.getStorage({
      key: 'userData',
      success: function (res) {
        _this.setData({
          userName: res.data.userName,
          password: res.data.password
        })
        if (res.data.autoLogin == 'true') {
          _this.doLogin();
        }
      },
    });
	wx.login({
		success: function(res){
			console.log(res.code);
			wx.request({
				url: 'https://api.weixin.qq.com/sns/jscode2session',
				data: {
					appid: 'wx812f52591fe47137',
					secret: 'f23d93e403dec4505ff1ef1b7e61c9f4',
					js_code: res.code,
					grant_type: 'authorization_code'
				},
				success: function(r){
					console.log(r.data.openid)
				}
			});
		}
	})
  },
  nameInput: function (e) {
    this.setData({
      userName: e.detail.value,
      tip: ''
    });
  },
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value,
      tip: ''
    });
  },
  doLogin: function () {
    var _this = this;
    if (!this.data.userName) {
      wx.showModal({
        title: '提示',
        content: '请输入用户名',
        showCancel: false
      });
    } else if (!this.data.password) {
      wx.showModal({
        title: '提示',
        content: '请输入密码',
        showCancel: false
      });
    } else {
      http.loginHttp({
        act: 'login',
        userName: this.data.userName,
        password: md5.hexMD5(this.data.password),
        userScope: 1
      }, function (res, success) {
        if (success) {
          http.saveHeader(res.header['Set-Cookie']);
          if (res.data.success) {
            var _orgData = base64.decode(res.data.message)
            app.globalData.msgData = new Object()
            app.globalData.msgData.orgArr = _orgData.orgs

            _this.setData({
              tip: '登录成功'
            });

            let _userData = wx.getStorageSync('userData')
						
            if (_userData.userName == _this.data.userName && _userData.orgName && _userData.storeName) {
							let _header = http.getHeader()
							_header.cookie = _header.cookie + ',_relOrgId=' + _userData.orgId
							http.saveHeader(_header.cookie)
							_userData.autoLogin = 'true'
              wx.setStorageSync('userData', _userData)
							new appHeader()
              wx.switchTab({
                url: '/pages/homePage/home/home'
              });
            }
            else {
              _userData = {}
              _userData.userName = _this.data.userName
              _userData.password = _this.data.password
							_userData.autoLogin = 'true'
              wx.setStorageSync('userData', _userData)
              wx.redirectTo({
                url: '/pages/select/select?isOrg=true'
              })
            }
          } else {
            _this.setData({
              tip: '用户名或密码错误'
            });
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '请求失败,请点击页面右上角菜单按钮，打开调试后重试',
            showCancel: false
          });
        }
      });
    }
  },
  toForget: function () {
    wx.navigateTo({
      url: '../forget/forget',
    });
  }
});