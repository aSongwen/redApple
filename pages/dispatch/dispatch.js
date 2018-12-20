// pages/dispatch/dispatch.js
const app = getApp();
const utilsPara = require('../../utils/uiparams.js');
const token = require('../../utils/token.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    width:'',
    backgroundUrl:'',
    taskTab:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tab = this.getRoundFigure(app.globalData.task);
    this.setData({
      height: app.globalData.screenHeight,
      width: app.globalData.screenWidth,
      id: app.globalData.task.executeTaskId,
      task: tab,
    });
    app.globalData.task = null;
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
    
    var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
    var params = utilsPara.getUiParam(mydata);
    if (params) {
      this.setData({
        home_menu_data: params,
      })
      var title = params.persion_0004 + '成功';
      wx.setNavigationBarTitle({
        title: title,
      });
    }
    if (that.data.id == null || that.data.id == undefined) {
      wx.navigateBack({});
    }
    if(that.data.task == null){
      wx.navigateBack({})
      // app.globalData.task = null;
    }
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

  getRoundFigure: function (data) {
    let that = this;
    var task = data;
    var tab = task;
    if (task.flowTaskType != null && task.flowTaskType.length > 0) {
      that.setData({
        taskTab : 1
      })
    } else {
      that.setData({
        taskTab: 0
      })
      var realPrice = parseFloat(task.listing.price) * parseFloat(task.taskProp.buyCount);
      var borrowPrice = realPrice - realPrice % 100 + 100;
      tab.borrowPrice = borrowPrice;
    }
     return tab;
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
  
  },
  /**
   * 弹窗
   */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
    var id = this.data.id;
    var taskType = this.data.taskTab;
    wx.navigateTo({
      url: './cancel?id=' + id + '&taskType=' + taskType,
    })
  },
  /**
   * 操作设置点击进行页面跳转事件
   */
  naviTo:function(){
    var that = this;
    var id = that.data.id;
    if(that.data.taskTab == 0) {
      wx.redirectTo({
        url: '/pages/home/task/operate-task/operate-task?id=' + id,
      })
    } else if(that.data.taskTab == 1) {
      wx.redirectTo({
        url: '/pages/home/task/flow-task/flow-task?id=' + id,
      })
    }

  }
})