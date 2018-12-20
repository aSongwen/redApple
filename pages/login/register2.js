const app = getApp();
const util = require('../../utils/timer.js');
const token = require('../../utils/token.js')
const wxAuthorize = require('../../utils/wxAuthorize.js')


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
    countdown: 120,
    inviting: null,
    screen_height: '',
    screen_width: '',
    timer: '',
    mobileCheck: false,
    modalAuthShow:false
  },
  /**
   * 判断手机号是否正确
   */
  validatemobile: function (types) {
    var phone = this.data.mobile;
    var that = this;
    if (phone == null || phone.length == 0) {
      wx.showModal({
        title: '错误提示',
        content: '请输入手机号！',
        showCancel: false
      })
      return false;
    }
    if (phone.length != 11) {
      wx.showModal({
        title: '错误提示',
        content: '手机号长度有误！',
        showCancel: false
      })
      return false;
    }
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    var myreg = /^((1)+\d{10})$/;
    if (!myreg.test(phone)) {
      wx.showModal({
        title: '错误提示',
        content: '手机号有误！',
        showCancel: false
      })
      return false;
    }
    return true;
  },
  /**
   * 判断手机号是否可用
   */
  checkMobile: function () {
    var that = this;
    that.setData({
      checkMobile: true
    })
    var app_url = app.globalData.all_url.check_mobile_url;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: app_url,
        header: {
          "Content-Type": "application/json",
        },
        data: {
          mobile: that.data.mobile
        },
        method: "POST",
        success: function (res) {
          that.setData({
              checkMobile: false
          })
          if (res.data.success) {
            resolve(res);
          } else {
            reject(res)
          }
        },
        fail: function (res) {
          that.setData({
            checkMobile: false
          })
          reject(res);
        }
      })
    });
  },
  
  //取消按钮点击事件 
  modalBindcancel: function () {
    this.setData({ modalAuthShow: false, })
  },
  //倒计时60s
  clickVerify: function (res) {
    var that = this;
    app.globalData.userinfo = res.detail.userInfo;
    app.globalData.data = res.detail.encryptedData;
    app.globalData.iv = res.detail.iv;
    app.globalData.authType = 1;
    
    //获取授权
    //wxAuthorize.authSetting().then(() => {
    wxAuthorize.authSettingNew().then(() => {
      return wxAuthorize.checkWechatOpenId(app);
    }).then(function () {
      if (that.data.inviteCode == null || that.data.inviteCode == "") {
        wx.showModal({
          content: '请先输入邀请码',
          showCancel: false
        });
        return;
      }
      var bool = that.validatemobile();
      if (bool) {
        var p = that.checkMobile();
        p.then(function () {
          that.setData({
            checkCode: true
          })
          return new Promise(function (resolve, reject) {
            wx.request({
              url: app.globalData.all_url.send_mobile_message_url,
              header: {
                "Content-Type": "application/json",
              },
              data: {
                platform: 1,
                mobile: that.data.mobile,
                inviteCode: that.data.inviteCode,
                type: 1
              },
              method: "POST",
              success: function (res) {
                if (res.data.success) {
                  wx.showToast({
                    title: '短信发送成功',
                    duration: 1500
                  });
                  resolve();
                } else {
                  reject(res);
                }
              },
              fail: function (res) {
                reject(res);
              }
            })
          })
            .then(function () {
              that.setData({
                checkCode: false
              })
              util.clickVerify(that);
            })
        }).catch(function (res) {
          that.setData({
            checkCode: false
          })
          if (res != null && res.data != null && res.data.errmsg != null) {
            wx.showModal({
              title: '错误提示',
              content: res.data.errmsg,
              showCancel: false
            })
          } else {
            wx.showModal({
              title: '错误提示',
              content: '手机号已经注册',
              showCancel: false
            })
          }
        })
      }
      }).catch((e) => {
        if (e == 'Error: openSetting_failed') {
          console.log('getFirstUserInfo.error11===', e)
          that.setData({ modalAuthShow: true });
          return;
        }
        console.log('getFirstUserInfo.error===', e)
        wx.showModal({
          content: '位置授权失败，请登录并授权',
          showCancel: false
        });
      });
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
        screen_height: app.globalData.screenHeight,
        screen_width: app.globalData.screenWidth
    })
    //判断自动登录不成功自动加上邀请码
    if (app.globalData.invite_code != null && app.globalData.invite_code.length >0 ){
      this.setData({
        inviteCode: app.globalData.invite_code
      });
    }
    let access_token = wx.getStorageSync('access_token');
    let refresh_token = wx.getStorageSync('refresh_token');
    if (options.inviteCode != null && options.inviteCode.length > 0){
      app.globalData.invite_code = options.inviteCode;
      this.setData({
          inviteCode: options.inviteCode
      });
      
      if (access_token != null && access_token.length > 0 && refresh_token != null && refresh_token.length > 0){
        wx.switchTab({
          url: '/pages/home/home',
        });
      }
    }

    if (options.scene != null && options.scene.length > 0){
      var scene = decodeURIComponent(options.scene);
      app.globalData.invite_code = scene;
      this.setData({
        inviteCode: scene,
        codebool: true
      });
      if (access_token != null && access_token.length > 0 && refresh_token != null && refresh_token.length > 0) {
        wx.switchTab({
          url: '/pages/home/home',
        });
      }
    }

    var user = app.globalData.user;
    if(user != null){
      if(user.bindStatus == 5){
        wx.showModal({
          title: '错误提示',
          content: '账号审核失败，已废弃，请重新注册',
        })
      }
      app.globalData.user = null;
    }
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
    if (that.data.last_time != 0 && that.data.last_time != null && that.data.last_time != '') {
      util.clickVerify(that);
    }
    wxAuthorize.checkAuth(1)
      .then(val => {
        console.log("val========" + val);
        if (val == 1) {
          this.setData({ modalAuthShow: false });
        }
      }).catch((e) => {
        console.log("val====e====" + e);
      })
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
  /**
   * 获取用户授权
   */
  getUserInfo: function (e) {
    console.log('customed getUserInfo',e)
    if (e != null) {
      if (e.detail.errMsg != "getUserInfo:fail auth deny") {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
      }
    }
  },
  setMobileCode: function (e) {
      this.setData({
          mobileCode: e.detail.value + '',
      })
  },
  /**
   * 设置手机号
   */
  setPhone: function (e) {
      this.setData({
          mobile: e.detail.value + '',
      })
  },
  /**
   * 设置邀请码
   */
  setCode: function (e) {
    this.setData({
      inviteCode: e.detail.value + '',
    })
  },
  /**
   * 验证邀请码点击响应
   */
checkCode: function () {
    var that = this;
    var code = this.data.inviteCode;
    if (!code || code == null || code == '') {
        wx.showModal({
            title: '错误提示',
            content: '邀请码不能为空',
            showCancel: false
        })
        return
    }

    that.realCheckCode()
        .catch(function (res) {
            if(res!=null && res.data!=null && res.data.errmsg!=null){
                wx.showModal({
                    title: '错误提示',
                    content: res.data.errmsg,
                    showCancel: false
                });
            }
            that.setData({
                checkCode2: false
            })
        })
  },
  /**
   * 验证邀请码
   */
  realCheckCode: function () {
    var code = this.data.inviteCode;
    var that = this;
    var url = app.globalData.all_url.check_promoter_code_url;
    that.setData({
      checkCode2: true
    })
    return new Promise(function (resolve, reject) {
      wx.request({
        url: url,
        header: {
          "Content-Type": "application/json",
        },
        data: {
          code: code
        },
        method: "POST",
        success: function (res) {
          if (res.data.success) {
            that.setData({
              inviting: res.data.content,
            });
            resolve();
          } else {
            reject(res);
          }
        },
        fail: function (res) {
          reject(res);
        }
      })
    }).then(function () {
        that.setData({
            checkCode2: false
        })
    })
  },
  //获取授权
  getFirstUserInfo: function (res) {
    var that = this;
    wxAuthorize.authSettingNew().then(() => {
      return wxAuthorize.checkWechatOpenId(app);
    }).then(function () {
      app.globalData.userinfo = res.detail.userInfo;
      app.globalData.data = res.detail.encryptedData;
      app.globalData.iv = res.detail.iv;
      app.globalData.authType = 1;

      // wxAuthorize.authSetting()
      // .then(()=>{
      //     return that.submitNext()
      // })
      that.submitNext().then(function () {
        return wxAuthorize.getWechatAuth(app);
      }).then(function () {
        wx.showToast({
          title: '注册成功',
          duration: 1500
        })
        util.clearTimer();

        that.setData({
          disabled: false,
          checkCode2: false
        });

        wx.redirectTo({
          url: './taobao/taobao',
        });
      }).catch((res) => {
        console.log('getFirstUserInfo.error===', res)
        wx.clearStorageSync();
        that.setData({
          disabled: false,
          checkCode2: false
        });

        if (res != null && res.data != null && res.data.errmsg != null) {
          wx.showModal({
            title: '错误提示',
            content: res.data.errmsg,
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '错误提示',
            content: '注册失败',
            showCancel: false
          })
        }
      })
    }).catch(function(e) {
      if (e == 'Error: openSetting_failed') {
        console.log('getFirstUserInfo.error11===', e)
        that.setData({ modalAuthShow: true });
        return;
      }
    });

    
  },
    //注册
    submitNext: function () {
        var that = this;
        if (that.data.inviteCode == null || that.data.inviteCode==""){
            wx.showModal({
                content: '邀请码不能为空',
                showCancel:false
            })
            return;
        }
        if (that.data.mobileCode == null || that.data.mobileCode == ""){
            wx.showModal({
                content: '验证码不能为空',
                showCancel: false
            })
            return;
        }
        if (that.validatemobile()) {
            that.setData({
                disabled: true
            });
            return that.realCheckCode()
            .then(function () {
                return new Promise(function (resolve, reject) {
                    wx.request({
                        url: app.globalData.all_url.register_promoter_url,
                        header: {
                            "Content-Type": "application/json",
                        },
                        data: {
                            username: that.data.mobile,
                            password: that.data.mobile,
                            rePassword: that.data.mobile,
                            inviteCode: that.data.inviteCode,
                            mobile: that.data.mobile,
                            mobileCode: that.data.mobileCode,
                            companyName: that.data.mobile,
                            type: 5,
                            registerMethod: 'MOBILE',
                        },
                        method: "POST",
                        success: function (res) {
                            if (res.data.success) {
                                app.globalData.access_token = res.data.content.access_token
                                wx.setStorageSync('access_token', res.data.content.access_token);
                                wx.setStorageSync('refresh_token', res.data.content.refresh_token);
                                wx.setStorageSync('access_overtime', res.data.content.access_overtime);
                                wx.setStorageSync('refresh_overtime', res.data.content.refresh_overtime);
                                var date = new Date().getTime();
                                var local_access_overtime = date + 3000000;
                                var local_refresh_overtime = date + 2592000000;
                                wx.setStorageSync('local_access_overtime', local_access_overtime);
                                wx.setStorageSync('local_refresh_overtime', local_refresh_overtime);
                                resolve();
                            } else {
                                reject(res);
                            }
                        },
                        fail: function (res) {
                            reject(res);
                        }
                    })
                })
            })
        }
    }
})