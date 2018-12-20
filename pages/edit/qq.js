// pages/edit/qq.js
const app = getApp();
const token = require('../../utils/token.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:true,
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
    token.refresh(app);
    var users = app.globalData.user;
    if (users != null && users != '') {
      this.setData({
        user: users
      })
    }
    if (this.data.user.qq == null) {
      wx.setNavigationBarTitle({
        title: '设置QQ号',
      })
      this.setData({
        loading: true
      })
    } else {
      wx.setNavigationBarTitle({
        title: '修改QQ号',
      })
      this.setData({
        loading: true
      })
    }
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
  /**
   * 设置QQ
   */
  setQQ:function(e){
    this.setData({
      qq: e.detail.value
    })
  },
  /**
   * 保存QQ
   */
  saveQQ:function(){
    var that = this;
    if (that.data.disabled){
      if (that.data.qq != null && that.data.qq != '') {
       var p = token.refresh(app)
       p.then(function () {
        wx.request({
          url: app.globalData.all_url.qq_url + '?access_token=' + app.globalData.access_token,
          header: {
            "Content-Type": "application/json",
          },
          data: {
            userId: '173844557272772',
            qq: that.data.qq
          },
          method: "POST",
          success: function (res) {
            if(res.data.success){
              wx.showToast({
                title: res.data.content,
                duration:1500
              });
              that.setData({
                disabled: false
              });
            }else {
              if (res!=null && res.data!=null && res.data.errmsg != null) {
                token.refreshPage(res, that);
              } else {
                // wx.showModal({
                //   title: '错误提示',
                //   content: '与服务器连接超时',
                //   showCancel: false
                // })
              }
            }
          },
          fail: function (res) {
            if (res!=null && res.data!=null && res.data.errmsg != null) {
              token.refreshPage(res, that);
            } else {
              // wx.showModal({
              //   title: '错误提示',
              //   content: '与服务器连接超时',
              //   showCancel: false
              // })
            }
          }
        })
       }).catch(function (res) {
         if (res != null && res.data != null && res.data.errmsg != null) {
           token.refreshPage(res, that);
         }
       })
      } else {
        wx.showModal({
          title: '错误提示',
          content: 'QQ号不能为空',
          showCancel: false
        })
      }
    }
  }
})