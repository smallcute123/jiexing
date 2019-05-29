
const app = getApp()
var time1 = null
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数

  onLoad: function () {

  },
  onShow: function () {
    time1 = setTimeout(function () {
      wx.hideLoading()
      wx.redirectTo({
        url: 'index',
      })
    }, 2000)
  }
})
