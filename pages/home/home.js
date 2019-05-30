import util from '../../utils/index';

var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key: '3GJBZ-X6SKD-Q4Q46-PYUL2-TQXAS-XHBLN'
});
const app = getApp();
Page({
  data: {
    value: '',
    address: [],
    city:""
  },
  onLoad: function () {this.setData({
    city: app.globalData.city
  })
  },

  toIndex(e) {
    const destination = e.currentTarget.dataset.destination;
    const endAddress = e.currentTarget.dataset.end;
    qqmapsdk.geocoder({
      address: endAddress,
      success: function (res) {
        app.globalData.endLatitude = res.result.location.lat;
        app.globalData.endLongitude = res.result.location.lng;
      }
    })
    app.globalData.destination = destination,
      wx.switchTab({
        url: "/pages/index/index",
      })
  },
  switchCity(e){
    wx.redirectTo({
      url: "/pages/city/city",
    })
  },
  searchInputend(e) {

    var that = this;
    var value = e.detail.value
    var address = that.address;
var city=app.globalData.city;
    qqmapsdk.getSuggestion({
      keyword: value+"地铁站",
      region: city,
      success: function (res) {
        let data = res.data
        that.setData({
          address: data,
          value
        })
      }
    })



  },

})