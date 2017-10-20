// pages/homePage/account/orderList/orderList.js
const http = require('../../../../utils/httpUtil.js')
Page({
  data: {
    tabs: ['全部订单', '待付款', '待收货', '已完成', '已取消'],
    crrIndex: 0,
    item: {
      tabs: ['全部订单', '待付款', '待收货', '已完成', '已取消'],
      crrIndex: 0
    }
  },
  onLoad: function(){
    http.getHttp({ action: 'VSUser.getUserOrgs'}, function(res, success){
      if(success && res.success){
        console.log(res)
      }
    });
  },
  changeTab: function(e){
    this.setData({
      crrIndex: e.currentTarget.dataset.index
    })
  }
})