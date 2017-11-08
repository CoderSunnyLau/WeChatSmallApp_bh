const app = getApp()
const http = require('../../../utils/httpUtil.js')
const md5 = require('../../../utils/md5.js')
const base64 = require('../../../utils/base64.js')

Page({
  data: {
    userName: "",
    password: "",
    vs: app.globalData.version
  },
  onLoad: function () {
    var _this = this;
    wx.getStorage({
      key: 'loginData',
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
  },
  nameInput: function (e) {
    this.setData({
      userName: e.detail.value
    });
  },
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
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
          var _header = res.header['Set-Cookie']
          var headerArr = _header.split('/,')
          headerArr = headerArr[1].split(';')
          _header = headerArr[0]

          //http.saveHeader(res.header['Set-Cookie']);
          http.saveHeader(_header);
          if (res.data.success) {
            var _orgData = base64.decode(res.data.message)
            app.globalData.msgData = new Object()
            app.globalData.msgData.orgArr = _orgData.orgs

            _this.setData({
              tip: '登录成功'
            });
            wx.setStorage({
              key: 'loginData',
              data: {
                userName: _this.data.userName,
                password: _this.data.password,
                autoLogin: 'true'
              },
            });

            if (wx.getStorageSync('storeName') && wx.getStorageSync('orgName')) {
              wx.switchTab({
                url: '/pages/homePage/home/home'
              });
            }
            else {
              wx.redirectTo({
                url: '/pages/select/select?isOrg=true'
              })
            }
          } else {
            _this.setData({
              tip: res.data.message
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