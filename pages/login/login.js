const app = getApp();
const util = require('../../utils/timer.js');
const token = require('../../utils/token.js')
const constants = require('../../utils/constants.js')
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
    inviting: '123',
    screen_height: '',
    screen_width: '',
    modalAuthShow:false
  },
  

  //倒计时60s
  clickVerify: function () {
    var that = this;
    var bool = that.validatemobile();
    if (bool) {
      that.setData({
        checkCode: true
      })
      var p1 = new Promise(function (resolve, reject) {
        wx.request({
          url: app.globalData.all_url.send_mobile_message_url,
          header: {
            "Content-Type": "application/json",
          },
          data: {
            platform: 1,
            mobile: that.data.mobile,
            type: 2
          },
          method: "POST",
          success: function (res) {
            if (res.data.success) {
              util.clickVerify(that);
              wx.showToast({
                title: '短信发送成功',
                duration: 1500
              });
            } else {
              if(res!=null&& res.data!=null && res.data.errmsg!=null){
                wx.showModal({
                  title: '错误提示',
                  content: res.data.errmsg,
                  showCancel: false
                });
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
        //util.clickVerify(that);
      }).catch(function (res) {
       
        if (res != null && res.data != null && res.data.errmsg != null) {
          wx.showModal({
            title: '错误提示',
            content: res.data.errmsg,
            showCancel: false
          })
        } 
      })
    }
  },
  /**
   * 设置验证码
   */
  setMobileCode: function (e) {
    this.setData({
      mobileCode: e.detail.value + '',
    })
  },
  /**
   * 此方法判断手机号是否注册，这里是登录，不需验证
   * 判断手机号是否可用
   */
  checkMobile: function () {
    var that = this;
    that.setData({
      checkMobile: true
    })
    var app_url = app.globalData.all_url.check_mobile_url;
    var p = new Promise(function (resolve, reject) {
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
          if (res.data.success) {
            that.setData({
              checkMobile: false
            })
            resolve();
          } else {
            if(res!=null && res.data!=null && res.data.errmsg!=null){
              wx.showModal({
                title: '错误提示',
                content: res.data.errmsg,
                showCancel: false
              });
            }
            
            that.setData({
              checkMobile: false
            });
            reject(res);
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
    return p;
  },

//获取授权数据并登录
getInfoAndLogin:function(res){
  var that = this;
  app.globalData.userinfo = res.detail.userInfo;
  app.globalData.data = res.detail.encryptedData;
  app.globalData.iv = res.detail.iv;
  wx.setStorageSync("wx_head_image", res.detail.userInfo.avatarUrl);
  var t = setInterval(function () {
    if (app.globalData.data != null && app.globalData.iv != null) {
      clearInterval(t);
    }
  }, 1000);
  that.submitNext();
},

getFirstUserInfo(res){
  var that = this
  /*
  wxAuthorize.authSetting()
  .then(()=>{
    that.getInfoAndLogin(res)
  }).catch((e)=>{
      console.log('getFirstUserInfo.error===', e)
      wx.showModal({
          content: '位置授权失败，请登录并授权',
          showCancel: false
      });
  })*/
  wxAuthorize.authSettingNew()
  .then(()=>{
    that.getInfoAndLogin(res)
  }).catch((e)=>{
    if (e =='Error: openSetting_failed'){
        that.setData({ modalAuthShow: true });
        return;
      }
      //console.log('getFirstUserInfo.error===', e)
      wx.showModal({
          content: '位置授权失败，请登录并授权',
          showCancel: false
      });
  })
},
  bindViewTap: function () {
    this.setData({ modalAuthShow: !this.data.modalAuthShow })
  },  
    
  //取消按钮点击事件 
   modalBindcancel:function(){  
     this.setData({ modalAuthShow:false,    })
  },

  /**
   * 登录
   */
  submitNext: function () {
    var that = this;
    if (that.data.mobileCode == null || that.data.mobileCode==""){
      wx.showModal({
        title: '错误提示',
        content: '请先输入验证码',
        showCancel:false
      });
      return;
    }
    var bool = that.validatemobile();
    if (bool) {
        that.setData({
            disabled: true
        })
        var p2 = new Promise(function (resolve, reject) {
          wx.request({
            url: app.globalData.all_url.login_by_mobile_url,
            header: {
              "Content-Type": "application/json",
            },
            data: {
              appId: constants.AppId_RedApple,
              applicationId: 6,
              mobile: that.data.mobile,
              mobileCode: that.data.mobileCode,
              type: 2
            },
            method: "POST",
            success: function (res) {
              if (res.data.success) {
                app.globalData.access_token = res.data.content.access_token
                app.globalData.refresh_token = res.data.content.refresh_token

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
            },
          })
        })
        p2.then(function () {
          app.globalData.authType = 0;
          return wxAuthorize.getWechatAuth(app);
        }).then(function (res){
          return token.getUserInfo(app);
        }).then(function(res2){
          wx.showToast({
            title: '登录成功',
            duration: 1500
          })
          util.clearTimer();
          if (that.data.mobile == constants.APP_AUDIT){
            wx.setStorageSync('myshope', 'shop');
            wx.redirectTo({
              url: '/pages/myshop',
            });
          }else{
            // wx.switchTab({
            //   url: '/pages/home/home',
            // });
            that.directToFunc(res2.data.content);
          }
          that.setData({
            disabled: false
          })
        }).catch(function (res) {
          // wx.clearStorageSync();
          that.setData({
            disabled: false
          });
          if (res != null && res.data!=null && res.data.errmsg != null) {
            wx.showModal({
              title: '错误提示',
              content: res.data.errmsg,
              showCancel: false
            })
          } else {
            wx.clearStorageSync();
          }
        })
    }
  },
  //登录后跳转
  directToFunc: function (userInfo) {
    var users = userInfo;
    //if(users!=null&&users.identity!=null&&users.identity==2){
    if (users != null && users.status == 2) {
      wx.reLaunch({
        url: '/pages/home/deny/deny',
      })
    }
    if (users != null && users.identity != null) {

      if (users != null && users.identity != null && users.identity == 2) {
        if (users.bindStatus == 5) {
          wx.redirectTo({
            url: '/pages/login/register2',
          })
        } else if (users.bindStatus == 0 || users.bindStatus == 3) {
          wx.redirectTo({
            url: '/pages/login/taobao/taobao',
          })
        } else if (users.bindStatus == 1 || users.bindStatus == 4) {
          wx.redirectTo({
            url: '/pages/login/taobao/Auditing/Auditing?time=' + users.bindTime,
          })
        }
      }
    }
    token.setStorageExp('userInfo', userInfo, 24*60*60*1000);
    wx.switchTab({
      url: '/pages/home/home',
    });
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
   * 判断手机号是否正确
   */
  validatemobile: function () {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      screen_height: app.globalData.screenHeight,
      screen_width: app.globalData.screenWidth
    });
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
    //console.log("=========onShow=================");
    this.setData({
      mobileCheck: false
    })
    var that = this;
    if (that.data.last_time != 0 && that.data.last_time != null && that.data.last_time != '') {
      util.clickVerify(that);
    }
    wxAuthorize.checkAuth(1)
      .then(val  => {
        console.log("val========"+val);
        if(val==1){
          this.setData({ modalAuthShow:false});
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