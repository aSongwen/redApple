// pages/home/message/message/messagedetails.js
const app = getApp();
const token = require('../../../../utils/token.js');
const util = require('../../../../utils/util.js');
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
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height:res.windowHeight,
          width:res.windowWidth,
        })
      },
    })
    var p = token.refresh(app);
    p.then(function () {
    return token.searchUserMessage(app, options.id);
    }).then(function (res) {
      var msg = res.data.content;
      msg.time = util.formatTime4(new Date(msg.gmtCreate));
      var arr = msg.content.split(";");
      msg.arr = arr;
      that.setData({
        msg:msg
      })
    }).catch(function (res) {
      if(res!=null&&res.data!=null&& res.data.errmsg!=null){
        if (res.data.errmsg.indexOf("Token已失效") > -1) {
          wx.showModal({
            content: "刷新一下",
            showCancel: false,
            success: function (rest) {
              if (rest.confirm) {
                that.onLoad(options)
              }
            }
          })
        } else {
          wx.showModal({
            title: '错误提示',
            content: res.data.errmsg,
            showCancel: false
          })
        }
      }
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