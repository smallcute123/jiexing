import util from '../../utils/index';
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
const app = getApp();
Page({
  data: {
    currentCost: 0,
    navScrollLeft: 0,
    duration: 1000,
    interval: 5000,
    isLoading: true,
    color: "#cccccc",
    callCart: true,
    destination: '',
    bluraddress: '',
    index: '',
    startDate: "",
    strcity: "",
    isOpen: false,
    statusMsg: '未连接',
    city: "",
    city1:"",
    result: [],
    tmp: "",
    txt: "",
    code: "",
    qlty: "",
    dir: "",
    sc: "",
    hum: "",
    fl:"",
    daily_forecast:"",
    province:"",
    city1: "",
    district: "",
    latitude: "",
    longitude:"",

    multiArray: [['今天', '明天', '3-2', '3-3', '3-4', '3-5'], [0, 1, 2, 3, 4, 5, 6], [0, 10, 20]],
    multiIndex: [0, 0, 0],
    limit:0

  },
  onLoad(){
    qqmapsdk = new QQMapWX({
      key: '3GJBZ-X6SKD-Q4Q46-PYUL2-TQXAS-XHBLN' //这里自己的key秘钥进行填充
    });
    let vm = this;
    vm.getUserLocation();

  },

  getUserLocation: function () {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        }
        else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },

  // 微信获得经纬度

  getLocation: function () {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: function (res) {
      }
    })
  },

  // 获取当前地理位置

  getLocal: function (latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        let district = res.result.ad_info.district
        vm.setData({
          province: province,
          city1: city,
          district: district,
          latitude: latitude,
          longitude: longitude
        })
        vm.getWeahter(vm.data.city1)
      },
      fail: function (res) {
      },
      complete: function (res) {
      }
    });
  },
   getWeahter: function (city) {
    var that = this
     var url = "https://free-api.heweather.net/s6/weather"
    var params = {
      location: city,
      key: "617d00cd4b2d4c9eb63c973ad9c719ab"
    }
    wx.request({
      url: url,
      data: params,
      success: function (res) {
        console.log(res);
        var tmp = res.data.HeWeather6[0].now.tmp;
        var txt = res.data.HeWeather6[0].now.cond_txt;
        var code = res.data.HeWeather6[0].now.cond_code;
        var qlty = res.data.HeWeather6[0].lifestyle[7].brf;
        var dir = res.data.HeWeather6[0].now.wind_dir;
        var sc = res.data.HeWeather6[0].now.wind_sc;
        var hum = res.data.HeWeather6[0].now.hum;
        var fl = res.data.HeWeather6[0].now.fl;
        var daily_forecast = res.data.HeWeather6[0].daily_forecast;
        that.setData({
          tmp: tmp,
          txt: txt,
          code: code,
          qlty: qlty,
          dir: dir,
          sc: sc,
          hum: hum,
          fl: fl,
          daily_forecast: daily_forecast
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  
  onShow() {
    this.setData({
      startDate: app.globalData.startDate,
      address: app.globalData.bluraddress,
      destination: app.globalData.destination,
      city: app.globalData.city,
      strcity: app.globalData.strcity,
      limit:app.globalData.limit
    })
  },

  toCast: function (e) {
    var that = this;
    const destination = this.data.destination
    const address = this.data.address
    const city = this.data.city
    const strcity = this.data.strcity
    const startdate = this.data.startDate
    if (destination == '') {
      wx.showToast({
        title: '目的地不能为空',
        icon: 'fail',
        mask: true,
        duration: 1000
      })
    }
    if (startdate == "") {
      wx.showToast({
        title: '请选择出发日期',
        icon: 'fail',
        mask: true,
        duration: 1000
      })
    }

    else {
      // wx.request({
      //   url: 'https://www.alwayscxy.cn/xuegepi/start.do',
      //   data: {
      //     date: startdate,
      //     strcity: strcity,
      //     address: address,
      //     city: city,
      //     destination: destination,
      //     username:username
      //   },
      //   method: 'POST',
      //   header: {
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   },
      //   success: function (res) {
      //     console.log(res.data);
      //   }, fail: function (res) {
      //     console.log(".....fail.....");
      //   }
      // }),
      wx.navigateTo({
        url: '/pages/result/result',
      })
    }
  },

  pickerTap:function () {
    date = new Date();

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    // 月-日
    for (var i = 2; i <= 28; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);
      var md = (date1.getMonth() + 1) + "-" + date1.getDate();
      monthDay.push(md);
    }

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    if (data.multiIndex[0] === 0) {
      if (data.multiIndex[1] === 0) {
        this.loadData(hours, minute);
      } else {
        this.loadMinute(hours, minute);
      }
    } else {
      this.loadHoursMinute(hours, minute);
    }

    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;

    this.setData(data);
  },

  bindMultiPickerColumnChange: function (e) {
    date = new Date();

    var that = this;

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    data.multiIndex[e.detail.column] = e.detail.value;

    // 然后再判断当前改变的是哪一列,如果是第1列改变
    if (e.detail.column === 0) {
      // 如果第一列滚动到第一行b
      if (e.detail.value === 0) {

        that.loadData(hours, minute);

      } else {
        that.loadHoursMinute(hours, minute);
      }

      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;

      // 如果是第2列改变
    } else if (e.detail.column === 1) {

      // 如果第一列为今天
      if (data.multiIndex[0] === 0) {
        if (e.detail.value === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
        // 第一列不为今天
      } else {
        that.loadHoursMinute(hours, minute);
      }
      data.multiIndex[2] = 0;

      // 如果是第3列改变
    } else {
      // 如果第一列为'今天'
      if (data.multiIndex[0] === 0) {

        // 如果第一列为 '今天'并且第二列为当前时间
        if (data.multiIndex[1] === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
      } else {
        that.loadHoursMinute(hours, minute);
      }
    }
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },

  loadData: function (hours, minute) {

    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = minuteIndex; i < 60; i += 10) {
        minute.push(i);
      }
    }
  },

  loadHoursMinute: function (hours, minute) {
    // 时
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  loadMinute: function (hours, minute) {
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  bindStartMultiPickerChange: function (e) {
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];

    if (monthDay === "今天") {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      monthDay = month + "月" + day + "日";
    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";

    } else {
      var month = monthDay.split("-")[0]; // 返回月
      var day = monthDay.split("-")[1]; // 返回日
      monthDay = month + "月" + day + "日";
    }

    var startDate = monthDay + " " + hours + ":" + minute;
    that.setData({
      startDate: startDate

    })
    app.globalData.startDate = startDate;
  }
})