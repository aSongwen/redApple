// pages/commission/cashwait.js
const app = getApp();
const token = require('../../utils/token.js');
const util = require('../../utils/util.js');
const utilsPara = require('../../utils/uiparams.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: 1,
    card: 0,
    src: '../../icon/img_touxiang.png',
    src1: '../../icon/img_touxiang.png',
    src2: '../../icon/img_touxiang.png',
    home_menu_data: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var res = app.globalData.tempres;

    var date = null;
    var amount = null;
    var feemoney = null;
    if(options.type == 1){
      date = res.data.content.time;
      date = new Date(date + 7200000);
      date = util.formatTime2(date);
      amount = res.data.content.realMoney;
      feemoney = res.data.content.poundage;
    }else{
      date = res.data.content.time;
      date = new Date(date + 7200000);
      date = util.formatTime2(date);
      
      amount = res.data.content.amount;
      feemoney = res.data.content.fee;
    }
    this.setData({
      height: app.globalData.screenHeight,
      width: app.globalData.screenWidth,
      role:1,
      withdrawType: options.withdrawType,
      type:options.type,
      amount: amount,
      feemoney: feemoney,
      date: date,
      user: app.globalData.user,
    });
    var that = this;
    var bankCardNumber = app.globalData.user.bankCardNumber;
    if (bankCardNumber != null) {
      that.setData({
        bankCardNumber: bankCardNumber.substr(bankCardNumber.length - 4)
      })
    };
    app.globalData.tempres = null;
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
    var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
    var params = utilsPara.getUiParam(mydata);
    if (params) {
      this.setData({
        home_menu_data: params,
      })
    }

    var withdrawType = that.data.withdrawType;
    if (withdrawType == 1) {
      var title = '';
      if (that.data.home_menu_data){
        title =that.data.home_menu_data.home_0009;
      }
      wx.setNavigationBarTitle({
        title: title,
      })
    }
    if (withdrawType == 2) {
      var title = '';
      if (that.data.home_menu_data) {
        title = that.data.home_menu_data.home_0011;
      }
      wx.setNavigationBarTitle({
        title: title,
      })
    }
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