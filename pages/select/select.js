const app = getApp()
const httpUtil = require('../../utils/httpUtil.js')
var _msgData
var orgArr
var radioIdx

Page({
  data: {
    orgArr: ['广东省', '福建省', '江西省', '云南省', '陕西省', '北京市', '天津市', '上海市'],
    isOrg: true,
    isCooperate: true,
    radioSelect: 0
  },
  onLoad: function (options) {
    var that = this
    orgArr = []
    radioIdx = 0
    _msgData = app.globalData.msgData

    console.log(_msgData)
    
    if(options.isOrg == 'true'){
      for(let i=0;i<_msgData.orgArr.length;i++){
        orgArr.push(_msgData.orgArr[i].orgName)
      }
      that.setData({
        isOrg: true,
        orgName: '选择机构',
        orgArr: orgArr
      })
    }
    else{
      httpUtil.getHttp({
        action: 'VSShop.getRelStores',
      },function(callback,success){
        if(success){
          if(callback.success){    
            that.setData({
              relOrgArr: callback.results
            })
          }
          else{
            console.log('未合作')
            that.setData({
              isCooperate: false
            })
          }          
        }
        }, ',_relOrgId=' + _msgData.orgId)
      that.setData({
        isOrg: false,
        orgName: '选择供应商'
      })
    }
  },
  submitOrg: function(){
    var that = this
    if(that.data.isOrg){
      let httpPromise = new Promise(function(resolve,reject){
        httpUtil.getHttp({
          action: 'VSUser.changeRelOrg',
          orgId: _msgData.orgArr[radioIdx].orgId
        },function(callback,success){
          if(success){           
            app.globalData.msgData.orgName = _msgData.orgArr[radioIdx].orgName
            app.globalData.msgData.orgId = _msgData.orgArr[radioIdx].orgId

            wx.setStorageSync('orgName', _msgData.orgArr[radioIdx].orgName)
            wx.setStorageSync('orgId', _msgData.orgArr[radioIdx].orgId)
            resolve()
          }
          })
      })
      httpPromise.then(function(val){
        wx.navigateTo({
          url: 'select?isOrg=false'
        })
      })
    }
    else{
      app.globalData.msgData.bizCenterId = that.data.relOrgArr[radioIdx].bizCenterId
      app.globalData.msgData.storeName = that.data.relOrgArr[radioIdx].storeName
      app.globalData.msgData.storeOrgId = that.data.relOrgArr[radioIdx].storeOrgId

      wx.setStorageSync('bizCenterId', that.data.relOrgArr[radioIdx].bizCenterId)
      wx.setStorageSync('storeName', that.data.relOrgArr[radioIdx].storeName)
      wx.setStorageSync('storeOrgId', that.data.relOrgArr[radioIdx].storeOrgId)
      wx.switchTab({
        url: '/pages/homePage/home/home'
      })
    }
  },
  selectOrg: function (e) {
    
    radioIdx = e.currentTarget.dataset.idx

    this.setData({
      radioSelect: radioIdx
    })
  },
  logout: function () {
    wx.request({
      url: 'http://bh.ry600.com/userLogout.action',
      method: 'GET',
      header: httpUtil.getHeader(),
      success: function (res) {
        console.log(res);
        console.log(2)
      },
      fail: function (res) {
        console.log(res)
        console.log(1)
      }
    });
    var loginData = wx.getStorageSync('loginData');
    loginData.autoLogin = 'false';
    wx.setStorage({
      key: 'loginData',
      data: loginData,
      success: function (res) {
        wx.reLaunch({
          url: '/pages/loginPage/login/login',
        });
      }
    });
  }
})