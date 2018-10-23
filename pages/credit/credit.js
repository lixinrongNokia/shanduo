// pages/credit/credit.js
const app = getApp();
var util = require('../../utils/util.js')
var userId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    //定义动态数组
    crediPoints: [{
      currentPage: 1,
      totalpage: 0,
      arrayResult: []
    }, {
      currentPage: 1,
      totalpage: 0,
      arrayResult: []
    }],
    bodyInfo: null,
    pageSize: 20,
    host: null
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.emptyData();
    this.loadCrediPoints();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTab == cur) { return; }
    this.setData({ currentTab: cur })
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function (options) {
    var that = this;
    userId = options.userId ? options.userId : "";
    that.setData({ host: app.host });
    // 高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        that.setData({
          winHeight: calc
        });
      }
    });
    that.loadCrediPoints();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.emptyData();
    this.loadCrediPoints(true);
  },
  //上拉加载更多
  onReachBottom: function () {
    if (this.data.currentTab == 0) {
      var currentIndex = this.data.crediPoints[this.data.currentTab].currentPage;
      if (this.data.crediPoints[this.data.currentTab].totalpage > currentIndex) {
        this.data.crediPoints[this.data.currentTab].currentPage = parseInt(currentIndex) + 1;
        this.setData({ crediPoints: this.data.crediPoints });
        this.loadCrediPoints();
      } else {
        util.toast('没有更多')
      }
    } else {
      var currentIndex = this.data.crediPoints[this.data.currentTab].currentPage;
      if (this.data.crediPoints[this.data.currentTab].totalpage > currentIndex) {
        this.data.crediPoints[this.data.currentTab].currentPage = parseInt(currentIndex) + 1;
        this.setData({ crediPoints: this.data.crediPoints });
        this.loadCrediPoints();
      } else {
        util.toast('没有更多')
      }
    }
  },
  loadCrediPoints: function (refresh) {
    var that = this;
    var token = "";
    if (app.globalData.userInfo) {
      token = app.globalData.userInfo.token
    }
    wx.request({
      data: {
        token: token,
        userId: userId,
        type: parseInt(that.data.currentTab) + 1,
        page: that.data.crediPoints[that.data.currentTab].currentPage,
        pageSize: that.data.pageSize
      },
      url: app.host + '/reputation/creditDetails',
      success: (res) => {
        console.log(res);
        if (res.data.success) {
          if (res.data.result.list.length > 0) {
            var oldArrayResult = that.data.crediPoints[that.data.currentTab].arrayResult;
            that.data.crediPoints[that.data.currentTab].arrayResult = oldArrayResult.concat(res.data.result.list);
          }
          that.data.crediPoints[that.data.currentTab].totalpage = res.data.result.totalpage;
          that.data.bodyInfo = res.data.result.map;
          that.data.bodyInfo.level = that.levelConversion(that.data.bodyInfo.reputation);
          that.setData({ crediPoints: that.data.crediPoints, bodyInfo: that.data.bodyInfo })
        }
      }, complete: function () {
        if (refresh) {
          wx.stopPullDownRefresh();
        }
      }
    })
  }, emptyData: function () {
    var that = this;
    var ary = that.data.crediPoints[that.data.currentTab].arrayResult;
    ary.splice(0, ary.length);
    that.data.crediPoints[that.data.currentTab].arrayResult = ary;
    that.data.crediPoints[that.data.currentTab].currentPage = 1;
    that.data.crediPoints[that.data.currentTab].totalpage = 0;
    that.setData({
      crediPoints: that.data.crediPoints
    })
  },
  //等级换算
  levelConversion: function (reputation) {
    var level = '';
    if (reputation <= 20) {
      level = '初窥门径'
    } else if (reputation <= 60) {
      level = '登堂入室'
    } else if (reputation <= 200) {
      level = '炉火纯青'
    } else if (reputation <= 500) {
      level = '登峰造极'
    } else if (reputation <= 1000) {
      level = '出神入化'
    } else if (reputation <= 2000) {
      level = '意境入门'
    } else if (reputation <= 5000) {
      level = '意境小成'
    } else if (reputation <= 10000) {
      level = '意境大成'
    } else if (reputation <= 20000) {
      level = '意境圆满'
    }
    return level;
  }
})