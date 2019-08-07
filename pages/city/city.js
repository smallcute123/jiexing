// pages/city/city.js

import qqmap from '../../utils/map.js';//这里的路径看你自己的文件路径
const app = getApp();
Page({
  data: {
    //下面是字母排序
    letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    cityListId: '',
    //下面是城市列表信息，这里只是模拟数据
    citylist: [{ "letter": "B", "data": [{ "id": "v1", "cityName": "北京" }] }, { "letter": "C", "data": [{ "id": "v32", "cityName": "长沙" }] }, { "letter": "H", "data": [{ "id": "v35", "cityName": "合肥" }] }, { "letter": "K", "data": [{ "id": "v20", "cityName": "兰州" }] }, { "letter": "S", "data": [{ "id": "v31", "cityName": "石家庄" }, { "id": "v40", "cityName": "深圳" }] }, { "letter": "W", "data": [{ "id": "v6", "cityName": "无锡" }] }, { "letter": "X", "data": [{ "id": "v23", "cityName": "西安" }, { "id": "v19", "cityName": "厦门" }] }],
    //下面是热门城市数据，模拟数据
    newcity: ['北京', '成都', '无锡'],
    // citySel: '全国',
    locateCity: '',
    city:""
  },

  //点击城市
  cityTap(e) {
    console.log(e)
    const val = e.currentTarget.dataset.val || '',
      types = e.currentTarget.dataset.types || '',
      Index = e.currentTarget.dataset.index || '',
      that = this;
    let city = this.data.citySel;
    switch (types) {
      case 'locate':
        //定位内容
        city = this.data.locateCity;
        break;
      case 'national':
        //全国
        city = '全国';
        break;
      case 'new':
        //热门城市
        city = val;
        break;
      case 'list':
        //城市列表
        city = val.cityName;
        break;
    }
    if (city) {
      wx.setStorage({
        key: 'city',
        data: city
      })
      //点击后给父组件可以通过bindcitytap事件，获取到cityname的值，这是子组件给父组件传值和触发事件的方法
      this.triggerEvent('citytap', { cityname: city });
      this.setData({
        city :city
      })
      app.globalData.city=this.data. city,
        wx.redirectTo({
          url: "/pages/home/home",
        })
      console.log(this.data.city);
    } else {
      console.log('还没有');
      this.getLocate();
    }

  },
  //点击城市字母
  letterTap(e) {
    const Item = e.currentTarget.dataset.item;
    this.setData({
      cityListId: Item
    });
    console.log("..............." + this.data.cityListId);
  },
  //调用定位
  getLocate() {
    let that = this;
    new qqmap().getLocateInfo().then(function (val) {//这个方法在另一个文件里，下面有贴出代码
      console.log(val);
      if (val.indexOf('市') !== -1) {//这里是去掉“市”这个字
        console.log(val.indexOf('市') - 1);
        val = val.slice(0, val.indexOf('市'));
        console.log(val);
      }
      that.setData({
        locateCity: val
      });
      //把获取的定位和获取的时间放到本地存储
      wx.setStorageSync('locatecity', { city: val, time: new Date().getTime() });
    });
  },

  onShow() {
    console.log(getApp());
    let that = this,
      cityOrTime = wx.getStorageSync('locatecity') || {},
      time = new Date().getTime(),
      city = '';
    if (!cityOrTime.time || (time - cityOrTime.time > 1800000)) {//每隔30分钟请求一次定位
      this.getLocate();
    } else {//如果未满30分钟，那么直接从本地缓存里取值
      that.setData({
        locateCity: cityOrTime.city
      })
    }


  }
})
