let _tmpData = {
	'_headerData_.storeName': wx.getStorageSync('userData').storeName,
	'_headerData_.orgName': wx.getStorageSync('userData').orgName,
  '_headerData_.searchTip': '输入品名(或拼音首字母)、厂商、品牌'
}

let _tmpEvent = {
  powerDrawer: function (e) {
    let that = this
    var currentStatus = e.currentTarget.dataset.status
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
      delay: 0
    })

    that.animation = animation

    animation.opacity(0).rotateX(-100).step()

    that.setData({
      '_drawerTmp_.animationData': animation.export()
    })

    setTimeout(function () {
      animation.opacity(1).rotateX(0).step()
      that.setData({
        '_drawerTmp_.animationData': animation
      })

      if (currentStatus == 'close') {
        that.setData({
          '_drawerTmp_.showModalStatus': false
        })
      }
    }.bind(that), 200)

    if (currentStatus == "open") {
      that.setData({
        '_drawerTmp_.showModalStatus': true
      });
    }
  },
  saveContent: function(e){
    this.setData({
      searchContent: e.detail.value
    })
  },
  scanBill: function () {
    wx.scanCode({
      success: function () {
        console.log('success')
      }
    })
  }
}

function appHeader() {
  let pages = getCurrentPages()
  let curPage = pages[pages.length - 1]

  this._page = curPage
  Object.assign(curPage,_tmpEvent)
  curPage.appHeader = this

  curPage.setData(_tmpData)
  return this
}

module.exports = {
  appHeader
}