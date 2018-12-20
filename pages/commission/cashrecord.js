// pages/commission/cashrecord.js
const app = getApp();
const page = require('../../utils/page.js');
const util = require('../../utils/util.js');
const token = require('../../utils/token.js')
const utilsPara = require('../../utils/uiparams.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    width: '',
    detail: [ ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    if (app.globalData.menu_data){
      var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
      var params = utilsPara.getUiParam(mydata);
      if (params) {
        this.setData({
          home_menu_data: params,
        })
        var title = params.home_0006 + "记录";
        wx.setNavigationBarTitle({
          title: title,
        });
      }
    }
    
    that.setData({
      index:1,
      size:6,
      withdrawType:1,
      tasklist: null,
    })
    that.findCashRecord();
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
    var that = this;
    that.findCashRecord();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  findCashRecord:function(){
    var that = this;

    var p = token.refresh(app);
    p.then(function(res){
      return page.getSearchMoneyCert(app, that.data.index, that.data.size, that.data.withdrawType);
    }).then(function (data) {
      //判断是否有数据，有则取数据  
      if (data.content.records.length != 0) {
        
        let searchList = that.data.tasklist;
        var tasklist = data.content.records;
      
        if (tasklist.length < 6) {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          })
        } else {
          that.setData({
            searchLoading: true   //把"上拉加载"的变量设为true  
          })
        }
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        searchList == null ? searchList = tasklist : searchList = that.data.tasklist.concat(tasklist);
        for (var i = 0; i < searchList.length;i++){
          if (searchList[i].tradingType==3){
            var card = searchList[i].payeeAccount;
            searchList[i].card = card.substr(card.length - 4);
          }
          if (searchList[i].status == 3){
            searchList[i].amount = '+'+Math.abs(searchList[i].amount);
          }
        }
        for (var i = 0; i < searchList.length; i++) {
          searchList[i].gmtTime = util.formatTime(new Date(searchList[i].gmtCreate));
        }
        that.setData({
          tasklist: searchList, //获取数据数组
          index: that.data.index + 1,
        });
        // app.globalData.usermessagesize = searchList.length
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        });
      }
    }).catch(function (res) {
      
      if (res != null && res.data != null && res.data.errmsg!=null) {
        token.refreshPage(res, that);
      } else {
        // wx.showModal({
        //   title: '错误提示',
        //   content: '与服务器连接超时',
        //   showCancel: false
        // })
      }
      that.setData({
        searchLoadingComplete: true, //把“没有数据”设为true，显示  
        searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
      });
    });
  },
  /**
   * 查询系统审核记录
   */
  toCashWait:function(){
    
  }
})