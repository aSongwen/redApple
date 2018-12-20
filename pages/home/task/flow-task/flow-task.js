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
        keyWord: '欧美流行格纹T恤',
        name: '',
        shokeyStatus:-1,
        backgroundUrl:'',
        countDownTime:'',
        imageCheckbox:true,
        collectPicture:null,
        shoppingPicture:null,
        interestPicture:null,
        collectPictureId:null,
        shoppingPictureId:null,
        interestPictureId:null,
        bigImg:false,
        bigImg2:false,
        bigImg3:false
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
        this.setData({
            width: app.globalData.screenWidth,
            height: app.globalData.screenHeight,
            id: options.id,
            disable: true,
            loading: true,
            enOutTime:true,
            taskType:1,
            AuditingType:1
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

            var flowLinkAddress = '';
            if (wx.getStorageSync('bool') == 1){
              flowLinkAddress = wx.getStorageSync('flowLinkAddress');
            }else{

            }
            this.setData({
              flowLinkAddress: flowLinkAddress,
            })
            if (wx.getStorageSync("collectPictureId") != null && wx.getStorageSync("collectPictureId") != ''){
              this.setData({
                collectPicture: wx.getStorageSync("collectPicture"),
                collectPictureId: wx.getStorageSync("collectPictureId")
              })     
            }

            if (wx.getStorageSync("interestPictureId") != null && wx.getStorageSync("interestPictureId") != '') {
              this.setData({
                interestPicture: wx.getStorageSync("interestPicture"),
                interestPictureId: wx.getStorageSync("interestPictureId")
              })
            }

            if (wx.getStorageSync("shoppingPictureId") != null && wx.getStorageSync("shoppingPictureId") != '') {
              this.setData({
                shoppingPicture: wx.getStorageSync("shoppingPicture"),
                shoppingPictureId: wx.getStorageSync("shoppingPictureId")
              })
            }
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
            return token.getTaskFlowDetail(app, that.data.id);
        }).then(function (res) {
            that.setData({
                task: res.data.content,
                countDownTime: res.data.content.countDownTime,
                earnCode:'核对成功后完成提交',
            })
            var task = that.data.task;
         
            that.setData({
                user: app.globalData.user,
                imagelist: task.mainImageUrl,
            })
            var realStartTime = parseInt(task.realStartTime);
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
                wx.setStorageSync("bool", 0);
                wx.setStorageSync("checkFlowLinkTime", "");
                wx.setStorageSync("flowLinkAddress", "");
                wx.setStorageSync("collectPicture", "");
                wx.setStorageSync("shoppingPicture", "");
                wx.setStorageSync("interestPicture", "");
                wx.setStorageSync("collectPictureId", "");
                wx.setStorageSync("shoppingPictureId", "");
                wx.setStorageSync("interestPictureId", "");
                that.setData({
                    date: '任务已超时',
                    earnCode: '核对成功后完成提交',
                    disable: true,
                    enOutTime:false,
                })
            }
            var endTime = that.data.endTime;
            if (wx.getStorageSync('bool') == 1) {
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

    // 删除图片
    deleteImg: function (e) {
      var type = e.currentTarget.dataset.id;
      if (type == 1){
        this.setData({
          collectPicture: "",
          collectPictureId:""
        });
        wx.setStorageSync("collectPicture", "");
        wx.setStorageSync("collectPictureId", "");
      }else if(type == 2){
        this.setData({
          shoppingPicture: "",
          shoppingPictureId:""
        });
        wx.setStorageSync("shoppingPicture", "");
        wx.setStorageSync("shoppingPictureId", "");
      }else if(type == 3){
        this.setData({
          interestPicture: "",
          interestPictureId:""
        });
        wx.setStorageSync("interestPicture", "");
        wx.setStorageSync("interestPictureId", "");
      }
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
    //预览图片
    listenerviewImage: function (e) {
        var type = e.currentTarget.dataset.id;
        if (type == 1){
            this.setData({
                bigImg:!this.data.bigImg
            });
        }else if(type == 2){
            this.setData({
                bigImg2: !this.data.bigImg2
            });
        }else if(type == 3){
            this.setData({
                bigImg3: !this.data.bigImg3
            });
        }
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
    /**
     * 设置核对链接
     */
    setLinkAddress: function (res) {

        var that = this;
        that.setData({
          flowLinkAddress: res.detail.value,
        })
    },
    /**
     * 删除淘口令
     */
    delLinkAddress: function () {
        var that = this;
        util1.stopTimer();
        that.setData({
          flowLinkAddress: null,
            disable: true,
            earnCode: '核对成功后完成提交',
        })
        wx.setStorageSync("flowLinkAddress","");
        wx.setStorageSync("bool", 0);
        wx.setStorageSync("checkFlowLinkTime", "");
    },
   
    /**
     * 提交订单
     */
    sumbitTaskFlow: function () {
        var that = this;
        var id = that.data.id;
        var taobaolink = that.data.flowLinkAddress;
        var addImgId = that.data.shoppingPicture;
        var collectImgId = that.data.collectPicture;
        var attentionImgId = that.data.interestPicture;
        var taskFlowType = that.data.task.taskType;
        var executePrice = that.data.task.executePrice;
        var AuditingType = that.data.AuditingType;

        if (!that.data.enOutTime){
            wx.showModal({
                title: '错误提示',
                content: '任务已超时',
            });
            return;
        }
        var flowTask = that.data.task;
        if ((flowTask.taskType == 3 || flowTask.taskType == 5 || flowTask.taskType == 7 || flowTask.taskType == 8) && (that.data.collectPicture == null || that.data.collectPicture == '')) {
          wx.showModal({
            title: '错误提示',
            content: '请先上传商品收藏截图在提交任务',
          });
          return
        } else if ((flowTask.taskType == 2 || flowTask.taskType == 5 || flowTask.taskType == 6 || flowTask.taskType == 8) && (that.data.shoppingPicture == null || that.data.shoppingPicture == '')) {
          wx.showModal({
            title: '错误提示',
            content: '请先上传加入购物车截图在提交任务',
          });
          return
        } else if ((flowTask.taskType == 4 || flowTask.taskType == 6 || flowTask.taskType == 7 || flowTask.taskType == 8) && (that.data.interestPicture == null || that.data.interestPicture == '')) {
          wx.showModal({
            title: '错误提示',
            content: '请先上传关注店铺截图在提交任务',
          });
          return
        }
        if (that.data.imageCheckbox) {
          wx.showModal({
            title: '错误提示',
            content: '勾选提示后才能完成提交',
            showCancel: false,
          });
          return;
        }
        if (!that.data.task.storeBind) {
            wx.showModal({
                title: '错误提示',
                content: '商品信息缺失',
                showCancel:false
            });
            return;
        } else {
          var p = token.pushFlowOrder(app, id, taobaolink, addImgId, collectImgId, attentionImgId);
            p.then(function (res) {
                var res = res;
                wx.showModal({
                    title: '订单提交成功',
                    content: '提交成功，请等待后台审核',
                    showCancel: false,
                    success: function (data) {
                      if (taskFlowType == 1){
                        wx.redirectTo({
                          url: '/pages/home/task/Finish/Finish?executePrice=' + executePrice,
                        })
                      }else{
                        wx.redirectTo({
                          url: '/pages/home/task/Auditing/Auditing?time=' + new Date().getTime() + "&AuditingType=" + AuditingType + "&executePrice=" + executePrice,
                        })
                      }    
                    }
                })
                wx.setStorageSync("bool", 0);
                wx.setStorageSync("checkFlowLinkTime", "");
                wx.setStorageSync("flowLinkAddress", "");
                wx.setStorageSync("collectPicture", "");
                wx.setStorageSync("shoppingPicture", "");
                wx.setStorageSync("interestPicture", "");
                wx.setStorageSync("collectPictureId", "");
                wx.setStorageSync("shoppingPictureId", "");
                wx.setStorageSync("interestPictureId", "");
            }).catch(function (res) {
                if(res!=null && res.data!=null &&res.data.errmsg!=null){
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
    clickCheckbox: function () {
      var that = this;
      if (that.data.imageCheckbox) {
        that.setData({
          imageCheckbox: false
        })
      } else {
        that.setData({
          imageCheckbox: true
        })
      }
    },
    /**
     * 核对淘口令
     */
    checkFlowLinkAddress: function () {
        var that = this;
        if (!that.data.enOutTime){
            wx.showModal({
                title: '错误提示',
                content: '任务已超时!',
            })
            that.setData({
              flowLinkAddress:''
            })
            return;
        }
        if (wx.getStorageSync('bool')==1){
            util1.stopTimer();
            that.setData({
                earnCode: '核对成功后完成提交',
                disable:true,
            })
            wx.setStorageSync("checkFlowLinkTime", '');
            wx.setStorageSync("bool", 0);
            wx.setStorageSync("flowLinkAddress", "");
        }
        var task = that.data.task;
        that.setData({
            loading: false,
        })
        if (that.data.flowLinkAddress != null && that.data.flowLinkAddress.length > 0) {
          var p = token.checkFlowLinkAddress(app, that.data.id, that.data.flowLinkAddress);
            p.then(function (res) {
                if (res.data.success) {
                    var checkFlowLinkTime = new Date().getTime();
                    wx.setStorageSync("checkFlowLinkTime", checkFlowLinkTime);
                    wx.setStorageSync("bool", 1);
                    wx.setStorageSync("flowLinkAddress", that.data.flowLinkAddress);
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
                        disable: true
                    })
                }
            }).catch(function (res) {
                that.setData({
                    loading: true,
                    disable: true
                })
                if (res!=null &&res.data!=null && res.data.errmsg != null) {
                    token.refreshPage(res, that);
                }
            })
        } else {
            that.setData({
                loading: true,
                earnCode: '核对成功后完成提交',
                disable: true
            })
            wx.showModal({
                title: '错误提示',
                content: '淘宝链接不能为空',
                showCancel: false,
            })
        }
    },
    //上传商品收藏截图
    setCollectPicture: function () {
      var that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          console.log(res)
          var collectPictureId = res.tempFilePaths[0];
          var p = token.upload_file(app, collectPictureId);
          p.then(imgRes => {
            var collectPicture = imgRes.data.content[0];
            console.log(imgRes)
            wx.setStorageSync("collectPicture", collectPicture);
            wx.setStorageSync("collectPictureId", collectPictureId);
            that.setData({
              collectPictureId: collectPictureId,
              collectPicture: collectPicture
            });
          });
        },
      })
    },

    //上传加入购物车截图
    setShoppingPicture: function () {
      var that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          var shoppingPictureId = res.tempFilePaths[0];
          var p = token.upload_file(app, shoppingPictureId);
          p.then(imgRes => {
            var shoppingPicture = imgRes.data.content[0];
            wx.setStorageSync("shoppingPicture", shoppingPicture);
            wx.setStorageSync("shoppingPictureId", shoppingPictureId);
            that.setData({
              shoppingPicture: shoppingPicture,
              shoppingPictureId: shoppingPictureId
            });
          });
        },
      })
    },

    //上传关注店铺截图
    setInterestPicture: function () {
      var that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          var interestPictureId = res.tempFilePaths[0];
          var p = token.upload_file(app, interestPictureId);
          p.then(imgRes => {
            var interestPicture = imgRes.data.content[0];
            wx.setStorageSync("interestPicture", interestPicture);
            wx.setStorageSync("interestPictureId", interestPictureId);
            that.setData({
              interestPicture: interestPicture,
              interestPictureId: interestPictureId
            });
          });
        },
      })
    },
    /**
     * 120秒倒计时
     */
    linkTimer: function () {
        var that = this;
        if (!that.data.enOutTime){
            util1.stopTimer();
            wx.setStorageSync("bool", 0);
            wx.setStorageSync("checkFlowLinkTime", "");
            wx.setStorageSync("flowLinkAddress", "");
            that.setData({
              earnCode: '核对成功后完成提交',
                disable: true,
            });
            return;
        }
        var checkFlowLinkTime = wx.getStorageSync('checkFlowLinkTime');
        if ((new Date().getTime()) - checkFlowLinkTime <= that.data.countDownTime * 1000) {
          let num = Math.floor((that.data.countDownTime * 1000 - (new Date().getTime() - checkFlowLinkTime)) / 1000);
            util1.downTimer(num, that);
        } else {
            that.setData({
                earnCode: '完成提交',
                disable: false,
            })
        }

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