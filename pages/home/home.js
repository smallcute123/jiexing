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
    city:"",
    searchRecord: []
  },
  openHistorySearch: function () {
    this.setData({
      searchRecord: wx.getStorageSync('searchRecord') || [],//若无储存则为空
    })
  },
  onLoad: function () {
    this.openHistorySearch();
    this.setData({
    city: app.globalData.city
  })
  },
  openHistorySearch: function () {
    this.setData({
      searchRecord: wx.getStorageSync('searchRecord') || [],//若无储存则为空
    })
  },

  searchSubmitFn: function (e) {
    var that = this
    var inputVal = e.detail.value.input
    var searchRecord = this.data.searchRecord
    if (inputVal == '') {
      //输入为空时的处理
    }
    else {
      //将搜索值放入历史记录中,只能放前五条
      if (searchRecord.length < 5) {
        searchRecord.unshift(
          {
            value: inputVal,
            id: searchRecord.length
          }
        )
      }
      else {
        searchRecord.pop()//删掉旧的时间最早的第一条
        searchRecord.unshift(
          {
            value: inputVal,
            id: searchRecord.length
          }
        )
      }
      //将历史记录数组整体储存到缓存中
      wx.setStorageSync('searchRecord', searchRecord)
    }
  },
  historyDelFn: function () {
    wx.clearStorageSync('searhRecord')
    this.setData({
      searchRecord: []
    })
  },
  toIndex(e) {
    var searchRecord = this.data.searchRecord;
    const destination = e.currentTarget.dataset.destination;
    const endAddress = e.currentTarget.dataset.end;
    qqmapsdk.geocoder({
      address: endAddress,
      success: function (res) {
        app.globalData.endLatitude = res.result.location.lat;
        app.globalData.endLongitude = res.result.location.lng;
      }
    })
    if (searchRecord.length < 5) {
      searchRecord.unshift(
        {
          value:destination,
          id: searchRecord.length
        }
      )
    }
    else {
      searchRecord.pop()//删掉旧的时间最早的第一条
      searchRecord.unshift(
        {
          value:destination,
          id: searchRecord.length
        }
      )
    }
    //将历史记录数组整体储存到缓存中
    wx.setStorageSync('searchRecord', searchRecord),
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
    var value = e.detail.value;
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