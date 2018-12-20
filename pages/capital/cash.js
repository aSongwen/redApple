// pages/commission/cash.js
const app = getApp();
const token = require('../../utils/token.js');
const wxAuthorize = require('../../utils/wxAuthorize.js')
const utilsPara = require('../../utils/uiparams.js');
const constants = require('../../utils/constants.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    tradingType: 6,
    role: 0,
    card: 0,
    wx_deadLine:'',
    bank_deadLine:'',
    auth_count:0,
    backgroundUrl:'',
    systemBusy:true,
    errNotice:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData.menu_data);
    // token.getFeeWithdraw(app);
    // that.setData({
    //   height: app.globalData.screenHeight,
    //   width: app.globalData.screenWidth,
    //   bools: true,
    //   wechatbool: true,
    //   bankbool: true,
    //   fee: app.globalData.fee,
    //   minWithdrawAmount: app.globalData.minWithdrawAmount,
    // });
    //
    if (app.globalData.menu_data){
      var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
      var params = utilsPara.getUiParam(mydata);
      if (params) {
        this.setData({
          home_menu_data: params,
        })
        var title = params.home_0011;
        wx.setNavigationBarTitle({
          title: title,
        });
      }
    }


	  token.getFeeWithdraw(app).then(function(res){
      that.setData({
        fee: app.globalData.fee,
        minWithdrawAmount: app.globalData.minWithdrawAmount,
        miniBankWithdrawAmount: app.globalData.miniBankWithdrawAmount,
      });
    }).catch(res=>{
      if(res!=null&&res.data!=null&&res.data.errmsg!=null){
        token.refreshPage(res, that);
      }
    });
    that.setData({
      height: app.globalData.screenHeight,
      width: app.globalData.screenWidth,
      bools: true,
      wechatbool: true,
      bankbool: true,
    })
  },
    //跳转银行卡绑定页面判断
  goBindbankcard : function () {
      var idCardNumber =this.data.user.idCardNumber
      if(!idCardNumber) {
          wx.showModal({
              title: '您还未绑定身份证',
              content: '绑定身份证后，才能绑定银行卡',
              showCancel:false,
              success:function(res){
                  wx.navigateTo({
                      url: '/pages/edit/idCard',
                  })
              }
          })
      }else {
          wx.navigateTo({
              url: '/pages/edit/bindbankcard',
          })
      }
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    var num = parseInt(e.target.dataset.current);
    var tradingType = 0;
    switch (num) {
      case 0:
        tradingType = 6;
        break;
      case 1:
        tradingType = 3;
        break;
    }
    that.setData({
      tradingType: tradingType
    })
   
  },
  /**
   * 设置金额
   */
  setMoney: function (e) {
    this.setData({
      money: e.detail.value
    });
    var that = this;
    var money = parseFloat(that.data.money);
    var fee = parseFloat(that.data.fee);
    that.setData({
      feemoney: Math.round(money * fee) / 100,
    });
  },

  setBankMoney: function (e) {
    this.setData({
      bankMoney: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //查询配置时间
  queryWithdrawEndTime() {
    var that = this;
    wx.request({
      url: app.globalData.all_url.query_withdraw_endTime_url + '?access_token=' + app.globalData.access_token,
      method: 'POST',
      data: { code: '0,1' },
      header: {
        "Content-Type": "application/json",
      },
      success: (res) => {
        var data = res.data.content;
        if (data != null) {
          that.setData({
            wx_deadLine: data['0'],
            bank_deadLine: data['1']
          })
        }
      },
      fail: (res) => {

      }
    })
  },

  checkWithdrawStatus() {
    var that = this;
    wx.request({
      url: app.globalData.all_url.check_withdraw_status + '?access_token=' + app.globalData.access_token,
      method: 'POST',
      data: { appid: constants.AppId_RedApple },
      header: {
        "Content-Type": "application/json",
      },
      success: (res) => {
        let data = res.data;
        if (data.success) {
          that.setData({
            systemBusy: false
          })
        } else {
          if (data.errmsg != null && data.errmsg != "") {
            let code = that.parseErrcode(data.errmsg);
            if (code == "N8011" || code == "N8012" || code == "N8013") {
              that.setData({
                systemBusy: true
              })
              if (code == "N8011") {
                setTimeout(() => { that.checkWithdrawStatus() }, 10 * 60 * 1000);
                that.setData({
                  errNotice: data.errmsg
                })                
                console.log("定时器启动2...")
              } else {
                that.setData({
                  errNotice: that.parseErrmsg(data.errmsg)
                })
              }
            } else {
              if (data.errmsg.indexOf("Token已失效") > -1) {
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
                  content: data.errmsg,
                  showCancel: false
                })
              }
            }
          }
        }
      },
      fail: (res) => {

      }
    })
  },

  parseErrcode: function (errmsg) {
    let reg = /\((.+?)\)/;
    let code = errmsg.match(reg);
    if (code != null && code.length > 1) {
      console.log(code[1]);
      return code[1];
    } else {
      return 'N0000'
    }
  },
  parseErrmsg: function (errmsg) {
    let reg = /\([^\)]*\)/;
    if (errmsg.match(reg)) {
      return errmsg.replace(reg, '');
    } else {
      return errmsg;
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // var p = token.getUserInfo(app);
    that.checkWithdrawStatus();
    that.queryWithdrawEndTime();
    // token.getUserInfo(app).then(function(res) {
      that.setData({
        user: app.globalData.user,
        capital: token.returnFloat(app.globalData.moneys.earnAmount)
      })
      var bankCardNumber = app.globalData.user.bankCardNumber;
      if (bankCardNumber != null && bankCardNumber !="") {
        that.setData({
          bankCardNumber: bankCardNumber.substr(bankCardNumber.length - 4)
        })
      }
    // })

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

  },
  /**
   * 微信
   */
  wechatMoney: function (resUserInfo) {
    var that = this;
    if (resUserInfo && resUserInfo.detail && resUserInfo.detail.errMsg && resUserInfo.detail.errMsg.indexOf("fail auth deny") > -1) {
      //console.log("========no auth====================");
      return;
    }
    that.setData({
      wechatbool: false,
      disabled:true,
    })
    var minWithdrawAmount = app.globalData.minWithdrawAmount;
    var miniBankWithdrawAmount = app.globalData.miniBankWithdrawAmount;
    var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    if (that.data.money == null) {
      wx.showModal({
        title: '错误提示',
        content: '金额不能为空',
        showCancel: false
      });
      that.setData({
        wechatbool: true,
        disabled: fasle,
      })
    } else if (!exp.test(that.data.money)) {
      wx.showModal({
        title: '错误提示',
        content: '金额不正确，请输入正确的金额',
        showCancel: false
      });
      that.setData({
        wechatbool: true,
        disabled: fasle,
      })
    } else if (that.data.money <= 0) {
      wx.showModal({
        title: '错误提示',
        content: '金额不能小于0',
        showCancel: false
      });
      that.setData({
        wechatbool: true,
        disabled: fasle,
      })
    // } else if (that.data.money < minWithdrawAmount) {
    //   var msg = '金额不能低于最小额度' + minWithdrawAmount + '元';
    //   wx.showModal({
    //     title: '错误提示',
    //     content: msg,
    //     showCancel: false
    //   });
    //   that.setData({
    //     wechatbool: true,
    //   })
    } else {
      var p = token.refresh(app);
      p.then(function (res) {
        // if (app.globalData.withdrawType != null && app.globalData.withdrawType == 2) {
        //   return token.withdrawWechatTask(app, that.data.money, 2);
        // } else {
        //   return token.promoterMoney2(app, that.data.money, 2);
        // }
        if (resUserInfo && resUserInfo.detail) {
          app.globalData.userinfo = resUserInfo.detail.userInfo;
        }
        return token.promoterMoney2(app, that.data.money, 2);
      }).then(function (res) {
        
        wx.showToast({
          title: '提现成功',
          duration: 1500,
        });
        app.globalData.tempres = res;
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/capital/cashwait?type=1&&withdrawType=2',
          })
        }, 2000)
      }).catch(function (res) {
        if (res!=null && res.data != null && res.data.errmsg != null) {
          if(res.data.errmsg.indexOf('未授权') > -1){
            if(that.data.auth_count >= 1){
              that.data.auth_count = 0
              return;
            }
            app.globalData.authType = 2;
            that.data.auth_count += 1
            wxAuthorize.getWechatAuth(app).then((ret)=>{
              that.wechatMoney(resUserInfo)
            }).catch((err)=>{
                wx.showModal({
                    title: '错误提示',
                    content: '授权失败,请重新登录',
                    showCancel: false
                })
            })
          }else{
            let code = that.parseErrcode(res.data.errmsg)
            if (code == "N8011" || code == "N8012" || code == "N8013") {
              that.setData({
                systemBusy: true,
                disabled: fasle,
              })
              if (code == "N8011") {
                setTimeout(() => { that.checkWithdrawStatus() }, 10 * 60 * 1000);
                that.setData({
                  errNotice: res.data.errmsg
                })
                console.log("定时器启动1...")
              } else {
                that.setData({
                  errNotice: that.parseErrmsg(res.data.errmsg)
                })
              }
            } else if (code == "N8019" || code == "N9061" || code == "N9063" || code == "N9075" || code == "N9076") {
              token.refreshPage(res, that);
            } else {
              let errmsg = that.parseErrmsg(res.data.errmsg);
              if (errmsg.indexOf("Token已失效") > -1) {
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
                  title: '错误提示',
                  content: errmsg,
                  showCancel: false,
                  success: function (res) {
                     if(errmsg=="微信提现次数超过限制或提现总金额超过限制，请绑定身份证信息后再试!"){
                        wx.redirectTo({
                           url: '/pages/edit/idCard',
                        })
                     }
                  }
                })
              }   
            }
          }
        } else {
          // wx.showModal({
          //   title: '错误提示',
          //   content: '与服务器连接超时',
          //   showCancel: false
          // })
        };
        that.setData({
          wechatbool: true,
          disabled: fasle,
        })
      })
    }
  },
  /**
   * 银行卡
   */
  bankMoney: function () {
    var that = this;
    that.setData({
      bankbool: false,
    })
    var minWithdrawAmount = app.globalData.minWithdrawAmount;
    var miniBankWithdrawAmount = app.globalData.miniBankWithdrawAmount;
    var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    if (that.data.bankMoney == null) {
      wx.showModal({
        title: '错误提示',
        content: '金额不能为空',
        showCancel: false
      });
      that.setData({
        bankbool: true,
      })
    } else if (!exp.test(that.data.bankMoney)) {
      wx.showModal({
        title: '错误提示',
        content: '金额不正确，请输入正确的金额',
        showCancel: false
      });
      that.setData({
        bankbool: true,
      })
    } else if (that.data.bankMoney <= 0) {
      wx.showModal({
        title: '错误提示',
        content: '金额不能小于0',
        showCancel: false
      });
      that.setData({
        bankbool: true,
      })
    // } else if (that.data.bankMoney < minWithdrawAmount) {
    //   var msg = '金额不能低于最小额度' + minWithdrawAmount + '元';
    //   wx.showModal({
    //     title: '错误提示',
    //     content: msg,
    //     showCancel: false
    //   });
    //   that.setData({
    //     bankbool: true,
    //   })
    } else {
      var p = token.refresh(app);
      p.then(function (res) {
        return token.promoterMoney(app, that.data.user.userId, that.data.user.bankCardNumber, that.data.bankMoney, 3, 2);
      }).then(function (res) {
        wx.showToast({
          title: '提现成功',
          duration: 1500,
        });
        app.globalData.tempres = res;
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/capital/cashwait?type=2&&withdrawType=2',
          })
        }, 2000)
      }).catch(function (res) {
       
        if (res!=null && res.data!=null && res.data.errmsg != null) {
          token.refreshPage(res, that);
        } else {
          // wx.showModal({
          //   title: '错误提示',
          //   content: '与服务器连接超时',
          //   showCancel: false
          // })
        };
        that.setData({
          bankbool: true,
        })
      })
    }
  },
  /**
   * 全部余额
   */
  getAllMoney: function () {
    var that = this;
    var allMoney = parseFloat(that.data.capital);
    if (that.data.tradingType == 6) {
      that.setData({
        money: allMoney
      });
      var money = parseFloat(that.data.money);
      var fee = parseFloat(that.data.fee);
      that.setData({
        feemoney: Math.round(money * fee) / 100,
      });
    } else {
      that.setData({
        bankMoney: allMoney
      })
    };
  },
})