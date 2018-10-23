const app = getApp();
var dateUtil = require('../../utils/date_util.js');
var util = require('../../utils/util.js');
var dynamicId, commentId, respondent, replyName;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    secondComments: [],
    pageIndex: 1,
    pageSize: 20,
    totalPage: 0,
    host: null,
    comments: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    dynamicId = options.dynamicId;
    commentId = options.commentId;
    respondent = options.respondent;
    replyName = options.replyName;
    this.setData({ host: app.host })
    this.loadSecondCommentList();
  }, loadSecondCommentList: function () {
    var that = this;
    wx.request({
      url: app.host + '/jdynamic/commentList',
      data: {
        commentId: commentId,
        page: that.data.pageIndex,
        pageSize: that.data.pageSize
      },
      dataType: 'json',
      method: 'GET',
      success: (res) => {
        console.log(res);
        if (res.data.success) {
          var oldList = that.data.secondComments;
          var newList = res.data.result.list;
          if (newList.length > 0) {
            for (var i in newList) {
              newList[i].createDate = dateUtil.formatMsgTime(newList[i].createDate);
            }
            that.data.secondComments = oldList.concat(newList);
            that.setData({ secondComments: that.data.secondComments, totalPage: res.data.result.totalPage });
          }
        }
      }
    })
  }, inputSecondComments: function (e) {
    this.setData({ comments: e.detail.value });
  }, sendSecondComments: function () {
    var that = this;
    if (!app.globalData.userInfo){
      util.toast('登录后操作');
      return;
    }
    if (!util.checkInput(that.data.comments)) {
      util.toast('不能发送空白内容');
      return;
    }
    wx.request({
      url: app.host + '/jdynamic/savecomment',
      data: {
        token: app.globalData.userInfo.token,
        dynamicId: dynamicId,
        comment: that.data.comments,
        typeId: 2,
        commentId: commentId,
        respondent: respondent
      },
      dataType:'json',
      success:(res)=>{
        if(res.data.success){
          var date=new Date();
          let comm={
            comment: that.data.comments,
            createDate: dateUtil.formatMsgTime(date.getTime()),
            portraitId: app.globalData.headImg,
            replyName: replyName,
            userName: app.globalData.userInfo.name
          }
          that.data.secondComments.push(comm);
          that.setData({ secondComments: that.data.secondComments, comments:''});
        }
      }
    })
  }
})