
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
      wx.request({
        url: 'https://www.alwayscxy.cn/xuegepi/initial.do',
        data: {
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data);
          wx.switchTab({
       url: 'index',
     })

        },
        fail: function (res) {
          console.log(".....fail.....");
        }
      })
      app.globalData.limit = 1
    
    // time1 = setTimeout(function () {
    //   wx.hideLoading()
    //   wx.switchTab({
    //     url: 'index',
    //   })
    // }, 2000)
  }
})
