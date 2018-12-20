// pages/login/taobao/Auditing/Auditing.js
const app = getApp();
const util = require('../../../../utils/daytimer.js');
const token = require('../../../../utils/token.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screen_height:'',
    screen_width:'',
    is_show:true,
    last_format:'',
    orderCode:'',
    hide:false
  },

  toHome:function(){
    wx.switchTab({
      url: '../../../home/home',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var res = wx.getSystemInfoSync();
    this.setData({
      screen_height: res.windowHeight,
      screen_width: app.globalData.screenWidth,
      orderCode: app.globalData.orderCode,
      time:options.time,
      user:app.globalData.user,
    })

    util.clockTime(this);
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
    }).then(function () {
      var users = app.globalData.user;
      if (users.identity == 2) {
        if (users.bindStatus == 5) {
          wx.redirectTo({
            url: '/pages/login/register2',
          })
        } else if (users.bindStatus == 0 || users.bindStatus == 3) {
          wx.redirectTo({
            url: '/pages/login/taobao/taobao',
          })
        } else if (users.bindStatus == 2) {
          wx.switchTab({
            url: '/pages/home/home',
          })
        }
      }else{
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
          wx.reLaunch({
            url: '/pages/login/register2',
          })
        } else {
          token.refreshPage(res, that)
        }
      } else if (res!=null &&res.data!=null && res.data.notes == '间隔刷新3') {
        console.log("注册跳转登录页面")
        wx.reLaunch({
          url: '/pages/login/login',
        })
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