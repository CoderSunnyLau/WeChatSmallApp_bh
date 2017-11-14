// pages/account/account.js
const http = require('../../../utils/httpUtil.js')
let load = false;
let _this = {};

Page({
  data: {
    storeCrr: '万邦药业',
    orgCrr: '同和药店',
    userIcon: 'http://file.ry600.com/snapshot//files/af/afvnal1p3sa59q79/2017-02-08/79l897i7bao7gd3o.gif',
    userName: '',
    fullName: ''
  },
  onLoad: function(){
	_this = this;
	this.load();
  },
  onShow: function(){
	if(load){this.load();}
  },
  load: function(){
    http.getHttp({action: 'VSUser.getBasicInfo'},function(res, success){
      if(success){
        if(res.success){
          let user = res.results[0];
          _this.setData({
            userName: user.userName,
            fullName: user.fullName,
            userIcon: 'http://www.ry600.com' + user.photoUrl
          });
		  load = true;
        }else{
          wx.reLaunch({
            url: '/pages/loginPage/login/login',
          });
        }
      }
    });
  },
  orderList: function(){
    wx.navigateTo({
      url: 'orderList/orderList',
    });
  },
  logout: function(){
    wx.request({
      url: 'http://bh.ry600.com/userLogout.action',
      method: 'GET',
      header: http.getHeader(),
      success: function(res){
        console.log(res);
        console.log(2)
      },
      fail: function(res){
        console.log(res)
        console.log(1)
      }
    });
    var userData = wx.getStorageSync('userData');
    userData.autoLogin = 'false';
    wx.setStorage({
      key: 'userData',
      data: userData,
      success: function(res){
        wx.reLaunch({
          url: '/pages/loginPage/login/login',
        });
      }
    });
  }
});