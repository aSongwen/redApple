// pages/home/task/revision-task/revision-task.js
const app = getApp();
const util = require('../../../../utils/timer3.js')
const util1 = require('../../../../utils/timer.js')
const token = require('../../../../utils/token.js')
const utilsPara = require('../../../../utils/uiparams.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: '',
    src: '../../icon/img_touxiang.png',
    //src1: '../../icon/icon_daojishi.png',
    //src2: '../../icon/icon_guanjianci.png',
    //src3: '../../icon/icon_chengjiaojiage.png',
    //src4: '../../icon/icon_xiadanshuliang.png',
    //src5: '../../icon/icon_jiangliyongjin.png',
    //src6: '../../icon/icon_shangjiayaoqiu.png',
    //src7: '../../icon/icon_tishixinxi.png',
    //src8: '../../icon/icon_dizhi.png',
    keyWord: '欧美流行格纹T恤',
    name: '',
    task_pay:0,
    retrytime:1,
    shokeyStatus:-1,
    backgroundUrl:'',
    taskAuditMode:1,
    taskAuditMode_css:'six',
    userMount:'',
    isDeputy: 1,
    countDownTime:'',
    imageCheckbox:true,
    AuditingType:0
  },
  //预览图片
  listenerButtonPreviewImage: function (e) {
    
  },

  /**
   * 返回tabBar页面
   */
  totask: function () {
    wx.switchTab({
      url: '../task',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    var linkAddress = '';
    if (wx.getStorageSync('bool5') == 1){
      linkAddress = wx.getStorageSync('linkAddress')
    }*/
    this.setData({
      width: app.globalData.screenWidth,
      height: app.globalData.screenHeight,
      id: options.id,
      disable: true,
      checkbool1: false,
      checkbool2: false,
      checkbool3: false,
      checkbool4: false,
      loading: true,
     // bool5:0,
      display:true,
      enOutTime:true,
      taskType:0
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  isnumber(number){
    if(parseInt(number) == number) return true;
    return false;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //
    var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
    var params = utilsPara.getUiParam(mydata);
    if (params) {
      this.setData({
        home_menu_data: params,
      })
      var title = '操作' + params.persion_0003;
      wx.setNavigationBarTitle({
        title: title,
      });
      
    var linkAddress = '';
    if (wx.getStorageSync('bool5') == 1){
      linkAddress = wx.getStorageSync('linkAddress');
    }else{

    }
    this.setData({
      linkAddress: linkAddress,
    })

    }

    util.stopTime();
    var that = this;
    that.setData({
      realEndTime: null,
      end: null,
      endTime: null,
    })
    var p = token.refresh(app);
    p.then(function () {
      return token.getTaskDetail(app, that.data.id);
    }).then(function (res) {
      that.setData({
        task: res.data.content,
        taskAuditMode: res.data.content.taskAuditMode,
        countDownTime: res.data.content.countDownTime,
        earnCode:'核对成功后进入下一步',
      })
      var task = that.data.task;
      var vretrytime=1;
      if (res.data.content){
        vretrytime =res.data.content.retrytime;
      }
      
      var listingProps = that.data.task.listing.listingProps;
      listingProps = JSON.parse(listingProps);
      
      var url = [task.listing.mainImageUrl];
      //task_pay
      var vtask_pay = 0;
      var vshokeyStatus=-1;
      if (!that.isnumber(task.listing.price)) {
        vtask_pay = (task.listing.price * task.task.buyCount).toFixed(2);
      } else {
        vtask_pay = task.listing.price * task.task.buyCount;
      }
      if(task){
        vshokeyStatus = task.task.shokeyStatus;
      }

      that.setData({
        user: app.globalData.user,
        imagelist: url,
        listingProps: listingProps,
        task_pay: vtask_pay,
        retrytime: vretrytime,
        shokeyStatus: vshokeyStatus,
      })
     
      
      var realStartTime = parseInt(task.task.realStartTime);
      that.setData({
        realEndTime: realStartTime + task.timeOut,
        end: that.data.task.currentServerTime,
      })
      
      
      var realEndTime = parseInt(that.data.realEndTime);
      var date = parseInt(task.currentServerTime);
      that.setData({
        endTime: realEndTime - date,
      })
      var endTime = Math.floor(that.data.endTime / 1000);
      if (endTime > 0) {
        util.settimer(endTime, that);
      } else {
        util1.stopTimer();
        wx.setStorageSync("bool5", 0);
        wx.setStorageSync("checkLinkTime", "");
        wx.setStorageSync("linkAddress", "");
        that.setData({
          date: '任务已超时',
          earnCode: '核对成功后进入下一步',
          disable: true,
          enOutTime:false,
        })
      }
      var endTime = that.data.endTime;
      if (wx.getStorageSync('bool5') == 1) {
        that.linkTimer();
      }
      
    }).catch(function (res) {
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        token.refreshPage(res, that);
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
    
    util.stopTime();
    util1.stopTimer();
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
    util.stopTime();
    util1.stopTimer();
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
    wx.navigateTo({
      url: '/pages/dispatch/cancel?id=' + id + "&taskType=" + this.data.taskType,
    })
  },
  /**
   * 剪切板
   */
  setClipboardData: function (e) {
    wx.setClipboardData({
      data: e.target.dataset.value,
    })
    wx.showToast({
      title: '复制成功',
      icon: 'success',
      duration: 2000
    })
  },
  setusedAmount: function (e) {
    var that = this;
    var usedAmount = e.detail.value;
    that.setData({
      usedAmount: usedAmount,
    })
  },
  /**
   * 设置核对链接
   */
  setLinkAddress: function (res) {
    
    var that = this;
    that.setData({
      linkAddress: res.detail.value,
    })
  },
  /**
   * 删除淘口令
   */
  delLinkAddress: function () {
    var that = this;
    util1.stopTimer();
    that.setData({
      linkAddress: null,
      disable: true,
      earnCode: '核对成功后进入下一步',
    })
    wx.setStorageSync("linkAddress","");
    wx.setStorageSync("bool5", 0);
    wx.setStorageSync("checkLinkTime", "");
  },
  setUserMount: function (res) {
    var that = this;
    that.setData({
      userMount: res.detail.value,
    })
  },
  /**
   * 删除
   */
  delUserMount: function () {
    var that = this;
    that.setData({
      userMount: null,
    })
  },
  /**
   * 提交订单
   */
  sumbitTask: function () {
    var that = this;
    var amount = that.data.userMount;
    var vretrytime = that.data.retrytime;
    var vshokeyStatus = that.data.shokeyStatus;
    var taskAuditMode = that.data.taskAuditMode;
    var id = that.data.id;
    var AuditingType = that.data.AuditingType;
    console.log(AuditingType+"=================")
    /**if(this.data.bool5==0){
      wx.showModal({
        title: '错误提示',
        content: '请先核对商品信息',
      });
      return;
    }*/
  
    if (!that.data.enOutTime){
      wx.showModal({
        title: '错误提示',
        content: '任务已超时',
      });
      return;
    }
    if (taskAuditMode == 2){
      var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
      if (amount == null || amount == undefined || amount.trim() == "") {
        wx.showModal({
          title: '错误提示',
          content: '请输入付款金额',
          showCancel: false,
        });
        return;
      } else if (amount<=0){
        wx.showModal({
          title: '错误提示',
          content: '付款金额不能小于0',
          showCancel: false,
        });
        return;
      } else if (!exp.test(amount)) {
        wx.showModal({
          title: '错误提示',
          content: '金额不正确，请输入正确的金额',
          showCancel: false
        });
        return;
      }
    }
    if (that.data.taskAuditMode == 1 && !that.data.task.storeBind) {
      wx.showModal({
        title: '错误提示',
        content: '商品信息缺失',
        showCancel:false
      });
      return;
    } else {
      var p = token.pushOrder2(app, id, 1, amount, null, null);
        p.then(function (res) {
          var res = res;
          wx.showModal({
            title: '订单提交成功',
            content: '提交成功，请等待后台审核',
            showCancel: false,
            success: function (data) {
              wx.redirectTo({
                url: '/pages/home/task/Auditing/Auditing?time=' + res.data.content.serverCurrentTime + '&retrytime=' + vretrytime + "&shokeyStatus=" + vshokeyStatus + "&taskAuditMode=" + taskAuditMode + "&AuditingType" + AuditingType,
              })
            }
          })
          wx.setStorageSync("bool5", 0);
          wx.setStorageSync("checkLinkTime", "");
          wx.setStorageSync("linkAddress", "");
        }).catch(function (res) {
          if(res!=null && res.data!=null &&res.data.errmsg!=null){
              // token.refreshPage(res, that); 
             wx.showModal({
                title: '订单提交失败',
                content: res.data.errmsg,
                showCancel: false
            })
          }
        })
    }
  },
    //勾选事件
    clickCheckbox:function(){
        var that = this;
        if(that.data.imageCheckbox){
            that.setData({
                imageCheckbox:false
            })
        }else{
            that.setData({
                imageCheckbox:true
            })
        }
    },
  /**
   * 勾选事件
   */
  checkboxChange: function (e) {
    
    var that = this;
    var endTime = that.data.endTime;
    if (endTime > 0) {
      var bool1 = that.data.checkbool1;
      var bool2 = that.data.checkbool2;
      var bool3 = that.data.checkbool3;
      var bool4 = that.data.checkbool4;
      if (Boolean(e.detail.value[0])) {
        bool1 = true;
        that.setData({
          checkbool1: bool1,
        })
      } else {
        bool1 = false;
        that.setData({
          checkbool1: bool1,
        })
      }
      
      if (bool1 && bool2 && bool3 && bool4) {
        that.setData({
          display: false
        })
      } else {
        that.setData({
          display: true
        })
      }
    }
  },
  checkboxChange2: function (e) {
    
    var that = this;
    var endTime = that.data.endTime;
    if (endTime > 0) {
      var bool1 = that.data.checkbool1;
      var bool2 = that.data.checkbool2;
      var bool3 = that.data.checkbool3;
      var bool4 = that.data.checkbool4;
      if (Boolean(e.detail.value[0])) {
        bool2 = true;
        that.setData({
          checkbool2: bool2,
        })
      } else {
        bool2 = false;
        that.setData({
          checkbool2: bool2,
        })
      }
      
      if (bool1 && bool2 && bool3 && bool4) {
        that.setData({
          display: false
        })
      } else {
        that.setData({
          display: true
        })
      }
    }
  },
  checkboxChange3: function (e) {
    
    var that = this;
    var endTime = that.data.endTime;
    if (endTime > 0) {
      var bool1 = that.data.checkbool1;
      var bool2 = that.data.checkbool2;
      var bool3 = that.data.checkbool3;
      var bool4 = that.data.checkbool4;
      if (Boolean(e.detail.value[0])) {
        bool3 = true;
        that.setData({
          checkbool3: bool3,
        })
      } else {
        bool3 = false;
        that.setData({
          checkbool3: bool3,
        })
      }
     
      if (bool1 && bool2 && bool3 && bool4) {
        that.setData({
          display: false
        })
      } else {
        that.setData({
          display: true
        })
      }
    }
  },
  checkboxChange4: function (e) {
    var that = this;
    var endTime = that.data.endTime;
    if (endTime > 0) {
      var bool1 = that.data.checkbool1;
      var bool2 = that.data.checkbool2;
      var bool3 = that.data.checkbool3;
      var bool4 = that.data.checkbool4;
      if (Boolean(e.detail.value[0])) {
        bool4 = true;
        that.setData({
          checkbool4: bool4,
        })
      } else {
        bool4 = false;
        that.setData({
          checkbool4: bool4,
        })
      }
     
      if (bool1 && bool2 && bool3 && bool4) {
        that.setData({
          display: false
        })
      } else {
        that.setData({
          display: true
        })
      }
    }
  },
  /**
   * 核对淘口令
   */
  checkOrder: function () {
    var that = this;
    if (!that.data.enOutTime){
      wx.showModal({
        title: '错误提示',
        content: '任务已超时!',
      })
      that.setData({
        linkAddress:''
      })
      return;
    }
    if (wx.getStorageSync('bool5')==1){
      util1.stopTimer();
      that.setData({
        earnCode: '核对成功后进入下一步',
        disable:true,
      })
      wx.setStorageSync("checkLinkTime", '');
      wx.setStorageSync("bool5", 0);
      wx.setStorageSync("linkAddress", "");
    }
    var task = that.data.task;
    that.setData({
      loading: false,
    })
    if (that.data.linkAddress != null && that.data.linkAddress.length > 0) {
      var p = token.checkOrder(app, that.data.id, that.data.linkAddress);
      p.then(function (res) {
        if (res.data.success) {
          var checkLinkTime = new Date().getTime();
          wx.setStorageSync("checkLinkTime", checkLinkTime);
          wx.setStorageSync("bool5", 1);
          wx.setStorageSync("linkAddress", that.data.linkAddress);
          that.linkTimer();
          wx.showToast({
            title: '商品正确',
            duration: 1000,
          });
          that.setData({
            loading: true,
          })
        } else {
          that.setData({
            loading: true,
            earnCode: '核对成功后进入下一步',
            disable: true
          })
        }
      }).catch(function (res) {
        that.setData({
          loading: true,
          earnCode: '核对成功后进入下一步',
          disable: true
        })
        if (res!=null &&res.data!=null && res.data.errmsg != null) {
          token.refreshPage(res, that);
        } 
      })
    } else {
      that.setData({
        loading: true,
        earnCode: '核对成功后进入下一步',
        disable: true
      })
      wx.showModal({
        title: '错误提示',
        content: '淘宝链接不能为空',
        showCancel: false,
      })
    }
  },

  /**
   * 120秒倒计时
   */
  linkTimer: function () {
    var that = this;
    if (!that.data.enOutTime){
      util1.stopTimer();
      wx.setStorageSync("bool5", 0);
      wx.setStorageSync("checkLinkTime", "");
      wx.setStorageSync("linkAddress", "");
      that.setData({
        earnCode: '核对成功后进入下一步',
        disable: true,
      });
      return;
    }
    var checkLinkTime = wx.getStorageSync('checkLinkTime');
    if ((new Date().getTime()) - checkLinkTime <= that.data.countDownTime * 1000) {
      let num = Math.floor((that.data.countDownTime * 1000 - (new Date().getTime() - checkLinkTime)) / 1000);
      util1.downTimer(num, that);
    } else {
      that.setData({
        earnCode: '点击进入下一步',
        disable: false,
      })
    }

  },

  /**
   * 进入下一页
   */
  nextPage:function(){
    var that = this;
    console.log(that.data.imageCheckbox)
    if (that.data.imageCheckbox) {
      wx.showModal({
        title: '错误提示',
        content: '请勾选提示后在进入下一步',
        showCancel: false,
      });
      return;
    }
    that.setData({
      isDeputy: 2,
    });
  },
  /**
    * 返回上一步
    */
  back:function(){
    var that = this;
    that.setData({
      isDeputy: 1,
      display:true,
      checkbool1: false,
      checkbool2: false,
      checkbool3: false,
      checkbool4: false,
    });
  },
  setAuditModel:function(model){
    if(model==1){
      this.setData({
        audit_model: 1,
        audit_model_css: 'six'
      });
    } else if (model == 2){
      this.setData({
        audit_model: 2,
        audit_model_css: 'six_model2'
      });
    }else{
      this.setData({
        audit_model: 1,
        audit_model_css: 'six'
      });
    }
  },
})