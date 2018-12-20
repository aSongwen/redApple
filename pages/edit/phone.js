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
    screen_width: '',
    mobileCode_new:'',
    checkCode_new:'',
    newMobile:'',
    last_time_new:'',
    is_show_new:true,
    countdown_new:60
  },

  //倒计时60s
  clickVerify: function () {
    var that = this;
    that.setData({
      checkCode: true
    })
    if (that.data.oldMobile == null || that.data.oldMobile == '') {
      wx.showModal({
        title: '错误提示',
        content: '手机号不能为空',
        showCancel: false
      })
      return;
    } 
    var p1 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.all_url.send_mobile_message_url,
        header: {
          "Content-Type": "application/json",
        },
        data: {
          platform: 1,
          mobile: that.data.oldMobile,
          type: 4
        },
        method: "POST",
        success: function (res) {

          if (res.data.success) {
            wx.showToast({
              title: '短信发送成功',
              duration: 1500
            });
          } else {
            if(res!=null && res.data!=null &&res.data.errmsg!=null){
              token.refreshPage(res, that);
            }
          }
          that.setData({
            checkCode: false
          })
          resolve();
        },
        fail: function (res) {
          that.setData({
            checkCode: false
          })
          reject(res);
        }
      })
    });
    p1.then(function () {
      util.clickVerify(that);
    }).catch(function (res) {
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        token.refreshPage(res, that);
      } 
    })
  },
  //输入旧手机号的验证码
  setMobileCode: function (e) {
    this.setData({
      mobileCode: e.detail.value + '',
    })
  },

//第二个倒计时60s
  clickNewVerify:function(){
    var that = this;
    that.setData({
      checkCode_new: true
    })
    if (that.data.newMobile == null || that.data.newMobile=='') {
      wx.showModal({
        title: '错误提示',
        content: '新手机号不能为空',
        showCancel: false
      })
      that.setData({
        checkCode_new: false
      })
      return;
    } 
    var p1 = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.all_url.send_mobile_message_url,
        header: {
          "Content-Type": "application/json",
        },
        data: {
          platform: 1,
          mobile: that.data.newMobile,
          beforeMobile: that.data.oldMobile,
          type: 4
        },
        method: "POST",
        success: function (res) {

          if (res.data.success) {
            wx.showToast({
              title: '短信发送成功',
              duration: 1500
            });
          } else {
            if (res != null && res.data != null && res.data.errmsg != null) {
              token.refreshPage(res, that);
            }
          }
          that.setData({
            checkCode_new: false
          })
          resolve();
        },
        fail: function (res) {
          that.setData({
            checkCode_new: false
          })
          reject(res);
        }
      })
    });
    p1.then(function () {
      util.clickVerify_new(that);
    }).catch(function (res) {
      if (res != null && res.data != null && res.data.errmsg != null) {
        token.refreshPage(res, that);
      }
    })
  },

//新手机获取验证码
  setMobileCodeNew:function(e){
    this.setData({
      mobileCode_new:e.detail.value + "",
    })
  },

  /**
   * 保存手机
   */
  submitNext: function () {
    var that = this;
    if (that.data.mobileCode == null || that.data.mobileCode == "" || that.data.mobileCode_new == null || that.data.mobileCode_new==""){
      wx.showModal({
        title: '错误提示',
        content: '请输入验证码',
      });
      return;
    }
    var bool = that.validatemobile2();
    if(bool){
      var p = that.checkMobile();
      if(p != null){
        that.setData({
          disabled: true
        })
        p.then(function(){
          return token.refresh(app)
        }).then(function () {
          var p2 = new Promise(function (resolve, reject) {
            wx.request({
              url: app.globalData.all_url.change_user_mobile_url + '?access_token=' + app.globalData.access_token,
              header: {
                "Content-Type": "application/json",
              },
              data: {
                mobileCode: that.data.mobileCode,
                mobileNewCode: that.data.mobileCode_new,
                oldMobile: that.data.oldMobile,
                newMobile: that.data.newMobile,
              },
              method: "POST",
              success: function (res) {
                if (res.data.success) {
                  wx.showToast({
                    title: '保存成功',
                    duration: 1500
                  })
                  util.clearTimer();
                  app.globalData.user = null;
                  wx.clearStorageSync();
                  console.log("更换手机号跳转")
                  wx.reLaunch({
                    url: '/pages/login/login',
                  })
                } else {
                  if (res != null && res.data != null && res.data.errmsg != null) {
                    token.refreshPage(res, that);
                  }
                }
                resolve();
              },
              fail: function (res) {
                if (res != null && res.data != null && res.data.errmsg != null) {
                  token.refreshPage(res, that);
                }
                reject();
              },
            })
          })
          p2.then(function () {
            that.setData({
              disabled: false
            })
          }).catch(function () {
            that.setData({
              disabled: false
            })
          });
        }).catch(function(res){
          if(res!=null&&res.data!=null&&res.data.errmsg!=null){
            var msg = res.data.errmsg;
            if (msg.indexOf("手机号已注册")!=-1){
              msg = "新手机号码已被使用";
            }
            token.refreshPage(res, that);
          }
          that.setData({
            disabled: false
          })
        })
        
      }
    }
  },
  /**
   * 设置新手机号
   */
  setNewPhone: function (e) {
    this.setData({
      newMobile: e.detail.value + '',
    })
  },
  /**
   * 判断手机号是否可用
   */
  checkMobile: function () {
    var that = this;
    var app_url = app.globalData.all_url.check_mobile_url;
    if (that.data.newMobile != null && that.data.newMobile != ''){
      var p = new Promise(function (resolve, reject) {
        wx.request({
          url: app_url,
          header: {
            "Content-Type": "application/json",
          },
          data: {
            mobile: that.data.newMobile
          },
          method: "POST",
          success: function (res) {
          
            if (res.data.success) {
              that.setData({
                mobileCheck: true
              })
              resolve();
            } else {
              reject(res);
            }
          },
          fail: function (res) {
            reject(res);
          }
        })
      });
      return p;
    }else{
      wx.showModal({
        title: '错误提示',
        content: '新手机号码不能为空',
        showCancel: false,
      })
      return null;
    }
  },
  /**
   * 判断手机号是否正确
   */
  validatemobile: function () {
    var phone = this.data.oldMobile;
    if (phone == null || phone.length == 0) {
      wx.showModal({
        title: '错误提示',
        content: '请输入手机号！',
        showCancel: false,
      })
      return false;
    }
    if (phone.length != 11) {
      wx.showModal({
        title: '错误提示',
        content: '手机号长度有误！',
        showCancel: false,
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(phone)) {
      wx.showModal({
        title: '错误提示',
        content: '旧手机号有误！',
        showCancel: false,
      })
      return false;
    }
    return true;
  },
  validatemobile2: function () {
    var phone = this.data.oldMobile;
    var newPhone = this.data.newMobile;
    if (newPhone == null || newPhone.length == 0) {
      wx.showModal({
        title: '错误提示',
        content: '请输新入手机号！',
        showCancel: false,
      })
      return false;
    }
    if (newPhone.length != 11) {
      wx.showModal({
        title: '错误提示',
        content: '新手机号长度有误！',
        showCancel: false,
      })
      return false;
    }
    if (phone == newPhone) {
      wx.showModal({
        title: '错误提示',
        content: '两次手机号不能一样！',
        showCancel: false,
      })
      return false;
    }
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    var myreg = /^((1)+\d{10})$/;
    if (!myreg.test(newPhone)) {
      wx.showModal({
        title: '错误提示',
        content: '新手机号有误！',
        showCancel: false,
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
    // this.setData({
    //   mobileCheck: false
    // })
    if (app.globalData.user != null) {
      this.setData({
        oldMobile: app.globalData.user.mobile
      })
    }
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