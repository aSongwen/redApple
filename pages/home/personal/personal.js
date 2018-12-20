// pages/home/personal/personal.js
const app = getApp();
const utils = require("../../../utils/verify.js");
const token = require("../../../utils/token.js");
const constants = require('../../../utils/constants.js');
const utilsPara = require('../../../utils/uiparams.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    width: '',
    title: [{
      src: "./icon/cente_icon_xinxibangding.png",
      text: "信息绑定",
      url: "./msgbinding",
      is_now: true,
    }, {
      src: "./icon/center_icon_tuijianderen.png",
      text: "我推荐的人",
      flag: "true",
      url: "./referee",
      is_now: true,
    }, 
    {
      src: "./icon/center_icon_xinshoujiaoxue.png",
      text: "统计",
      url: "./statistics",
      is_now: true,
    }, {
      src: "./icon/center_icon_bangzhu.png",
      text: "帮助与客服",
      url: "./customer",
      is_now: false,
    }],
    title2: [{
      src: "./icon/cente_icon_xinxibangding.png",
      text: "信息绑定",
      url: "./msgbinding",
      is_now: true,
    },/* {
      src: "./icon/center_icon_xinshoujiaoxue.png",
      text: "新手教学",
      url: "./html",
      is_now: true,
    },*/ {
      src: "./icon/center_icon_bangzhu.png",
      text: "帮助与客服",
      url: "./customer",
      is_now: false,
    }],
    user:'',
    userInfo:'',
    count:0,
    wx_headImage:'',
      backgroundUrl:''
  },

  navigatorTo: function (e) {
    var getCurMonth = new Date().getMonth() +1 ;
    wx.setStorage({
      key: "time",
      data: String(getCurMonth)
    })

    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  //判断跳转
  directToFunc: function () {
    var users = app.globalData.user;
    if (users != null && users.identity == 2 && users.identity != null) {
      if (users.status == 2) {
          wx.reLaunch({
            url: '/pages/home/deny/deny',
          })
      } else if (users.bindStatus == 5) {
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData){
      var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
      var params = utilsPara.getUiParam(mydata);
      if (params) {
        this.setData({
          home_menu_data: params,
        })

      }
    }
    
    this.directToFunc();
    this.setData({
      height: app.globalData.screenHeight,
      width: app.globalData.screenWidth,
    })
    if (app.globalData.user != null) {
     
    } else {
      if (wx.getStorageSync("user") != null || wx.getStorageSync("user") !='' ){

      }else{
        wx.reLaunch({
          url: '/pages/login/register2',
        })
      }
  }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //统计邀请码
  countCode: function () {
    var that = this;
    var app_url = app.globalData.all_url.promoter_code_count_url;
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: function (res) {
        if (res.data.success) {
          app.globalData.codeCount = res.data.content.total;
          app.globalData.codeUsed = res.data.content.used;
          app.globalData.successUsed = res.data.content.successUsed;
          var count = res.data.content.successUsed;
          that.setData({
            count:count
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.directToFunc();
    var p = token.refresh(app);
    p.then(function () {
      return token.getUserInfo(app);
    }).then(function () {
      // return token.checkAuth(app);
    }).then(function () {
      var userinfo = app.globalData.userinfo;
      if (userinfo != null && userinfo != '') {
        that.setData({
          userinfo: userinfo,
        })
      }
      // else{
      //   var u = {};
      //   var img = wx.getStorageSync("wx_head_image");
      //   u.avatarUrl = img;
      //   if (img != null && img != '') {
      //     that.setData({
      //       userinfo: u
      //     })
      //   }
      // }
      // return token.getTaskSuccessRate(app);
      return token.getTaskSuccessCount(app);
    }).then(function (res) {
      var map = res.data.content;
      var key = "3";
      that.setData({
        successRate: map[key]
      })
      // return token.getLastCode(app);
    }).then(function () {
      var users = app.globalData.user;
      if (users.identity == 2) {
        // if (users.bindStatus == 3 && users.bindRetry || users.bindStatus == 5) {
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

      if (users != null && users != '') {
        var img_url = wx.getStorageSync("wx_head_image");
        if(img_url==null||img_url==""){
          img_url = users.headImage;
        }
        that.setData({
          wx_headImage:img_url,
          user: users
        });
        that.countCode();
      }
    })
      .then(function () {
        return token.checkAppId(app);
      })
      // .then(function () {
      //   if (app.globalData.appId != null && app.globalData.appId != constants.AppId_RedApple) {
      //     wx.reLaunch({
      //       url: '/pages/home/deny/deny',
      //     });
      //     return;
      //   }
      // })
    .catch(function (res) {
      
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        if (res.data.errmsg.indexOf('不同平台') != -1) {
          wx.reLaunch({
            url: '/pages/home/notice/notices',
          });
          return;
        } else if (res.data.errmsg.indexOf('未找到用户信息') != -1) {
          that.setData({
            user: null
          })
          app.globalData.user = null;
          wx.clearStorageSync();
        } else {
          token.refreshPage(res, that);
        }
      } else if (res!=null && res.data!=null && res.data.notes == '间隔刷新3') {
        var users = app.globalData.user;
        if (users != null && users != '') {
          that.setData({
            user: users
          })
          that.countCode();
        } else {
          console.log("个人中心跳转页面")
       //   utils.verify();
        }
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
      // var p = token.getUserInfo(app);
      // p.then(function(){
      //   _that.loadData();
      // });
      wx.stopPullDownRefresh();//停止刷新
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