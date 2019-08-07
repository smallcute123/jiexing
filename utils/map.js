var QQMapWX = require('../libs/qqmap-wx-jssdk.js');
var qqwxmap;
qqwxmap = new QQMapWX({
  key: '3GJBZ-X6SKD-Q4Q46-PYUL2-TQXAS-XHBLN'
});
const qq = 'sdfsdf';
export default class qqmap {//获取定位信息
  getLocateInfo() {
    let that = this;
    return new Promise(function (resolve, reject) {
      that.location().then(function (val) {
        //如果通过授权，那么直接使用腾讯的微信小程序sdk获取当前定位城市
        qqwxmap.reverseGeocoder({
          location: { 
            latitude: val.latitude,
            longitude: val.longitude
          },
          success: function (res) {
            console.log(res.result.address_component.city);
            resolve(res.result.address_component.city);//返回城市
          },
          fail: function (res) {
            reject(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });

      }, function (error) {
        //如果用户拒绝了授权，那么这里会提醒他，去授权后再定位
        console.log('shibai');
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
                   that.getLocateInfo();
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

      })

    })
  }

  //定位，获取当前经纬度
  location() {
    return new Promise(function (resolve, reject) {
      wx.getLocation({
        altitude: true,
        success: function (res) {
          resolve(res);
        }, fail(res) {
          reject(res);
        }
      })
    });

  }


}