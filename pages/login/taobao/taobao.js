const app = getApp();
const token = require('../../../utils/token.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    width: '',
    order: '',
    canIUse: wx.canIUse('getClipboardData'),
    taokouling: null,
  },

  nextAuditing: function () {
    var that = this;
    var tklid = that.data.tklid;
    var order = that.data.order;
    if (order != null && order != '') {
      //验证一下
      //var that = this;
      var flag = that.validateOrderNo(order);

      if (!flag) {
        return;
      }
      var reg = /^[0-9]*[1-9][0-9]*$/;
      if (reg.test(order)) {
        that.setData({
          loading: true
        })
        var p = token.pushOrder(app, tklid, order);
        p.then(function (res) {
          
          that.setData({
            loading: false
          })
          wx.showToast({
            title: "提交成功",
            duration: 1500,
          });
          // var pro = token.getUserInfo(app);
          // pro.then(function () {
          //   return token.getConfig(app);
          // }).then(function () {
          //   return token.getFinance(app);
          // }).then(function () {
          //   return token.getLastCode(app);
          // }).then(function () {
          //   return token.countCode(app);
          // }).then(function () {
          //   return token.queryCode(app);
          // }).then(function () {
          //   return token.getFeeWithdraw(app);
          // }).then(function () {
          //   setTimeout(function () {
          //     wx.redirectTo({
          //       url: './Auditing/Auditing?time=' + res.data.content.time,
          //     })
          //   }, 1800)
          // }).catch(function (res) {
          //   console.log('未登录');
          //   console.log(res);
          // });
          setTimeout(function () {
            wx.redirectTo({
              url: './Auditing/Auditing?time=' + res.data.content.time,
            })
          }, 1800)
        }).catch(function (res) {
          
          that.setData({
            loading: false
          })
          if (res!=null && res.data!=null &&res.data.errmsg != null) {
            token.refreshPage(res,that)
          } else {
            // wx.showModal({
            //   title: '错误提示',
            //   content: '与服务器连接超时',
            //   showCancel: false
            // })
          }
        })
      } else {
        wx.showModal({
          title: '订单号格式不正确',
          content: '订单号格式不正确，请输入正确的订单号',
          showCancel: false,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    } else {
      wx.showModal({
        title: '订单号不能为空',
        content: '订单号不能为空，请输入订单号',
        showCancel: false,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  //设置订单号
  changeCode: function (e) {
    // app.globalData.orderCode = e.detail.value;
    this.setData({
      order: e.detail.value
    })
  },

validateOrderNo:function(val){
  if(val.length<18){
    wx.showModal({
      title: '错误提示',
      content: '订单号格式不正确！',
      showCancel: false
    });
    return false;
  }
  var myreg = /^\d{18,}$/;
  if (!myreg.test(val)){
    wx.showModal({
      title: '错误提示',
      content: '订单号格式不正确！',
      showCancel: false
    })
    return false;
  }
  return true;
},

  //复制功能
  getClipboardData: function () {
    var that = this;
    wx.getClipboardData({
      success: function (res) {
        app.globalData.orderCode = res.data;
        that.setData({
          order: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 复制淘口令
   */
  copyTKL: function () {
    var that = this;
    var tkl = that.data.taokouling;
    wx.setClipboardData({
      data: tkl,
    })
    wx.showToast({
      title: '复制成功',
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
    app.globalData.orderCode = '';
    this.setData({
      height: app.globalData.screenHeight,
      width: app.globalData.screenWidth,
    });
    var that = this;
    var p = token.refresh(app);
    p.then(function () {
      return token.getUserInfo(app);
    }).then(function () {
      if (that.data.taokouling == null) {
        var p = token.getTaoKL(app);
        p.then(function (res) {
         
          var id = res.data.content.id;
          var taokouling = res.data.content.token;
          that.setData({
            taokouling: taokouling,
            tklid: id,
            user: app.globalData.user,
          });
          if (that.data.user.bindStatus == 3 && !that.data.user.bindRetry) {
            wx.showModal({
              title: '错误提示',
              content: '审核失败',
              showCancel: false,
            })
          }
        }).catch(function (res) {
          if (res!=null && res.data!=null && res.data.errmsg != null) {
            token.refreshPage(res, that)
          } else {
            // wx.showModal({
            //   title: '错误提示',
            //   content: '与服务器连接超时',
            //   showCancel: false
            // })
          }
          that.setData({
            taokouling: '获取失败,请稍后重试',
            tklid: null,
            tklbool: true
          })
        })
      }
    }).catch(function (res) {
      
      if (res!=null &&res.data!=null && res.data.errmsg != null) {
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
      } else if (res!=null && res.data!=null && res.data.notes == '间隔刷新3') {
        wx.reLaunch({
          url: '/pages/login/register2',
        })
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