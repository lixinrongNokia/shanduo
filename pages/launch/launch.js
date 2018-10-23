const app = getApp();
var util = require('../../utils/util.js');
Page({
  onLoad: function () {
  },
  onShow: function () {
    wx.hideTabBar({
      animation: true
    })
  },
  binShow: function () {
    wx.showTabBar({
      animation: true
    });
    wx.switchTab({
      url: '/' + app.currentPage
    });
  }, pushActivity: function () {
    if (app.globalData.userInfo != null) {
      wx.navigateTo({ url: '/pages/release_hd/release_hd' });
    } else {
      util.toast('请登录')
    }
  },
  pushDynamic: function () {
    if (app.globalData.userInfo != null) {
      wx.navigateTo({ url: '/pages/release_dt/release_dt' });
    } else {
      util.toast('请登录');
    }
  }
})