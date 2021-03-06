const app = getApp();
var webim = require('../../utils/webim.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    tmpUserInfo: {},
    gender: ['女', '男'],
    genderIndex: 0,
    region: null,
    customItem: '全部',
    profession: ['计算机/互联网/通信', '生产/工艺/制造', '医疗/护理/制药', '金融/银行/投资/保险', '商业/服务业/个体经营', '文化/广告/传媒', '娱乐/艺术/表演', '律师/法务', '教育/培训', '公务员/行政/事业单位', '文员', '模特', '空姐', '学生', '家庭主妇'],
    professionIndex: 0,
    affectiveState: ['保密', '单身贵族', '名花有主']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tmp = this.data.tmpUserInfo;
    tmp.token = app.globalData.userInfo.token;
    var region = ['北京市', '北京市', '东城区'];
    if (app.globalData.userInfo.hometown) {
      region = app.globalData.userInfo.hometown.split(',');
    }
    this.setData({ userInfo: app.globalData.userInfo, tmpUserInfo: tmp, genderIndex: app.globalData.userInfo.gender, region: region });
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

  }, chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        that.uploadImg(res.tempFilePaths);
      }
    })
  }, uploadImg: function (pics) {
    var that = this;
    wx.uploadFile({
      url: app.host + "/file/upload",
      filePath: pics[0],
      name: 'file',
      formData: {
        'token': app.globalData.userInfo.token
      },
      success: (res) => {
        if (res.statusCode == 200) {
          var back = JSON.parse(res.data);
          if (back.success) {
            var tmp = that.data.tmpUserInfo;
            tmp.picture = back.result;
            that.setData({ tmpUserInfo: tmp });
            that.updateUserInfo();
          }
        }
      },
      fail: (e) => {
        wx.hideToast();
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      }
    })
  },
  updateUserInfo: function () {
    wx.showLoading();
    var that = this;
    wx.request({
      url: app.host + "/juser/updateuser",
      data: that.data.tmpUserInfo,
      dataType: 'json',
      method: 'GET',
      success: function (res) {
        if (res.data.success) {
          wx.setStorage({
            key: 'localUser',
            data: res.data.result
          });
          wx.showToast({
            title: '修改成功'
          });
          webim.logout((res) => {
            setTimeout(function () {
              wx.reLaunch({ url: '/pages/personal/personal' });
            }, 1000);
            app.onLaunch();
          });
        }
      }, fail: (res) => {
        util.toast(res.errorMsg);
      }, complete: (res) => {
        wx.hideLoading();
      }
    })
  }, selectGender: function (e) {
    var index = e.detail.value;
    var tmp = this.data.tmpUserInfo;
    tmp.gender = index;
    this.setData({ tmpUserInfo: tmp, genderIndex: index });
    this.updateUserInfo();
  }, selectBirthday: function (e) {
    var tmp = this.data.tmpUserInfo;
    tmp.birthday = e.detail.value;
    this.setData({ tmpUserInfo: tmp });
    this.updateUserInfo();
  },
  //修改家乡
  bindRegionChange: function (e) {
    var tmp = this.data.tmpUserInfo;
    var hometown = e.detail.value;
    tmp.hometown = hometown.join(',');
    this.setData({
      region: e.detail.value,
      tmpUserInfo: tmp
    })
    this.updateUserInfo();
  }, selectProfession: function (e) {
    this.data.tmpUserInfo.occupation = this.data.profession[e.detail.value];
    this.setData({ professionIndex: e.detail.value, tmpUserInfo: this.data.tmpUserInfo });
    this.updateUserInfo();
  }, selectAffective: function (e) {
    this.data.tmpUserInfo.emotion = e.detail.value;
    this.setData({ tmpUserInfo: this.data.tmpUserInfo });
    this.updateUserInfo();
  }, gotoEditSignatureView: function () {
    wx.navigateTo({
      url: 'signature/signature'
    })
  }, gotoNick_editView: function () {
    wx.navigateTo({
      url: 'nick_edit/nick_edit'
    })
  }
})