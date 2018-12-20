// pages/home/personal/msgbinding.js
const app = getApp();
const utils = require("../../../utils/verify.js");
const token = require("../../../utils/token.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    width: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      height: app.globalData.screenHeight,
      width: app.globalData.screenWidth,
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
    }).then(function () {
      var users = app.globalData.user;
      if (users != null && users != '') {
          if(users.idCardNumber!=null && users.idCardNumber!=''){
              that.setData({
                  realName: users.realName+'(已实名)'
              })
          }
          if(users.bankCardNumber!=null && users.bankCardNumber!=''){
              that.setData({
                  bankName: users.bankName+'('+users.bankCardNumber.substring(users.bankCardNumber.length-4)+')'
              })
          }
        that.setData({
          user: users
        })
      } else {
        wx.navigateBack({})
      }
    }).catch(function (res) {
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        if (res.data.errmsg.indexOf('未找到用户信息') != -1) {
          that.deleteToken();
        } else {
          token.refreshPage(res, that);

        }
      } else if (res!=null && res.data!=null && res.data.notes == '间隔刷新3') {

      } else {
        // wx.showModal({
        //   title: '错误提示',
        //   content: '与服务器连接超时',
        //   showCancel: false
        // })
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
      // wx.reLaunch({
      //     url: '/pages/home/personal/personal'
      // })
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