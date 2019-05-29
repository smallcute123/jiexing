import util from '../../utils/index';
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key: '3GJBZ-X6SKD-Q4Q46-PYUL2-TQXAS-XHBLN'
});
const app = getApp()
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
  },
  onShow() {
    this.setData({

      address: app.globalData.bluraddress,
      destination: app.globalData.destination,
      currentTab: app.globalData.id,
    })
  },

  toCast(e) {
    const destination = this.data.destination
    if (destination == '') {
      wx.showToast({
        title: '目的地不能为空',
        icon: 'fail',
        mask: true,
        duration: 1000
      })
    } else {

      let { endLatitude, endLongitude } = app.globalData
      qqmapsdk.calculateDistance({
        mode: 'driving',
        to: [{
          latitude: endLatitude,
          longitude: endLongitude
        }],
        success: (res) => {
          // console.log(res.result.elements[0].distance)
          var num1 = 8 + 1.9 * (res.result.elements[0].distance / 1000)
          var num2 = 12 + 1.8 * (res.result.elements[0].distance / 1000)
          var num3 = 16 + 2.9 * (res.result.elements[0].distance / 1000)
          var play1 = num1.toFixed(1)
          var play2 = num2.toFixed(1)
          var play3 = num3.toFixed(1)
          this.setData({
            play1: play1,
            play2: play2,
            play3: play3,
          })
        },

      });
      this.setData({

        callCart: false
      })
    }


  },
  switchNav(event) {

    this.requestWaitingtime();
    const cart = event.currentTarget.dataset.name
    let text = this.data.navData;
    this.setData({
      cart,
      isLoading: true,
      waitingTimes: ''
    })
    var cur = event.currentTarget.dataset.current;
    var singleNavWidth = this.data.windowWindth / 6;

    this.setData({
      navScrollLeft: (cur - 1) * singleNavWidth,
      currentTab: cur,
    })
  },
  onChange(e) {
    const currentCost = e.target.dataset.index;
    this.setData({
      currentCost
    })

  }
})