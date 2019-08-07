// pages/starting/starting.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key: '3GJBZ-X6SKD-Q4Q46-PYUL2-TQXAS-XHBLN'
});
const app = getApp();
Page({
  data: {
    scale: 16,
    latitude: 0,
    longitude: 0,
    address: '',
    bluraddress: '',
    strcity:'',
    searchRecord1:[
      "上海虹桥[地铁站]",
      "万达城[地铁站]"
    ]
  },
  openHistorySearch: function() {
    this.setData({
    searchRecord1: wx.getStorageSync('searchRecord1') || [],//若无储存则为空
    })
  },

  onLoad: function (options) {
      this.setData({
       strcity: app.globalData.strcity
      }),
      this.openHistorySearch()

    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        // console.log(res)
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })

        var that = this;
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          success: function (res) {

            app.globalData.location = location
            that.setData({
              address: res.result.address,
              bluraddress: res.result.formatted_addresses.recommend
            });
            let bluraddress = that.data.bluraddress;
            let address=that.data.address;
            app.globalData.bluraddress=bluraddress;
            console.log(bluraddress,address);
            qqmapsdk.geocoder({
              //获取表单传入地址
              address: address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
              success: function (res) {//成功后的回调
                console.log(res);
                var res = res.result;
                var latitude = res.location.lat;
                var longitude = res.location.lng;
                //根据地址解析在地图上标记解析地址位置
                that.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
                  markers: [{
                    id: 0,
                    title: res.title,
                    latitude: latitude,
                    longitude: longitude,
                    iconPath: '../../assets/images/address.png',//图标路径
                    width: 40,
                    height: 40,
                    callout: { //可根据需求是否展示经纬度
                      content: latitude + ',' + longitude,
                      color: '#000',
                      display: 'ALWAYS'
                    }
                  }],
                  poi: { //根据自己data数据设置相应的地图中心坐标变量名称
                    latitude: latitude,
                    longitude: longitude
                  }
                });
              },
              fail: function (error) {
                console.error(error);

              },
              complete: function (res) {
                console.log(res);
              }
            });
          }
        })
          },

        });
     
  },
  toIndex(e) {
    var searchRecord1 = this.data.searchRecord1
    const bluraddress= e.currentTarget.dataset.destination;
    const strAddress = e.currentTarget.dataset.end;
    qqmapsdk.geocoder({
      address: strAddress,
      success: function (res) {
        app.globalData.strLatitude = res.result.location.lat;
        app.globalData.strLongitude = res.result.location.lng;
      }
    })
    if (searchRecord1.length < 5) {
      searchRecord1.unshift(
        {
          value: bluraddress,
          id: searchRecord1.length
        }
      )
    }
    else {
      searchRecord1.pop()//删掉旧的时间最早的第一条
      searchRecord1.unshift(
        {
          value:bluraddress,
          id: searchRecord1.length
        }
      )
    }
    //将历史记录数组整体储存到缓存中
    wx.setStorageSync('searchRecord1', searchRecord1),
    app.globalData.bluraddress = bluraddress,
      wx.switchTab({
        url: "/pages/index/index",
      })
  },
  delete(e){
    wx.clearStorageSync('searhRecord1')
    this.setData({
      searchRecord1: []
    })

  },
  switchCity(e) {
    wx.redirectTo({
      url: "/pages/citys/citys",
    })
  },
  searchInputend(e) {

    var that = this;
    var value = e.detail.value  
    var address = that.address;
    var city = app.globalData.strcity;
    qqmapsdk.getSuggestion({
      keyword: value + "地铁站",
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