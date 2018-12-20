// pages/moneydetail/moneydetail.js
const app = getApp();
const token = require('../../utils/token.js');
const util = require('../../utils/util.js');
const utilsPara = require('../../utils/uiparams.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      backgroundUrl:'',
      amount : null,
      coin : null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id:options.id,
      typeIndex: options.typeIndex,
      typeid:options.typeid,
      amount:options.amount_change,
      coin: options.coin_change,

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
    //
    var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
    var params = utilsPara.getUiParam(mydata);
    if (params) {
      this.setData({
        home_menu_data: params,
      })
      
      var title = params.home_0015 + "明细";
      wx.setNavigationBarTitle({
        title: title,
      });
    }
    
    var p = new Promise(function(resolve,rejcet){
      var app_url=""
        if(that.data.typeIndex==0) {
            app_url = app.globalData.all_url.get_merchant_finance_url;
        }else {
            app_url = app.globalData.all_url.get_merchant_finance;
        }
      wx.request({
        url: app_url + '?access_token=' + app.globalData.access_token,
        header: {
          "Content-Type": "application/json",
        },
        data: {
          financeRecordId: that.data.id
        },
        method: "POST",
        success: function (res) {
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        }
      })
    });
    p.then(function(res){
      
      if(res.data.success){
        var detail = res.data.content;
        if(that.data.typeIndex!=null && that.data.typeIndex==1) {
            if (detail.settleTime) {
                detail.gmtTime = util.formatTime2(new Date(detail.settleTime));
            }
            if (detail.coinChange > 0) {
                detail.amounts = "+" + token.returnFloat(detail.coinChange);
            } else {
                detail.amounts = token.returnFloat(detail.coinChange);
            }
            if (detail.coinChange > 0) {
                detail.coins = "+" + token.returnFloat(detail.coinChange);
            } else {
                detail.coins = token.returnFloat(detail.coinChange);
            }
        }else {
            if (detail.time) {
                detail.gmtTime = util.formatTime2(new Date(detail.time));
            }
            if (detail.financeItemCode && detail.financeItemCode == '16') {
                detail.amount = detail.amount;
            }
            if (detail.financeItemCode && detail.financeItemCode == '17') {
                detail.coin = detail.coin;
            }
            if (detail.coin > 0) {
                detail.coins = "+" + token.returnFloat(detail.coin);
            } else {
                detail.coins = token.returnFloat(detail.coin);
            }
            if (detail.amount > 0) {
                detail.amounts = "+" + token.returnFloat(detail.amount);
            } else {
                detail.amounts = token.returnFloat(detail.amount);
            }
            // detail.amounts = token.returnFloat(detail.amount)
        }
        that.setData({
          detail: detail
        })
      }else{
        if(res!=null && res.data!=null && res.data.errmsg!=null){
          token.refreshPage(res, that);
        }
        
      }
    }).catch(function(res){
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        token.refreshPage(res, that);

      } else {
        // wx.showModal({
        //   title: '错误提示',
        //   content: '与服务器连接超时',
        //   showCancel: false
        // })
      }
    })
    token.getBgmarkUrl(app).then(function(ress){
        that.setData({
            backgroundUrl :ress
        })
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