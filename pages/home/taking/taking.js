// pages/home/taking/taking.js
const app = getApp()
const token = require('../../../utils/token.js');
const utilsPara = require('../../../utils/uiparams.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    width: '',
    selected_id: 0,
    is_show: false,
    changeValue: '',
      backgroundUrl:''
  },

  selected: function (e) {
    var id = e.target.dataset.id;
    this.setData({
      selected_id: id,
    })
  },

  getValue: function (e) {
    this.setData({
      is_show: true,
      changeValue: e.detail.value,
    })
  },

  hiddenShow: function () {
    this.setData({
      is_show: false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //
    var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
    var params = utilsPara.getUiParam(mydata);
    if (params) {
      this.setData({
        home_menu_data: params,
      })
      var title = params.home_0005 + '设置';
      wx.setNavigationBarTitle({
        title: title,
      });
    }

    if (app.globalData.user != null) {
      //  token.getConfig(app);
    } else {
      if(wx.getStorageSync("user") != null || wx.getStorageSync("user") != ''){

      }else{
        wx.reLaunch({
          url: '/pages/login/register2',
        })
      }
    }
    this.setData({
      height: app.globalData.screenHeight,
      width: app.globalData.screenWidth,
      selected_id: 1,
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
    token.getToken(app);
    that.setData({
      moneys: null,
      loading: true,
    })
    var p = token.getConfig(app);
    p.then(function(){
      var moneys = app.globalData.config;

      if (moneys != null && moneys != '') {
        that.setData({
          moneys: moneys,
          min: moneys.minTaskMoney,
          max: moneys.maxTaskMoney,
        })
      }
      if (moneys.type == null) {
        that.setData({
          selected_id: 1,
        })
      } else {
        that.setData({
          selected_id: moneys.type,
        })
      }
    });
    token.getBgmarkUrl(app).then(function(res){
        that.setData({
            backgroundUrl :res
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

  },
  /**
   * 设置最小金额
   */
  setMin: function (e) {
    this.setData({
      min: e.detail.value
    })
  },
  /**
   * 设置最大金额
   */
  setMax: function (e) {
    this.setData({
      max: e.detail.value
    })
  },
  
  saveConfig: function () {
    var that = this;
    // var min = that.data.min;
    var min = 0;
    var max = that.data.max;
    var bool = true;
    // if (min == null || min.length == 0) {
    //   min = null;
    // } else {
    //   min = parseFloat(that.data.min);
    // }
    if (max == null || max.length == 0) {
      max = null;
    } else {
      max = parseFloat(that.data.max);
    }
    if (min != null && max != null) {
      min = parseFloat(min);
      max = parseFloat(max);
      if (min > max) {
        wx.showModal({
          title: '错误提示',
          content: '最小金额不能超过最大金额',
          showCancel: false,
        })
        bool = false;
      }
    }
    if (bool) {
      that.setData({
        loading: false,
      });
      
      var pro = new Promise(function (resolve, reject) {
        wx.request({
          url: app.globalData.all_url.save_promoter_config_url + '?access_token=' + app.globalData.access_token,
          header: {
            "Content-Type": "application/json",
          },
          data: {
            id: that.data.moneys.id,
            promoterId: that.data.moneys.promoterId,
            type: that.data.selected_id,
            minTaskMoney: min,
            maxTaskMoney: max
          },
          method: "POST",
          success: function (res) {
            
            if (!res.data.success) {
              if (res!=null &&res.data!=null && res.data.errmsg != null) {
                token.refreshPage(res, that);

              } 
              reject(res);
            } else {
              if(res!=null && res.data!=null && res.data.content!=null){
                wx.showToast({
                  title: res.data.content,
                  duration: 3000
                })
              }
              resolve();
            }
          },
          fail: function (res) {
            if (res!=null &&res.data!=null&&res.data.errmsg != null) {
              token.refreshPage(res, that);
            } 
            that.setData({
              loading: true,
            })
          }
        })
      })
      pro.then(function () {
        var p = token.refresh(app);
        p.then(function () {
          return token.getUserInfo(app);
        }).then(function () {
          return token.getConfig(app);
        }).then(function () {
          // return token.getFinance(app);
        }).then(function () {
          // return token.getLastCode(app);
        }).then(function () {
          // return token.countCode(app);
        }).then(function () {
          // return token.queryCode(app);
        }).then(function () {
          // return token.getFeeWithdraw(app);
        }).then(function () {
          that.setData({
            loading: true,
          })
          wx.switchTab({
            url: '/pages/home/home',
          })
        }).catch(function (res) {
          if (res!=null && res.data!=null && res.data.errmsg != null) {
            token.refreshPage(res, that);
          }
          that.setData({
            loading: true,
          })
          
        })
      }).catch(function (res) {
        if (res!=null && res.data!=null && res.data.errmsg != null) {
          token.refreshPage(res, that);
        } 
        that.setData({
          loading: true,
        })
        
      })
    }
  }
})