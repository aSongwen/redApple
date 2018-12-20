// pages/dispatch/cancel.js
const app = getApp();
const token = require('../../utils/token.js');
const utilsPara = require('../../utils/uiparams.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    width:'',
    checkd:'0',
    types:'',
    flowitems: [
      { name: '1', value: '商品找不到', checked: '0', is_now: true },
      { name: '2', value: '达不到商家备注的要求', checked: '1', is_now: true },
      { name: '3', value: '不想做了', checked: '2', is_now: true },
      { name: '4', value: '问题任务', checked: '4', is_now: true },
      { name: '5', value: '没时间做', checked: '5', is_now: false },
    ],
    items: [
      { name: '1', value: '商品找不到', checked: '0', is_now: true  },
      { name: '2', value: '达不到商家备注的要求', checked: '1', is_now: true  },
      { name: '3', value: '不想做了', checked: '2', is_now: true  },
      { name: '4', value: '本金不够', checked: '3', is_now: true  },
      { name: '5', value: '问题任务', checked: '4', is_now: true  },
      { name: '6', value: '没时间做', checked: '5', is_now: false  },
    ],
    backgroundUrl:'',
    taskType:''
  },

  /**
   * 整行点击
   */
  radioChange:function(e){

    this.setData({
      checkd: e.target.dataset.id,
    })
  },

  /**
   * 返回tabBar页面
   */
  toHome:function(){
    var that = this;
    var id = that.data.id;
    var items = that.data.items;
    var i = that.data.checkd;
    var txt = items[i].value;
    
    that.setData({
      loading:false
    });
    var p = token.refresh(app);
    if (that.data.taskType == 0) {
    p.then(function () {
    return token.pushOrder2(app, id,3, null, txt, null);
    }).then(function(res){
        wx.setStorageSync("bool5", 0);
        wx.setStorageSync("checkLinkTime", "");
        wx.setStorageSync("linkAddress", '');
      wx.showToast({
        title: '已放弃',
        duration:1500
      })
      setTimeout(function(){
        that.setData({
          loading: true
        })
        wx.switchTab({
          url: '/pages/home/task/task',
        })
      },1800)
    }).catch(function(res){
      if (res != null&&res.data!=null&& res.data.errmsg!=null) {
        token.refreshPage(res, that);
      } else {
  
      }
      that.setData({
        loading: true
      })
    })
    } else if (that.data.taskType == 1){
      p.then(function () {
        return token.cancelTask(app, id, txt);
      }).then(function (res) {
        wx.setStorageSync("bool", 0);
        wx.setStorageSync("checkFlowLinkTime", "");
        wx.setStorageSync("flowLinkAddress", "");
        wx.setStorageSync("collectPicture", "");
        wx.setStorageSync("shoppingPicture", "");
        wx.setStorageSync("interestPicture", "");
        wx.setStorageSync("collectPictureId", "");
        wx.setStorageSync("shoppingPictureId", "");
        wx.setStorageSync("interestPictureId", "");
        wx.showToast({
          title: '已放弃',
          duration: 1500
        })
        setTimeout(function () {
          that.setData({
            loading: true
          })
          wx.switchTab({
            url: '/pages/home/task/task',
          })
        }, 1800)
      }).catch(function (res) {
        if (res != null && res.data != null && res.data.errmsg != null) {
          token.refreshPage(res, that);
        } else {

        }
        that.setData({
          loading: true
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
    var params = utilsPara.getUiParam(mydata);
    if (params) {
      this.setData({
        home_menu_data: params,
      })
      
    }

    this.setData({
      height: app.globalData.screenHeight,
      width: app.globalData.screenWidth,
      id: options.id,
      loading:true,
      taskType: options.taskType
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
    var that = this;
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