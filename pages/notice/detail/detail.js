const app = getApp();
const token = require('../../../utils/token.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth:'',
    id:'',
    notic:'',
    time:'',
    height:'',
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    // 最后一次单击事件点击发生时间
    lastTapTime: 0,
    // 单击事件点击后要触发的函数
    lastTapTimeoutFunc: null,
    textdisabled: true,
    textfocus: false,
    textValue:'绿叶丛中垂着累累的红色果子，站在一根小枝上兴奋地唱着？穿过水阁？那里就是朋友叶的家乡，一切都显得非常明亮；我们都跳上了岸，有的飞起来。在河边两棵大树下我们找到了几只小船？一个朋友解开绳子，我的眼睛真是应接不暇；第三只；一切都显得非常明亮，大的？黑的！两个朋友很快地爬到树上去；起初四周非常清静；给我们的拍掌声一惊；两个朋友很快地爬到树上去；另一个朋友说那里的榕树是两棵。一个朋友说那里只有一棵榕树！从陈的小学校出发；'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      screenWidth:app.globalData.screenHeight,
      height: app.globalData.screenHeight
    })
    var that = this;
    var p = token.searchSystemMessage(app, options.id);
    p.then(function(res){
      if(res.data.success){
        var msg = res.data.content;
        msg.getTime = util.formatTime(new Date(msg.gmtCreate));
        that.setData({
          msg: msg
        })
      }else{
        if(res!=null && res.data!=null &&res.data.errmsg!=null){
            wx.showModal({
              title: '错误提示',
              content: res.data.errmsg,
              showCancel: false
            })
        }
      }
    }).catch(function(res){
      if (res!=null && res.data!=null && res.data.errmsg != null) {
          wx.showModal({
            title: '错误提示',
            content: res.data.errmsg,
            showCancel: false
          }) 
      } else {
        // wx.showModal({
        //   title: '错误提示',
        //   content: '与服务器连接超时',
        //   showCancel: false
        // })
      }
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
  /// 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },
  editTextArea: function(){
    this.setData({
      textdisabled: false,
      textfocus: true
    })
  },
  setTextArea: function(e){
    var value = e.detail.value;
    this.setData({
      textValue: value,
      textdisabled: true,
      textfocus: false
    })
  },
  /// 双击
  doubleTap: function (e) {
    var that = this
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (that.touchEndTime - that.touchStartTime < 350) {
      // 当前点击的时间
      var currentTime = e.timeStamp
      var lastTapTime = that.lastTapTime
      // 更新最后一次点击时间
      that.lastTapTime = currentTime

      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime < 300) {
        // 成功触发双击事件时，取消单击事件的执行
        clearTimeout(that.lastTapTimeoutFunc);
        this.setData ({
          textdisabled: false,
          textfocus: true
        })
      }
    }
  }
})