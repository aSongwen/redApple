// pages/home/message/message.js
const app = getApp();
const token = require('../../../utils/token.js');
const utils = require("../../../utils/verify.js");
const page = require("../../../utils/page.js");
const util = require("../../../utils/util.js");
const constants = require('../../../utils/constants.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchBool: false, //"上拉加载"的变量，默认false，隐藏  
    allData: false,  //“没有数据”的变量，默认false，隐藏  
    height: '',
    width: ''
  },

  //判断跳转
  directToFunc: function () {
    var users = app.globalData.user;
    if (users != null && users.identity != null && users.identity == 2) {
        if (users.status == 2) {
          wx.reLaunch({
            url: '/pages/home/deny/deny',
          })
        }else if (users.bindStatus == 5) {
          console("message跳转注册页面")
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
    var that = this;
    that.directToFunc();
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height:res.windowHeight,
          width:res.windowWidth,
        })
      },
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
    that.directToFunc();
    that.setData({
      index: 1,
      tasklist: null,
      size: 10,
      searchBool:true,
    })
    var p = token.refresh(app);
    p.then(function () {
    return that.searchTitle();
    }).then(function () {
    return token.checkAppId(app);
    }).then(function(){
      // if (app.globalData.appId != null && app.globalData.appId != constants.AppId_RedApple) {
      //   wx.reLaunch({
      //     url: '/pages/home/deny/deny',
      //   });
      //   return;
      // }
    }).catch((res)=>{
      if(res!=null&&res.data!=null&&res.data.errmsg!=null){
        if (res.data.errmsg.indexOf('不同平台') != -1) {
          wx.reLaunch({
            url: '/pages/home/notice/notices',
          });
          return;
        } 
        if (res.data.errmsg.indexOf("Token已失效") > -1) {
          wx.showModal({
            content: "刷新一下",
            showCancel: false,
            success: function (rest) {
              if (rest.confirm) {
                that.onShow()
              }
            }
          })
        } else {
          wx.showModal({
            content: res.data.errmsg,
            showCancel: false
          });
        }
        
      }
    });
    

    // if (app.globalData.usermessagesize == null){
    //   that.setData({
    //     callbackcount: 3,
    //   })
    //   that.searchTitle();
    // }else{
    //   that.setData({
    //     callbackcount: app.globalData.usermessagesize,
    //   })
    //   var p = new Promise(function (resolve,reject){
    //     that.searchTitle();
    //     resolve();
    //   })
    //   p.then(function(){
    //     that.setData({
    //       searchPageNum: 10,
    //       callbackcount: 3,
    //     })
    //   })
    // }
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
    let that = this;
    if (that.data.searchBool && !that.data.allData) {
      that.setData({
        index: that.data.index + 1,  //每次触发上拉事件，把searchPageNum+1  
        searchBool: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      that.searchTitle();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //查询公告
  searchTitle: function () {
    var that = this;
    // var t = util.formatTime(new Date());
  
     var p = page.getSearchUser(app, that.data.index, that.data.size);
     p.then(function (res) {
      
      //判断是否有数据，有则取数据  
      if (res.data.content.records.length > 0) {
        var tasklist = that.data.tasklist;
        var list = res.data.content.records;
        if (list.length == that.data.size){
          that.setData({
            allData:true,
          })
        }else{
          that.setData({
            allData: false,
            searchBool: true,
          })
        }
        for (var x in list){
          var msg = list[x].content;
          var first = msg.indexOf('：');
          var last = msg.indexOf('元');
          if(first != -1 && last != -1 && first < last){
            var money = msg.substring(first+1,last);
            list[x].money = money;
          }
          list[x].time = util.formatTime4(new Date(list[x].gmtCreate));
          var arr = msg.split(";");
          list[x].arr = arr;
          list[x].height = arr.length * 60 + 20;
        }
        tasklist == null? tasklist = list:tasklist.concat(list);
        that.setData({
          tasklist: tasklist,
        })
      }else{
        that.setData({
          allData: true,
        })
      }
    }).catch(function(res){
      if(res!=null && res.data!=null && res.data.errmsg != null){
        token.refreshPage(res, that);

      }else{
        // wx.showModal({
        //   title: '错误提示',
        //   content: '与服务器连接超时',
        //   showCancel: false,
        // })
      }
      that.setData({
        allData: true,
        searchBool: false,
      })
    })
  },
  // //滚动到底部触发事件  
  // searchScrollLower: function () {
  //   // console.log(123);
  //   let that = this;
  //   if (that.data.searchLoading && !that.data.searchLoadingComplete) {
  //     that.setData({
  //       searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
  //       isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
  //     });
  //     that.searchTitle();
  //   }
  // },
  /**
   * 页面跳转
   */
  navTo: function (e) {
    var i = e.currentTarget.dataset.data;
    var tasklist = this.data.tasklist[i];
    
    wx.navigateTo({
      url: './messagedetails/messagedetails?id=' + tasklist.id,
    })
  }
})