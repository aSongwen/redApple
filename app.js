//app.js
const url = require('./utils/url.js');
const token = require('./utils/token.js');
App({
  onLaunch: function () {
    try {
      var shop = wx.getStorageSync('myshope');
      if (shop == 'shop') {
        wx.redirectTo({
          url: '/pages/myshop',
        });
        return;
      }
    } catch (e) {
      // Do something when catch error
    }
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    url.setUrl(this);
    token.getToken2(this);
    var that = this;
    //checkversion
	// 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    // 登录
    wx.login({
      success: function (res) {
        // that.globalData.appid = 'wx9875904494f9aa26'; //填写微信小程序appid  
        // that.globalData.secret = '349f53b62c3771e75aab42fe5264aa3d'; //填写微信小程序secret
        that.globalData.code = res.code;
      }  
    });
    // var p = new Promise(function(resolve,reject){
    //   // 获取用户信息
    //   wx.getSetting({
    //     success: res => {
    //       if (!res.authSetting['scope.userInfo']) {
    //         wx.authorize({
    //           scope: 'scope.userInfo',
    //           success:function(res){
    //             console.log(res);
    //             // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //             wx.getUserInfo({
    //               success: res => {
    //                 console.log(res);
    //                 that.globalData.data = res.encryptedData;
    //                 that.globalData.data = res.iv;
    //                 // 可以将 res 发送给后台解码出 unionId
    //                 that.globalData.userInfo = res.userInfo;
    //                 // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //                 // 所以此处加入 callback 以防止这种情况
    //                 if (that.userInfoReadyCallback) {
    //                   that.userInfoReadyCallback(res)
    //                 }
    //               }
    //             })
    //           },
    //           fail:function(res){
    //             console.log(res);
    //             // 用户拒绝了授权  
    //             console.log("2-授权《保存图片》权限失败");
    //             // 打开设置页面  
    //             wx.openSetting({
    //               success: function (res) {
    //                 console.log(res);
    //                 if (res.authSetting['scope.userInfo']){
    //                   wx.getUserInfo({
    //                     success: res => {
    //                       console.log(res);
    //                       that.globalData.data = res.encryptedData;
    //                       that.globalData.data = res.iv;
    //                     }
    //                   })
    //                 }else{
    //                   wx.showModal({
    //                     title: '错误提示',
    //                     content: '您已拒绝授权，如果要授权，可以通过小程序右上角 - 关于 - 右上角 - 设置,进入授权页面进行授权',
    //                     showCancel: false,
    //                   })
    //                 }
    //               },
    //               fail: function (res) {
    //                 console.log(res);
    //               }
    //             });
    //           }
    //         });
    //       }else{
    //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //         wx.getUserInfo({
    //           success: res => {
    //             console.log(res);
    //             that.globalData.data = res.encryptedData;
    //             that.globalData.data = res.iv;
    //             // 可以将 res 发送给后台解码出 unionId
    //             that.globalData.userInfo = res.userInfo;
    //             // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //             // 所以此处加入 callback 以防止这种情况
    //             if (that.userInfoReadyCallback) {
    //               that.userInfoReadyCallback(res)
    //             }
    //           }
    //         })
    //       }
    //     },
    //     fail:function(res){
    //       console.log(res);
    //     }
    //   });
    // })
    //获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.screenHeight = res.windowHeight;
        that.globalData.screenWidth = res.windowWidth;
      },
    });
    console.log(this.globalData.menu_data);
    // var currentMonth = new Date().getMonth() + 1
    // console.log(currentMonth)
  },
  globalData: {
    userinfo: null,
    user:null,
    orderCode: null,
    screenHeight:0,
    screenWidth:0,
    init_time: 1800000,
    invite_code:null,
    menu_data:null,
    authType:0,
    currentMonth : new Date().getMonth() + 1,
    currentFlag:false,
    taskOrder:"",
    withdrawType: 2,
    isGrabTaskReturnResult: false,
    taskTab: 0
  }
})