// pages/home/deny/deny.js
const app = getApp();
const token = require('../../../utils/token.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var res = wx.getSystemInfoSync();
    this.setData({
      height:res.windowHeight,
      width:res.windowWidth,
    })
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
    var that = this;
    var p = token.refresh(app);
    p.then(function () {
      return token.getUserInfo(app);
    })
    .then(function () {
      var users = app.globalData.user;
      if (users.status == 1) {
        token.getToken2(app);
        wx.switchTab({
          url: '/pages/home/home',
        })
      }
    }).catch(function (res) {
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        if (res.data.errmsg.indexOf('未找到用户信息') != -1) {
          wx.clearStorageSync();
          app.globalData.user = null;
          var that = this;
          that.setData({
            user: null,
          });
          console("deny跳转注册页面")
          wx.reLaunch({
            url: '/pages/login/register2',
          })
        } else {
          token.refreshPage(res, that);
        }
      } else if (res!=null && res.data!=null && res.data.notes == '间隔刷新3') {
        console("deny跳转注册页面22222222")
      //  wx.reLaunch({
      //    url: '/pages/login/register2',
      //  })
      } 
    })
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
  
  }
})