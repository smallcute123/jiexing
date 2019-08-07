// pages/result/result.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['这样最省时', '这样最省钱', '这样最舒适'],
    currentTab: 0,
    result:[]


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在查询',
    })
    var that = this;
    const destination = app.globalData.destination
    const address = app.globalData.bluraddress
    const city = app.globalData.city
    const strcity = app.globalData.strcity
    const startdate = app.globalData.startDate
    const currentTab = this.data.currentTab
    console.log(destination, address, city, strcity, currentTab)
    if (currentTab==0)
    {wx.request({
      url: 'https://www.alwayscxy.cn/xuegepi/Posttoc.do',
      data: {
        date:startdate ,
        strcity: strcity,
        address: address,
        city: city,
        destination: destination,
        currentTab: currentTab
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data == "fail") {
          wx.hideLoading();
          wx.showModal({
            title: '查询失败！',
            content: '已将失败信息发送给管理员',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.switchTab({
                  url: "/pages/index/index",
                })
              } else {
                wx.switchTab({
                  url: "/pages/index/index",
                })
                console.log('用户点击取消')
              }

            }
          })
        }
        else{
        var jsonLength = 0;
        var i = 0;
        for (var item in res.data) {
          i++;
        }
        var j = i / 6;
        for (var i = 0; i < j; i++) {
          var key = jsonLength;
          var way = res.data[key + 4];
          console.log(way)
          var newArray = [{ way: res.data[key], strtime: res.data[key + 1], line: res.data[key + 2], straddress: res.data[key + 3], endaddress: res.data[key + 4], endtime: res.data[key + 5] }];
          app.globalData.result = newArray;
          console.log(newArray)
          that.setData({
            result: that.data.result.concat(newArray)
          })
          jsonLength = jsonLength + 6;
        }
        wx.hideLoading();

      }
      },
      fail: function (res) {
        console.log(".....fail.....");
        wx.hideLoading();
        wx.showModal({
          title: '查询失败！',
          content: '已将失败信息发送给管理员',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.redirectTo({
                url: '/pages/index/index',
              })
            } else {
              wx.redirectTo({
                url: '/pages/index/index',
              })
              console.log('用户点击取消')
            }

          }
        })
      }
    })
  }
// else if(currentTab==1)
// {
//   wx.request({
//     url: 'https://www.alwayscxy.cn/xuegepi/Posttoc.do',
//     data: {
//       date: startdate,
//       strcity: strcity,
//       address: address,
//       city: city,
//       destination: destination,
//       currentTab: currentTab
//     },
//     method: 'POST',
//     header: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     success: function (res) {
//       console.log(res.data);
//       var jsonLength = 0;
//       var i = 0;
//       for (var item in res.data) {
//         i++;
//       }
//       var j = i / 6;
//       for (var i = 0; i < j; i++) {
//         var key = jsonLength;
//         var way = res.data[key + 4];
//         console.log(way)
//         var newArray = [{ way: res.data[key], strtime: res.data[key + 1], line: res.data[key + 2], straddress: res.data[key + 3], endaddress: res.data[key + 4], endtime: res.data[key + 5] }];
//         app.globalData.result = newArray;
//         console.log(newArray)
//         that.setData({
//           result: that.data.result.concat(newArray)
//         })
//         jsonLength = jsonLength + 6;
//       }

//     },
//     fail: function (res) {
//       console.log(".....fail.....");
//     }
//   })
// }
// else if (currentTab==2) {
//   wx.request({
//     url: 'https://www.alwayscxy.cn/xuegepi/Posttoc.do',
//     data: {
//       date: startdate,
//       strcity: strcity,
//       address: address,
//       city: city,
//       destination: destination,
//       currentTab: currentTab
//     },
//     method: 'POST',
//     header: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     success: function (res) {
//       console.log(res.data);
//       var jsonLength = 0;
//       var i = 0;
//       for (var item in res.data) {
//         i++;
//       }
//       var j = i / 6;
//       for (var i = 0; i < j; i++) {
//         var key = jsonLength;
//         var way = res.data[key + 4];
//         console.log(way)
//         var newArray = [{ way: res.data[key], strtime: res.data[key + 1], line: res.data[key + 2], straddress: res.data[key + 3], endaddress: res.data[key + 4], endtime: res.data[key + 5] }];
//         app.globalData.result = newArray;
//         console.log(newArray)
//         that.setData({
//           result: that.data.result.concat(newArray)
//         })
//         jsonLength = jsonLength + 6;
//       }

//     },
//     fail: function (res) {
//       console.log(".....fail.....");
//     }
//   })
// }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  navbarTap: function (e) {
    wx.showLoading({
      title: '正在查询',
    })
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
       result: []
    })
    var that = this;
    const destination = app.globalData.destination
    const address = app.globalData.bluraddress
    const city = app.globalData.city
    const strcity = app.globalData.strcity
    const startdate = app.globalData.startDate
    const currentTab = this.data.currentTab
    console.log(destination,address,city,strcity,currentTab)
    if (currentTab == 0) {
      wx.request({
        url: 'https://www.alwayscxy.cn/xuegepi/Posttoc.do',
        data: {
          date:startdate,
          strcity: strcity,
          address: address,
          city: city,
          destination: destination,
          currentTab: currentTab
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data);
          if (res.data == "fail") {
            wx.hideLoading();
            wx.showModal({
              title: '查询失败！',
              content: '已将失败信息发送给管理员',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.switchTab({
                    url: "/pages/index/index",
                  })
                } else {
                  wx.switchTab({
                    url: "/pages/index/index",
                  })
                  console.log('用户点击取消')
                }

              }
            })
          }
          else {
            var jsonLength = 0;
            var i = 0;
            for (var item in res.data) {
              i++;
            }
            var j = i / 6;
            for (var i = 0; i < j; i++) {
              var key = jsonLength;
              var way = res.data[key + 4];
              console.log(way)
              var newArray = [{ way: res.data[key], strtime: res.data[key + 1], line: res.data[key + 2], straddress: res.data[key + 3], endaddress: res.data[key + 4], endtime: res.data[key + 5] }];
              app.globalData.result = newArray;
              console.log(newArray)
              that.setData({
                result: that.data.result.concat(newArray)
              })
              jsonLength = jsonLength + 6;
            }
            wx.hideLoading();

          }
        },
        fail: function (res) {
          console.log(".....fail.....");
          wx.hideLoading();
          wx.showModal({
            title: '查询失败！',
            content: '已将失败信息发送给管理员',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.redirectTo({
                  url: '/pages/index/index',
                })
              } else {
                wx.redirectTo({
                  url: '/pages/index/index',
                })
                console.log('用户点击取消')
              }

            }
          })
        }
      })
    }
  else if(currentTab== 1)
{
  wx.request({
    url: 'https://www.alwayscxy.cn/xuegepi/Posttoc.do',
    data: {
      date: startdate,
      strcity: strcity,
      address: address,
      city: city,
      destination: destination,
      currentTab: currentTab
    },
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log(res.data);
      if (res.data == "fail") {
        wx.hideLoading();
        wx.showModal({
          title: '查询失败！',
          content: '已将失败信息发送给管理员',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.switchTab({
                url: "/pages/index/index",
              })
            } else {
              wx.switchTab({
                url: "/pages/index/index",
              })
              console.log('用户点击取消')
            }

          }
        })
      }
      else {
        var jsonLength = 0;
        var i = 0;
        for (var item in res.data) {
          i++;
        }
        var j = i / 6;
        for (var i = 0; i < j; i++) {
          var key = jsonLength;
          var way = res.data[key + 4];
          console.log(way)
          var newArray = [{ way: res.data[key], strtime: res.data[key + 1], line: res.data[key + 2], straddress: res.data[key + 3], endaddress: res.data[key + 4], endtime: res.data[key + 5] }];
          app.globalData.result = newArray;
          console.log(newArray)
          that.setData({
            result: that.data.result.concat(newArray)
          })
          jsonLength = jsonLength + 6;
        }
        wx.hideLoading();

      }
    },
    fail: function (res) {
      console.log(".....fail.....");
      wx.hideLoading();
      wx.showModal({
        title: '查询失败！',
        content: '已将失败信息发送给管理员',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.redirectTo({
              url: '/pages/index/index',
            })
          } else {
            wx.redirectTo({
              url: '/pages/index/index',
            })
            console.log('用户点击取消')
          }

        }
      })
    }
  })
}
else if (currentTab == 2) {
  wx.request({
    url: 'https://www.alwayscxy.cn/xuegepi/Posttoc.do',
    data: {
      date: startdate,
      address: address,
      strcity: strcity,
      city: city,
      destination: destination,
      currentTab: currentTab
    },
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log(res.data);
      if (res.data == "fail") {
        wx.hideLoading();
        wx.showModal({
          title: '查询失败！',
          content: '已将失败信息发送给管理员',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.switchTab({
                url: "/pages/index/index",
              })
            } else {
              wx.switchTab({
                url: "/pages/index/index",
              })
              console.log('用户点击取消')
            }

          }
        })
      }
      else {
        var jsonLength = 0;
        var i = 0;
        for (var item in res.data) {
          i++;
        }
        var j = i / 6;
        for (var i = 0; i < j; i++) {
          var key = jsonLength;
          var way = res.data[key + 4];
          console.log(way)
          var newArray = [{ way: res.data[key], strtime: res.data[key + 1], line: res.data[key + 2], straddress: res.data[key + 3], endaddress: res.data[key + 4], endtime: res.data[key + 5] }];
          app.globalData.result = newArray;
          console.log(newArray)
          that.setData({
            result: that.data.result.concat(newArray)
          })
          jsonLength = jsonLength + 6;
        }
        wx.hideLoading();

      }
    },
    fail: function (res) {
      console.log(".....fail.....");
      wx.hideLoading();
      wx.showModal({
        title: '查询失败！',
        content: '已将失败信息发送给管理员',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.redirectTo({
              url: '/pages/index/index',
            })
          } else {
            wx.redirectTo({
              url: '/pages/index/index',
            })
            console.log('用户点击取消')
          }

        }
      })
    }
  })
}

  }

})