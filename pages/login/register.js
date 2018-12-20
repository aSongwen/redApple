const app = getApp();
const util = require('../../utils/timer.js');
const token = require('../../utils/token.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    last_time: '',
    is_show: true,
    countdown: 60,
    inviting: '123',
    screen_height: '',
    screen_width: ''
  },

  //倒计时60s
  clickVerify: function () {
    if (this.validatemobile()) {
      var that = this;
      var access_token = app.globalData.access_token;

      wx.request({
        url: 'https://laokeyun.com/pub/user/send_mobile_message',
        header: {
          "Content-Type": "application/json",
        },
        data: {
          mobile: that.data.mobile,
          type: 2
        },
        method: "POST",
        success: function (res) {
          
        }
      })
      util.clickVerify(that);
    } else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1000
      })
    }
  },
  setMobileCode: function (e) {
    this.setData({
      mobileCode: e.detail.value + '',
    })
  },

  submitNext: function () {
    var bool = this.validatemobile();
    if (bool) {
      // var user = this.data.user;
      // if(user.phone!=null && user.phone!=''){
      //   app.globalData.user = this.data.user;
      //   wx.switchTab({
      //     url: '/pages/home/home',
      //   })
      // }
      var that = this;
      wx.request({
        url: 'https://laokeyun.com/pub/user/login_by_mobile',
        header: {
          "Content-Type": "application/json",
          "access_token": app.globalData.access_token
        },
        data: {
          mobile: that.data.mobile,
          mobileCode: that.data.mobileCode,
          type: 2
        },
        method: "POST",
        success: function (res) {
          
          util.clearTimer();
          var content = res.data.content
          if (res!=null && res.data!=null && res.data.content==null && res.data.errmsg!=null) {
            content = res.data.errmsg;
          }
          wx.showToast({
            title: '' + content,
            duration: 3000
          })
          if (res.data.content == '登录成功') {
            setTimeout(function () {
              util.clearTimer();
              wx.switchTab({
                url: '/pages/home/home',
              })
            }, 3000)
          }
        },
        fail: function (res) {
          if (res!=null &&res.data!=null && res.data.content == null&&res.data.errmsg!=null) {
            wx.showToast({
              title: '' + res.data.errmsg,
              duration: 3000
            });
          }
         
        }
      })
    }
  },
  setPhone: function (e) {
    this.setData({
      mobile: e.detail.value + '',
    })
  },
  /**
   * 判断手机号是否正确
   */
  validatemobile: function () {
    var phone = this.data.mobile;
    if (phone == null || phone.length == 0) {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (phone.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    var myreg = /^((1)+\d{10})$/;
    if (!myreg.test(phone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    return true;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    token.getToken(app);
    this.setData({
      screen_height: app.globalData.screenHeight,
      screen_width: app.globalData.screenWidth
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
    util.clearTimer();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    util.clearTimer();
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

  },
  getUserInfo: function (e) {
    if (e != null) {
      if (e.detail.errMsg != "getUserInfo:fail auth deny") {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
      } else {
        wx.showModal({
          title: '您已拒绝授权',
          content: '您已拒绝授权，无法进行注册',
          showCancel: false
        })
      }
    }
  }
})