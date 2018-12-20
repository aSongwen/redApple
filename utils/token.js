var daytimer = require('./daytimer.js');
var constants = require('./constants.js');
//获取token
var getToken = function (app) {
  var that = this;
  var access_token = wx.getStorageSync('access_token');
  var refresh_token = wx.getStorageSync('refresh_token');
  var access_overtime = wx.getStorageSync('access_overtime');
  var local_access_overtime = wx.getStorageSync('local_access_overtime');
  var refresh_overtime = wx.getStorageSync('refresh_overtime');
  var local_refresh_overtime = wx.getStorageSync('local_refresh_overtime');
  var date = new Date().getTime();
  
  // if (access_token == null || access_token==""){
  //   access_token = app.globalData.access_token;
  // }
  
  if (access_token != '' && access_token != null && access_token.length > 0) {
    saveGpsDay(app);
    if (local_access_overtime != null && local_access_overtime != '' && date < local_access_overtime) {
      app.globalData.access_token = access_token;
      return 0;
    } else {
      if (local_refresh_overtime != null && local_refresh_overtime != '' && date < local_refresh_overtime) {
        if (refresh_token != null && refresh_token!=""){
          app.globalData.refresh_token = refresh_token;
        }
        // app.globalData.refresh_token = refresh_token;
        return 1;
      } else {
         console.log("access_token1111已经过期")
          wx.reLaunch({
              url: '/pages/login/login',
          });
        return 2;
      }
    }
  } else {
    wx.reLaunch({
      url: '/pages/login/login',
    });
  }
}
//获取token
var getToken2 = function (app) {
  var that = this;
  var access_token = wx.getStorageSync('access_token');
  var refresh_token = wx.getStorageSync('refresh_token');
  var access_overtime = wx.getStorageSync('access_overtime');
  var local_access_overtime = wx.getStorageSync('local_access_overtime');
  var refresh_overtime = wx.getStorageSync('refresh_overtime');
  var local_refresh_overtime = wx.getStorageSync('local_refresh_overtime');
  var date = new Date().getTime();
  if (access_token != null && access_token != '' && access_token.length > 0) {
    if (local_access_overtime != null && local_access_overtime != '' && date < local_access_overtime) {
      app.globalData.access_token = access_token;
      app.globalData.refresh_token = refresh_token;
      that.loopRefresh(app);
      return 0;
    } else {
      if (local_refresh_overtime != null && local_refresh_overtime != '' && date < local_refresh_overtime) {
        app.globalData.refresh_token = refresh_token;
        that.loopRefresh(app);
        return 1;
      } else {
         console.log("access_token2222已经过期")
          wx.reLaunch({
              url: '/pages/login/login',
          });
        return 2;
      }
    }
  }
}
//刷新token
var refreshToken = function (app) {
  
  var app_url = app.globalData.all_url.token_url;
  var refresh_token = app.globalData.refresh_token;
  var p = new Promise(function (resolve, reject) {
    if (refresh_token != null) {
      wx.request({
        url: app_url,
        // url: app_url + "?refresh_token=" + app.globalData.refresh_token,
        header: {
          "Content-Type": "application/json",
          // "refresh_token": app.globalData.refresh_token
        },
        data: {
          refreshToken: refresh_token
        },
        method: "POST",
        success: function (res) {
          
          if (res.data.success) {
            var content = res.data.content;
            app.globalData.access_token = content.access_token;
            wx.setStorageSync('access_token', content.access_token);
            wx.setStorageSync('refresh_token', content.refresh_token);
            wx.setStorageSync('access_overtime', content.access_overtime);
            wx.setStorageSync('refresh_overtime', content.refresh_overtime);
            var date = new Date().getTime();
            var local_access_overtime = date + 3000000;
            var local_refresh_overtime = date + 2592000000;
            wx.setStorageSync('local_access_overtime', local_access_overtime);
            wx.setStorageSync('local_refresh_overtime', local_refresh_overtime);
            resolve();
          } else {
            reject(res);
          }
          // app.globalData.access_token = res.data.content.access_token;
        },
        fail: function (res) {
          reject(res);
        }
      })
    }
  });
  return p;
}

//检查appId
var checkAppId = function(app){
  var p = new Promise(function (resolve, reject){
    wx.request({
      url: app.globalData.all_url.getAppId_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: { appId: constants.AppId_RedApple},
      method:'POST',
      success: function (res) {
        if(res.data.success){
          var appId = res.data.content;
          if (appId == null || (appId != null && appId != constants.AppId_RedApple)) {
            var res = {
              data:{
                errmsg:'不同平台'
              }
            }
            reject(res);
          }
          resolve(res);
        }else{
          reject(res);
        }
      },
      fail: function(res){
        reject(res);
      }
    })
  });
  return p;
}


var getUserInfo = function (app) {
  var that = this;
  var sys = wx.getSystemInfoSync();
  app.globalData.model = sys.model;
  var userinfo = app.globalData.userinfo;
  var headImage = null;
  if (userinfo != null){
     headImage = userinfo.avatarUrl;
  }
  if (app.globalData.access_token==null){
	    return;
  }
  var address = app.globalData.address;
  var model = sys.model;
  var app_url = app.globalData.all_url.user_url;

  return new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data:{
        deviceType: model,
        headImage: headImage,
        address: address,
      },
      method: "POST",
      success: function (res) {
        if (res.data.success) {
          app.globalData.user = res.data.content;
          setStorageExp('userInfo', res.data.content,24*60*60*1000);
          resolve(res);
          wx.setStorageSync("user", res.data.content);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })

}

var getConfig = function (app) {
  var that = this;
  var app_url = app.globalData.all_url.get_promoter_config_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        // userId: '173844557272772'
      },
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          var config = res.data.content;
          if (config != null) {
            app.globalData.config = config;
          }
          resolve();
        } else {
          app.globalData.config = null;
          reject(res);
        }
       
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}


var getFinance = function (app) {
  var that = this;
  var app_url = app.globalData.all_url.money_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          app.globalData.moneys = res.data.content;
          resolve();
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

//保留两位小数
var returnFloat = function (value) {
  var value = Math.round(parseFloat(value) * 100) / 100;
  var xsd = value.toString().split(".");
  if (xsd.length == 1) {
    value = value.toString() + ".00";
    return value;
  }
  if (xsd.length > 1) {
    if (xsd[1].length < 2) {
      value = value.toString() + "0";
    }
    return value;
  }
}

//获取最后生成的邀请码
var getLastCode = function (app) {
  var that = this;
  var app_url = app.globalData.all_url.promoter_last_code_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      // data: {
      //   userId: '173844557272772'
      // },
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          if (res.data.content != null) {
            app.globalData.code = res.data.content.code;
            if (res.data.content.file == null){
              app.globalData.qrcode = null;
            }else{
              app.globalData.qrcode = [res.data.content.file];
            }
          } else {
            app.globalData.code = null;
          }
          resolve();
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        app.globalData.code = null;
        reject(res);
      }
    })
  })
  return p;
}


var countCode = function (app) {
  var that = this;
  var app_url = app.globalData.all_url.promoter_code_count_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: function (res) {
       
        if (res.data.success) {
          app.globalData.codeCount = res.data.content.total;
          app.globalData.codeUsed = res.data.content.used;
          app.globalData.successUsed = res.data.content.successUsed;
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
  return p;
}


var promoterMoney = function (app, payee, payeeAccount, amount, tradingType, withdrawType) {
  var that = this;
  
  var app_url = app.globalData.all_url.promoter_withdraw_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        // payee: payee,
        // payeeAccount: payeeAccount,
        amount: amount,
        tradingType: tradingType,
        withdrawType: withdrawType,
      },
      method: "POST",
      success: function (res) {
        
        var msg = '';
        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
  return p;
}

var promoterMoney2 = function (app, money, type) {
  var that = this;
  var app_url = app.globalData.all_url.withdraw_wechat_url;
 
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        appid: constants.AppId_RedApple,
        money: money,
        type: type,
        nickName: app.globalData.userinfo.nickName,
        avatarUrl: app.globalData.userinfo.avatarUrl,
      },
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
  return p;
}

var withdrawWechatTask = function (app, money, type) {
  var that = this;
  var app_url = app.globalData.all_url.withdraw_wechat_task_url;

  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        appid: constants.AppId_RedApple,
        money: money,
        type: type,
      },
      method: "POST",
      success: function (res) {

        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
  return p;
}

var queryCode = function (app) {
  var that = this;
  var app_url = app.globalData.all_url.query_promoter_code_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        page: 1,
        pageSize: 20
      },
      method: "POST",
      success: function (res) {
        if (res.data.success) {
          if (res.data.content.records != null) {
            app.globalData.codeList = res.data.content.records;
          } else {
            app.globalData.codeList = [];
          }
          resolve();
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

var queryCode2 = function (app, index, pageSize) {
  var that = this;
  var app_url = app.globalData.all_url.query_promoter_code_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        page: index,
        pageSize: pageSize,
        used:false
      },
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

var getFeeWithdraw = function (app) {
  var that = this;
  var app_url = app.globalData.all_url.get_withdraw_fee_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          app.globalData.fee = res.data.content.fee;
          app.globalData.minWithdrawAmount = res.data.content.minWithdrawAmount;
          app.globalData.miniBankWithdrawAmount = res.data.content.miniBankWithdrawAmount;
          resolve();
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}
//间隔刷新
var refresh = function (app) {
  var token = this;
  var bool = token.getToken(app);
  var p = null;
  
  if (bool == 0) {
    p = new Promise(function (resolve, reject) {
      resolve();
    })
    return p;
  } else if (bool == 1) {
    p = new Promise(function (resolve, reject) {
      var pro = token.refreshToken(app);
      pro.then(function () {
        resolve();
      }).catch(function (res) {
        reject(res);
      })
    })
    return p;
  } else {
    p = new Promise(function (resolve, reject) {
      var res = {
        data: {
          notes: '间隔刷新3',
        }
      };
      reject(res);
    })
    return p;
  }
}

var getOcrIdCard = function (app, idCardImage, idCardType) {
  var app_url = app.globalData.all_url.get_ocr_id_card_url;
  var p = new Promise(function (resovle, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        idCardImage: idCardImage,
        idCardType: idCardType,
      },
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          resovle(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
  return p;
}


var saveIdCard = function (app, idCard, thats) {
  var that = this;
  var app_url = app.globalData.all_url.change_id_card_info_url;
  var p = new Promise(function (resovle, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: idCard,
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          resovle(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
  p.then(function () {
    return that.refresh(app);
  }).then(function (bool) {
    return that.getUserInfo(app);
  }).then(function () {
    // return that.getConfig(app);
  }).then(function () {
    // return that.getFinance(app);
  }).then(function () {
    // return that.getLastCode(app);
  }).then(function () {
    // return that.countCode(app);
  }).then(function () {
    // return that.queryCode(app);
  }).then(function () {
    // return that.getFeeWithdraw(app);
  }).then(function () {
    thats.setData({
      loading: false
    });
    wx.showToast({
      title: '设置成功',
      duration: 1500
    });
    thats.onShow();
    // wx.redirectTo({
    //   url: '/pages/home/personal/msgbinding',
    // })
  }).catch(function (res) {
    
    if (res != null && res.data!=null &&res.data.errmsg!=null) {
      if (res.data.errmsg.indexOf("Token已失效") == -1) {
        wx.showModal({
          title: '错误提示',
          content: res.data.errmsg,
          showCancel: false
        })
      }

    } 
    thats.setData({
      loading: false
    })
  })
}
var grabFlowTask = function(app) {
  var that = this;
  var app_url = app.globalData.all_url.grab_flow_task;
  var bool = that.getToken(app);

  if (bool == 0) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: function (res) {
        app.globalData.task = res;
        app.globalData.task.taskType = 1;
        app.globalData.isGrabTaskReturnResult = false;
        wx.setStorageSync("bool", 0);
        wx.setStorageSync("checkFlowLinkTime", "");
        wx.setStorageSync("flowLinkAddress", "");
        wx.setStorageSync("collectPicture", "");
        wx.setStorageSync("shoppingPicture", "");
        wx.setStorageSync("interestPicture", "");
        wx.setStorageSync("collectPictureId", "");
        wx.setStorageSync("shoppingPictureId", "");
        wx.setStorageSync("interestPictureId", "");
      },
      fail: function (res) {
        app.globalData.task = res;
        app.globalData.isGrabTaskReturnResult = false;
      }
    })
  } else if (bool == 1) {
    var p = that.refreshToken(app);
    p.then(function () {
      wx.request({
        url: app_url + '?access_token=' + app.globalData.access_token,
        header: {
          "Content-Type": "application/json",
        },
        method: "POST",
        success: function (res) {
          app.globalData.task = res;
          app.globalData.task.taskType = 1;
          app.globalData.isGrabTaskReturnResult = false;
          wx.setStorageSync("bool", 0);
          wx.setStorageSync("checkFlowLinkTime", "");
          wx.setStorageSync("flowLinkAddress", "");
          wx.setStorageSync("collectPicture", "");
          wx.setStorageSync("shoppingPicture", "");
          wx.setStorageSync("interestPicture", "");
          wx.setStorageSync("collectPictureId", "");
          wx.setStorageSync("shoppingPictureId", "");
          wx.setStorageSync("interestPictureId", "");
        },
        fail: function (res) {
          app.globalData.task = res;
          app.globalData.isGrabTaskReturnResult = false;
        }
      })
    })
  } else {
    console.log('未知错误')
  }
} 
var grabTask = function (app) {
  var that = this;
  var app_url = app.globalData.all_url.grab_task_url;
  var bool = that.getToken(app);
  
  if (bool == 0) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: function (res) {
        app.globalData.task = res;
        app.globalData.task.taskType = 0;
        app.globalData.isGrabTaskReturnResult = false;
        wx.setStorageSync("bool5", 0);
        wx.setStorageSync("checkLinkTime", "");
        wx.setStorageSync("linkAddress", "");
        
      },
      fail: function (res) {
        app.globalData.task = res;
        app.globalData.isGrabTaskReturnResult = false;
      }
    })
  } else if (bool == 1) {
    var p = that.refreshToken(app);
    p.then(function () {
      wx.request({
        url: app_url + '?access_token=' + app.globalData.access_token,
        header: {
          "Content-Type": "application/json",
        },
        method: "POST",
        success: function (res) {
          app.globalData.task = res;
          app.globalData.task.taskType = 0;
          app.globalData.isGrabTaskReturnResult = false;
          wx.setStorageSync("bool5", 0);
          wx.setStorageSync("checkLinkTime", "");
          wx.setStorageSync("linkAddress", "");
        },
        fail: function (res) {
          app.globalData.task = res;
          app.globalData.isGrabTaskReturnResult = false;
        }
      })
    })
  } else {
    console.log('未知错误')
  }
}

var searchSystemMessage = function (app, id) {
  var that = this;
  var app_url = app.globalData.all_url.get_system_message_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        systemMessageId: id
      },
      method: "POST",
      success: function (res) {
        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
  return p;
}
//查询用户消息详情
var searchUserMessage = function (app, id) {
  var that = this;
  var app_url = app.globalData.all_url.get_user_message_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        userMessageId: id
      },
      method: "POST",
      success: function (res) {
        if (res.data.success) {
          resolve(res);
        } else {
          res.data.notes = '查询用户消息详情';
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
  return p;
}

//循环刷新token
var loopRefresh = function (app) {
  var token = this;
  var init_time = app.globalData.init_time;
  // var int_time = 100
  var refresh_token = wx.getStorageSync('refresh_token');
  var app_url = app.globalData.all_url.token_url;
  setTimeout(function () {
    if (refresh_token != null) {
      wx.request({
        url: app_url,
        // url: app_url + "?refresh_token=" + app.globalData.refresh_token,
        header: {
          "Content-Type": "application/json",
          // "refresh_token": app.globalData.refresh_token
        },
        data: {
            refreshToken: refresh_token
        },
        method: "POST",
        success: function (res) {
          if (res.data.success) {
            app.globalData.init_time = 3600000;
            // app.globalData.init_time = 200;
            var content = res.data.content;
            app.globalData.access_token = content.access_token;
            wx.setStorageSync('access_token', content.access_token);
            wx.setStorageSync('refresh_token', content.refresh_token);
            wx.setStorageSync('access_overtime', content.access_overtime);
            wx.setStorageSync('refresh_overtime', content.refresh_overtime);
            var date = new Date().getTime();
            var local_access_overtime = date + 3000000;
            //  var local_access_overtime = date + 60000;
            var local_refresh_overtime = date + 2592000000;
            wx.setStorageSync('local_access_overtime', local_access_overtime);
            wx.setStorageSync('local_refresh_overtime', local_refresh_overtime);
            
            var p = token.getUserInfo(app);
            p.then(function () {
              // console.log('更新信息成功');
              var user = app.globalData.user;
              if(user.status == 2){
                wx.reLaunch({
                  url: '/pages/home/deny/deny',
                })
              }else{
                token.loopRefresh(app);
              }
            }).catch(function (res) {
              if (res != null && res.data!=null && res.data.errmsg!=null) {
                if (res.data.errmsg.indexOf("未找到用户信息") == -1) {
                  if (res.data.errmsg.indexOf("Token已失效") == -1) {
                    wx.showModal({
                      title: '错误提示',
                      content: res.data.errmsg,
                      showCancel: false
                    })
                  }
                }
              } 
              token.loopRefresh(app);
            })
          } else {
            app.globalData.init_time = 1000;
            token.loopRefresh(app);
          }
        },
        fail: function (res) {
          app.globalData.init_time = 1000;
          token.loopRefresh(app);
        }
      });
    }
  }, init_time);
}


var findRecommends = function (app, index, size, bool,keyword) {
  var that = this;
  var app_url = app.globalData.all_url.my_recommends_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        success: bool,
        page: index,
        pageSize: size,
        keyword:keyword
      },
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}
//删除用户
var delRecommends = function (app, id) {
  var that = this;
  var app_url = app.globalData.all_url.delete_my_recommends_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        promoterId: id,
      },
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

var pushOrder = function (app, tkl, orderNo) {
  var that = this;
  var app_url = app.globalData.all_url.pushOrder_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        taoTokenId: tkl,
        orderNo: orderNo,
      },
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          resolve(res);
        } else {
          res.data.notes = '提交淘宝订单号绑定淘宝账号';
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

var getTaoKL = function (app) {
  var that = this;
  var app_url = app.globalData.all_url.get_tao_token_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

var getTaskDetail = function (app, id) {
  var that = this;
  var app_url = app.globalData.all_url.get_task_detail_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        executeTaskId: id
      },
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          resolve(res);
        } else {
          res.data.notes = '查询任务详情';
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

var pushOrder2 = function (app, id, status, usedAmount, failReason, auditReviewImages) {
  var that = this;
  
  if (failReason == null && auditReviewImages == null) {
    if (usedAmount == null) {
      var app_url = app.globalData.all_url.pushOrder2_url;
      var p = new Promise(function (resolve, reject) {
        wx.request({
          url: app_url + '?access_token=' + app.globalData.access_token,
          header: {
            "Content-Type": "application/json",
          },
          data: {
            executeTaskId: id,
            status: status,
          },
          method: "POST",
          success: function (res) {
            
            if (res.data.success) {
              resolve(res);
            } else {
              res.data.notes = '提交任务';
              reject(res);
            }
          },
          fail: function (res) {
            reject(res);
          }
        })
      })
      return p;
    } else {
      var app_url = app.globalData.all_url.pushOrder2_url;
      var p = new Promise(function (resolve, reject) {
        wx.request({
          url: app_url + '?access_token=' + app.globalData.access_token,
          header: {
            "Content-Type": "application/json",
          },
          data: {
            executeTaskId: id,
            status: status,
            usedAmount: usedAmount,
          },
          method: "POST",
          success: function (res) {
            
            if (res.data.success) {
              resolve(res);
            } else {
              res.data.notes = '提交任务';
              reject(res);
            }
          },
          fail: function (res) {
            reject(res);
          }
        })
      })
      return p;
    }
  } else if (auditReviewImages != null) {
    
    var app_url = app.globalData.all_url.pushOrder2_url;
    var p = new Promise(function (resolve, reject) {
      wx.request({
        url: app_url + '?access_token=' + app.globalData.access_token,
        header: {
          "Content-Type": "application/json",
        },
        data: {
          executeTaskId: id,
          status: status,
          auditReviewImages: auditReviewImages,
        },
        method: "POST",
        success: function (res) {
          
          if (res.data.success) {
            resolve(res);
          } else {
            res.data.notes = '提交任务';
            reject(res);
          }
        },
        fail: function (res) {
          reject(res);
        }
      })
    })
    return p;
  } else {
    var app_url = app.globalData.all_url.pushOrder2_url;
    var p = new Promise(function (resolve, reject) {
      wx.request({
        url: app_url + '?access_token=' + app.globalData.access_token,
        header: {
          "Content-Type": "application/json",
        },
        data: {
          executeTaskId: id,
          status: status,
          failReason: failReason,
        },
        method: "POST",
        success: function (res) {
          
          if (res.data.success) {
            resolve(res);
          } else {
            res.data.notes = '提交任务';
            reject(res);
          }
        },
        fail: function (res) {
          reject(res);
        }
      })
    })
    return p;
  }
}
/**
 * 上传文件
 */
var upload_file = function (app, filePath) {
  var that = this;
  var app_url = app.globalData.all_url.upload_file_url;

  var p = new Promise(function (resolve, reject) {
    wx.showLoading({
      title: "上传中...",
      mask: true
    })
    wx.uploadFile({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "multipart/form-data",
      },
      filePath: filePath,
      name: 'file',
      method: "POST",
      success: function (res) {
        wx.hideLoading();
        let isSuccess = false;
        if (res.data && res.data != '') {
          var data = JSON.parse(res.data);
          res.data = data;
          isSuccess = res.data.success
        }
        //上传成功
        if(isSuccess) {
          resolve(res);
        } else {
          wx.showToast({
            title: '上传失败',
            icon:'none'
          })
          res.data.notes = '上传文件';
          reject(res);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
        res.data.notes = '上传文件';
        reject(res);
      },
      // complete:function(res) {
      //     wx.hideLoading();
      // }
    })
  })
  return p;
}

/*
var checkAuth = function (app) {
  var p = new Promise(function (resolve, reject) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success: function (res) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  app.globalData.userinfo = res.userInfo;
                  app.globalData.data = res.encryptedData;
                  app.globalData.iv = res.iv;
                  var t = setInterval(function () {
                    if (app.globalData.data != null && app.globalData.iv != null) {
                      clearInterval(t);
                      resolve();
                    }
                  }, 1000)
                }
              })
            },
            fail: function (res) {
              // 打开设置页面  
              wx.openSetting({
                success: function (res) {
                  if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                      success: res => {
                        
                        app.globalData.userinfo = res.userInfo;
                        app.globalData.data = res.encryptedData;
                        app.globalData.iv = res.iv;
                      }
                    });
                    var t = setInterval(function () {
                      if (app.globalData.data != null && app.globalData.iv != null) {
                        clearInterval(t);
                        resolve();
                      }
                    }, 1000)
                  } else {
                    var res = {
                      data: {
                        errmsg: '您已拒绝授权，如果要授权，可以通过小程序右上角-关于-右上角-设置,进入授权页面进行授权',
                        notes: '授权管理'
                      }
                    }
                    wx.showModal({
                      title: '错误提示',
                      content: res.data.errmsg,
                      showCancel: false,
                    });
                    reject(res);
                  }
                },
                fail: function (res) {
                  var res = {
                    data: {
                      errmsg: '连接超时',
                      notes: '授权管理'
                    }
                  }
                  reject(res);
                },
              });
            }
          });
        } else {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              
              app.globalData.userinfo = res.userInfo;
              app.globalData.data = res.encryptedData;
              app.globalData.iv = res.iv;
            }
          });
          var t = setInterval(function () {
            if (app.globalData.data != null && app.globalData.iv != null) {
              clearInterval(t);
              resolve();
            }
          }, 1000)
        }
      },
      fail: function (res) {
        var res = {
          data: {
            errmsg: '连接超时',
            notes: '授权管理'
          }
        }
        reject(res);
      }
    })
  });
  return p;
}*/
//核对订单
var checkOrder = function (app, executeTaskId, linkAddress) {
  var app_url = app.globalData.all_url.taobao_links_check_url;
  
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        executeTaskId: executeTaskId,
        linkAddress: linkAddress,
      },
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

var getRewardMoney = function (app) {
  var app_url = app.globalData.all_url.get_reward_money_url;
  
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

var countPromoterRewardMoney = function (app) {
  var app_url = app.globalData.all_url.count_promoter_reward_money;

  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: function (res) {

        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

var getTaskSuccessRate = function (app) {
  var app_url = app.globalData.all_url.get_task_success_rate_url;
  
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: function (res) {
        
        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}


var getTaskSuccessCount = function(app){
  var app_url = app.globalData.all_url.getOrders_count_url;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data:{
        shokeyStatus:3
      },
      method: "POST",
      success: function (res) {
        if (res!=null) {
          
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}


var CountExecuteTask = function(app,promoterId){
  var app_url = app.globalData.all_url.count_execute_task_url;
  
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: { promoterId: promoterId},
      method:'POST',
      success:function(res){
        if(res!=null){
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail:function(res){
        reject(res);
      }
    })
  });
  return p;
}
var CountExecuteTaskFlow = function (app, promoterId) {
  var app_url = app.globalData.all_url.count_execute_task_flow;

  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: { promoterId: promoterId },
      method: 'POST',
      success: function (res) {
        if (res != null) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
  return p;
}

var amapFile = require('../libs/amap-wx.js');
// var QQMapWX = require('../libs/qqmap-wx-jssdk.min.js');

var getLocation = function (app) {
    var that = this;
    var mapkey = constants.AMAP_KEY;
    var myAmapFun = new amapFile.AMapWX({ key: mapkey});
    var p = new Promise(function(resolve, reject){
      myAmapFun.getRegeo({
        success: function (data) {
          //成功回调
          var wxMarker = data[0];
          let address = wxMarker.regeocodeData.formatted_address;
          //接口地址可能会返回数组,所以地址都转为字符串
          if (address && typeof (address) != "string") {
            address = JSON.stringify(address);
          }
          app.globalData.address = address;
          app.globalData.latitude = wxMarker.latitude
          app.globalData.longitude = wxMarker.longitude
          resolve(data);
        },
        fail: function (info) {
          //失败回调
          reject(info)
        }
      })
    })
  return p;
}

var saveGpsDay = function (app) {
  //先获取本地信息确认今天是否已上传信息
  var gpsDay = wx.getStorageSync("gpsDay");
  var nowDay = daytimer.formatTime3(new Date().getTime(), 'yyyyMMdd');
   console.log("上报gps信息:" + (!gpsDay || gpsDay < nowDay) + ",gpsDay:" + gpsDay + ",nowDay:" + nowDay + ",gpsDay < nowDay:" + (gpsDay < nowDay));
  if (!gpsDay || gpsDay < nowDay) {
    // if (!daytimer.getCanReport()){
    //   return;
    // }
    getLocation(app).then(()=>{
      var app_url = app.globalData.all_url.save_gps_day_url;
      return new Promise(function (resolve, reject) {
        wx.request({
          url: app_url + '?access_token=' + app.globalData.access_token,
          header: {
            "Content-Type": "application/json",
          },
          data: {
            address: app.globalData.address,
            latitude: app.globalData.latitude,
            longitude: app.globalData.longitude
          },
          method: "POST",
          success: function (res) {
            if (res.data.success) {
              resolve();
            } else {
              reject(res);
            }
          },
          fail: function (res) {
            reject(res);
          }
        })
      }).then(() => {
        wx.setStorageSync("gpsDay", nowDay);
      })
    }).catch(function (res1) {
      if (res1 != null&&res1.data!=null && res1.data.errmsg!=null) {
        if (res1.data.errmsg.indexOf("Token已失效") == -1) {
          wx.showModal({
            title: '错误提示',
            content: res1.data.errmsg,
            showCancel: false
          })
        }
      }
    });
  }
}

var getLocationForce = function(app){
  var p = getLocation(app);
  return p;
}




/**
 * 获取推手信息
 */
var getPromoter = function (app, promoterId){
  return new Promise(function (resolve, reject) {
    var app_url = app.globalData.all_url.user_url;
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        promoterId: promoterId
      },
      method: "POST",
      success: function (res) {
        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
}

/**
 * 获取推手任务列表
 */
var getTaskList = function(app, data) {
  return new Promise(function (resolve, reject) {
    var app_url = app.globalData.all_url.query_task_url;
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: data,
      method: "POST",
      success: function (res) {
        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
}

/**
 * 统计页列表
 */
 var getCountreferee = function(app,data) {
  return new Promise(function (resolve, reject) {
    var app_url = app.globalData.all_url.count_referee_url;
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: data,
      method: "POST",
      success: function (res) {
        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
}
/**
 * 刷手预付金额只显示大概
 */
/*var getRoundFigure = function(res) {
  var task = res.data.content;
  var borrowPrice;
  var i = 100;
  var time = 0;
  while (i <= 100000 && time <= 1) {
    if (task.taskProp.listing.price < i) {
      time++;
      borrowPrice = i;
      break;
    } else {
      i = i + 100;
    }
  };
  task.taskProp.listing.borrowPrice = borrowPrice;
  return res;
}*/

/**
 *统计页面佣金笔数和金额
 */
 var getRefereeMoney = function(app,data) {
  return new Promise(function (resolve, reject) {
    var app_url = app.globalData.all_url.count_referee_money_url;
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: data,
      method: "POST",
      success: function (res) {
        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
}
/**
 *添加id水印
 */
var getBgmarkUrl = function (app) {
  if (app.globalData.user && app.globalData.user.userId) {
    let userId = app.globalData.user.userId;
    //水印图片失效时间
    let bgmarkDay = wx.getStorageSync("bgmarkDay" + userId);
    let bgmarkUrl = wx.getStorageSync('bgmarkUrl' + userId);
    let nowDay = new Date().getTime();
    //未失效使用缓存地址
    if (bgmarkDay && bgmarkUrl && bgmarkDay > nowDay) {
      return new Promise(function (resolve, reject) {
        resolve(bgmarkUrl);
      });
    }
    //超过有效时间请求后台
    return new Promise(function (resolve, reject) {
      var app_url = app.globalData.all_url.get_bgmark_url;
      wx.request({
        url: app_url + '?access_token=' + app.globalData.access_token,
        header: {
          "Content-Type": "application/json",
        },
        data: {
          "color": [215, 215, 215],  //字体颜色
          // "family": "宋体",   字体
          //"typeface": 0,    字体样式:0正常,1粗体
          "size": 24,      //字体大小,值越小,字体越大
          "density": 18,   //水印密度,值越大越密集
          //"rotate": -30,  字体旋转角度
          // "width": 900,   背景宽
          // "height": 1440,  背景高
          //"transparent": 1 透明度0.01~1
        },
        method: "POST",
        success: function (res) {
          if (res.data.success) {
            res.data.content.backgroupUrl = res.data.content.backgroupUrl.replace("http", "https");
            var url = res.data.content.backgroupUrl;
            //url中截取图片失效时间,如果没有默认30天失效
            let expires = 0;
            if (url.indexOf("Expires") > -1) {
              expires = url.substring(url.indexOf("Expires=") + 8);
              if (expires.length >= 10) {
                expires = parseInt(expires.substring(0, 10)) * 1000;
              }
            } else {
              expires = new Date().getTime() + 1000 * 60 * 60 * 24 * 30;
            }
            wx.setStorageSync('bgmarkDay' + userId, expires);
            wx.setStorageSync('bgmarkUrl' + userId, url);
            resolve(url);
          } else {
            reject(res);
          }
        },
        fail: function (res) {
          reject(res);
        }
      })
    });
  }
}
var refreshPage = function(res,that){
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
      title: '错误提示',
      content: res.data.errmsg,
      showCancel: false
    })
  }
}

/**
 *三码合一
 */
var promoterAauth = function(app,data, thats) {
    var that = this;
    var app_url = app.globalData.all_url.promoter_oauth;
    var p = new Promise(function (resovle, reject) {
        wx.request({
            url: app_url + '?access_token=' + app.globalData.access_token,
            header: {
                "Content-Type": "application/json",
            },
            data: data,
            method: "POST",
            success: function (res) {

                if (res.data.success) {
                    if(res.data.content.result==2){
                        wx.showModal({
                            title: '认证失败',
                            content: '请上传姓名一致的身份证和银行卡号，' +
                            '今日还有'+res.data.content.authNum+'次提交的机会',
                            showCancel:false,
                            success:function(res){
                                app.globalData.user.bankCardNumber=null
                                app.globalData.user.bankName=null
                                thats.setData({
                                    index:null,
                                    user: null,
                                    realName: null,
                                    idCardNumber: null,
                                    idCardAddress: null,
                                    gender: null,
                                    nation: null,
                                    birthday: null,
                                    authority: null,
                                    idCardStartTime: null,
                                    idCardEndTime: null,
                                    startTime: null,
                                    endTime: null,
                                    idCardImageFront: null,
                                    idCardImageBack: null,
                                    frontId: null,
                                    backId: null,
                                    frontStatus: 0,
                                    backStatus: 0,
                                    bankCardNum:'',
                                    bankName_old:'',
                                    bankName:'',
                                })
                            }
                        })
                        reject(res);
                    }
                    resovle(res);
                } else {
                    reject(res);
                }
            },
            fail: function (res) {
                reject(res);
            }
        })
    });
    p.then(function () {
        return that.refresh(app);
    }).then(function (bool) {
        return that.getUserInfo(app);
    }).then(function () {
        // return that.getConfig(app);
    }).then(function () {
        // return that.getFinance(app);
    }).then(function () {
        // return that.getLastCode(app);
    }).then(function () {
        // return that.countCode(app);
    }).then(function () {
        // return that.queryCode(app);
    }).then(function () {
        // return that.getFeeWithdraw(app);
    }).then(function () {
        thats.setData({
            loading: false,
            index:null
        });
        wx.showToast({
            title: '设置成功',
            duration: 1500
        });
        // wx.redirectTo({
        //     url: '/pages/home/personal/msgbinding',
        // })
        thats.onShow();
    }).catch(function (res) {

        if (res != null && res.data!=null &&res.data.errmsg!=null) {
            wx.showModal({
                title: '错误提示',
                content: res.data.errmsg,
                showCancel: false
            })
        }
        thats.setData({
            loading: false
        })
    })
}
/**
 * 设置有过期时间的本地缓存
 */
const setStorageExp = function (key, value, expire) {
  let obj = {
    data: value,
    time: Date.now(),
    expire: expire
  };
  wx.setStorage({
    key: key,
    data: JSON.stringify(obj),
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
}
/**
 * 获取有过期时间的本地缓存
 */
var getStorageExp = function(key) {
  return new Promise(function (resolve, reject) {
    var val = wx.getStorageSync(key);
    if (!val) {
      resolve(val);
    }
    
    val = JSON.parse(val);
    if (Date.now() - val.time > val.expire) {
      wx.removeStorageSync(key);
      resolve(null);
    } else {
      resolve(val.data);
    }
  })
}

var getStorageExpNew = function (key) {

    var val = wx.getStorageSync(key);
    if (!val) {
     return val;
    }

    val = JSON.parse(val);
    if (Date.now() - val.time > val.expire) {
      wx.removeStorageSync(key);
      return null
    } else {
      return val.data;
    }
}
//获取流量任务的详情
var getTaskFlowDetail = function(app,id){
  var that = this;
  var app_url = app.globalData.all_url.get_task_flow_detail;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        flowTaskId: id
      },
      method: "POST",
      success: function (res) {

        if (res.data.success) {
          resolve(res);
        } else {
          res.data.notes = '查询流量任务详情';
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

//提交流量任务
var pushFlowOrder = function (app, id, taobaolink, addImgId, collectImgId, attentionImgId){
  var that = this;
  var app_url = app.globalData.all_url.push_flow_order;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
         id: id,
         taobaolink: taobaolink,
         addImgId: addImgId,
         collectImgId: collectImgId,
         attentionImgId: attentionImgId
      },
      method: "POST",
      success: function (res) {
        if (res.data.success) {
          resolve(res);
        } else {
          res.data.notes = '提交流量任务';
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

/**
 *统计页面流量任务佣金笔数和金额
 */
var countFlowTaskData = function(app,data) {
    return new Promise(function (resolve, reject) {
        var app_url = app.globalData.all_url.countFlowTaskData;
        wx.request({
            url: app_url + '?access_token=' + app.globalData.access_token,
            header: {
                "Content-Type": "application/json",
            },
            data: data,
            method: "POST",
            success: function (res) {
                if (res.data.success) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            fail: function (res) {
                reject(res);
            }
        })
    });
}
/**
 * 统计页流量列表
 */
var countApprenticeFlowTask = function(app,data) {
    return new Promise(function (resolve, reject) {
        var app_url = app.globalData.all_url.countApprenticeFlowTask;
        wx.request({
            url: app_url + '?access_token=' + app.globalData.access_token,
            header: {
                "Content-Type": "application/json",
            },
            data: data,
            method: "POST",
            success: function (res) {
                if (res.data.success) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            fail: function (res) {
                reject(res);
            }
        })
    });
}

/**
 * 徒弟流量任务统计详情
 */
var flowQueryMini = function(app, data) {
    return new Promise(function (resolve, reject) {
        var app_url = app.globalData.all_url.flowQueryMini;
        wx.request({
            url: app_url + '?access_token=' + app.globalData.access_token,
            header: {
                "Content-Type": "application/json",
            },
            data: data,
            method: "POST",
            success: function (res) {
                if (res.data.success) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            fail: function (res) {
                reject(res);
            }
        })
    });
}

//核对流量任务淘口令
var checkFlowLinkAddress = function (app, flowTaskId, flowLinkAddress){
  var app_url = app.globalData.all_url.check_flow_linkAddress;

  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        id: flowTaskId,
        taobaolink: flowLinkAddress,
      },
      method: "POST",
      success: function (res) {

        if (res.data.success) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

//放弃流量任务
var cancelTask = function (app, id, failReason){
  var app_url = app.globalData.all_url.cancle_task_flow;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        id: id,
        failReason: failReason,
      },
      method: "POST",
      success: function (res) {

        if (res.data.success) {
          resolve(res);
        } else {
          res.data.notes = '放弃流量任务';
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

var queryFlowTaskList = function (app, status, pageNum, size) {
  var app_url = app.globalData.all_url.queryPromoterFlowTask;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        status: status,
        pageNum: pageNum,
        pageSize: size
      },
      method: "POST",
      success: function (res) {
        if (res.data.success) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

var getFlowTaskCount = function(app, status) {
  var app_url = app.globalData.all_url.getFlowTaskCount;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        status: status
      },
      method: "POST",
      success: function (res) {
        if (res.data.success) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

var todayCoin = function(app) {
  var app_url = app.globalData.all_url.get_promoter_today_coin;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      method: "POST",
      success: function (res) {
        if (res.data.success) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}
var totalCoin = function (app) {
  var app_url = app.globalData.all_url.get_promoter_total_coin;
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
        "queryType": "history"
      },
      method: "POST",
      success: function (res) {
        if (res.data.success) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}
module.exports = {
  getToken: getToken,
  getToken2: getToken2,
  getUserInfo: getUserInfo,
  getFinance: getFinance,
  returnFloat: returnFloat,
  getLastCode: getLastCode,
  countCode: countCode,
  promoterMoney: promoterMoney,
  getConfig: getConfig,
  queryCode: queryCode,
  refresh: refresh,
  getFeeWithdraw: getFeeWithdraw,
  refreshToken: refreshToken,
  saveIdCard: saveIdCard,
  getOcrIdCard: getOcrIdCard,
  grabTask: grabTask,
  searchSystemMessage: searchSystemMessage,
  searchUserMessage: searchUserMessage,
  loopRefresh: loopRefresh,
  findRecommends: findRecommends,
  queryCode2: queryCode2,
  delRecommends: delRecommends,
  pushOrder: pushOrder,
  getTaoKL: getTaoKL,
  getTaskDetail: getTaskDetail,
  pushOrder2: pushOrder2,
  upload_file: upload_file,
  //checkAuth: checkAuth,
  promoterMoney2: promoterMoney2,
  withdrawWechatTask: withdrawWechatTask,
  checkOrder: checkOrder,
  getRewardMoney: getRewardMoney,
  getTaskSuccessRate: getTaskSuccessRate,
  getTaskSuccessCount: getTaskSuccessCount,
  getLocation: getLocation,
  saveGpsDay: saveGpsDay,
  CountExecuteTask: CountExecuteTask,
  getLocationForce: getLocationForce,
  // resError: resError,
  checkAppId: checkAppId,
  getPromoter: getPromoter,
  getTaskList: getTaskList,
  getCountreferee:getCountreferee,
  getRefereeMoney:getRefereeMoney,
  getBgmarkUrl:getBgmarkUrl,
  countPromoterRewardMoney: countPromoterRewardMoney,
  promoterAauth: promoterAauth,
  setStorageExp: setStorageExp,
  getStorageExp: getStorageExp,
  getStorageExpNew: getStorageExpNew,
  refreshPage: refreshPage,
  getTaskFlowDetail: getTaskFlowDetail,
  pushFlowOrder: pushFlowOrder,
  countFlowTaskData: countFlowTaskData,
  countApprenticeFlowTask: countApprenticeFlowTask,
  flowQueryMini: flowQueryMini,
  checkFlowLinkAddress: checkFlowLinkAddress,
  cancelTask: cancelTask,
  grabFlowTask: grabFlowTask,
  queryFlowTaskList: queryFlowTaskList,
  getFlowTaskCount: getFlowTaskCount,
  CountExecuteTaskFlow: CountExecuteTaskFlow,
  todayCoin: todayCoin,
  totalCoin: totalCoin
}