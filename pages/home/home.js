var app = getApp();
const util = require('../../utils/timer2.js');
const util2 = require('../../utils/util.js');
const token = require('../../utils/token.js');
const page = require('../../utils/page.js');
const constants = require('../../utils/constants.js');
const utilsPara = require('../../utils/uiparams.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskTab:0,
    bannerStatus:1,
    WatermarkList:[],
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    taking: false,
    screen_width: '',
    last_time: '',
    imgUrls: [],
    imgUrl: [{
      link: '/pages/home/home',
      fileUrl: '/pages/home/icon/banner02.png'
    }, {
      link: '/pages/home/home',
      fileUrl: '/pages/home/icon/banner03.png'
    }],
    notics_text: [],
    indicatorDots: false,
    indicatorDots2: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marqueeDistance2: 0,
    size: 16,
    orientation: 'left',//滚动方向
    interval2: 20, // 时间间隔
    index: 0,
    time: '',
    money: null,
    plan:[
      { text: "今日", num: "0", num1:"0",look: "background:#23b6fc" },
      { text: "7天", num: "0", num1:"0",look: "background:#fcb43e"}, 
      { text: "30天", num: "0", num1:"0",look: "background:#36d3a8"}
    ],
    wx_headImage:'',
    home_menu_data:null,
    isProhibited:false,
    backgroundUrl:'',
    withdrawType:1,
    currentTab: "",
    todayCoin: null,
    totalCoin: null
  },

  //事件处理函数
  bindViewTap: function () {
    var that = this;
    if (that.data.notics_text != null && that.data.notics_text.length > 0) {
      wx.navigateTo({
        url: '../notice/notice'
      })
    }
  },

  
  getTaking: function (e) {
    var  that=this
    // if (this.data.isProhibited){
    //   return;
    // }
    // this.data.plan.forEach((item) =>{
    //   if(item.num == item.num1){
    //     that.setData({
    //       isProhibited:true
    //     })
    //   }
    // })
    
    that.directToFunc();
    // token.grabTask(app);
    that.grabTasking()
    var takingtime = setInterval(function () {
      // token.grabTask(app);
      that.grabTasking();
    }, 10000);
    
    that.setData({
      taking: true,
      takingtime: takingtime,
    })
    util.settimer(that)
    
  },
  grabTasking: function() {
    let that = this;
    let isReturnReslut = app.globalData.isGrabTaskReturnResult;
    if(isReturnReslut) {
      return;
    }
    app.globalData.isGrabTaskReturnResult = true;
    let taskType = that.data.taskTab;
    if (taskType == 0) {
      token.grabTask(app);
    } else if (taskType == 1) {
      token.grabFlowTask(app);
    }
  },
  
  stopTaking: function () {
    util.stopTimer(this);
    this.setData({
      taking: false
    })
    app.globalData.isGrabTaskReturnResult = false;
  },
  toTaking: function () {
    if (this.data.user != null) {
      wx.navigateTo({
        url: './taking/taking',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var width = app.globalData.screenWidth;
    console.log("1"+app.globalData.menu_data);
    that.setData({
      screen_width: app.globalData.screenWidth,
      withdrawType: app.globalData.withdrawType,
      marqueeDistance: width,
      marqueeDistance2: width,
      user: null,
    });
    wx.setNavigationBarTitle({
      title: constants.App_name,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  //首页任务切换
  swichTab: function (e) {
      var that = this;
      if (that.data.taskTab === e.target.dataset.current) {
          return false;
      } else {
          that.setData({
              taskTab: e.target.dataset.current
          })
        app.globalData.taskTab = that.data.taskTab;
        that.countPromoterTasks(that.data.taskTab);
        that.stopTaking();
      };
  },
  todayCoin: function() {
    let that = this;
    let todayCoinCache = token.getStorageExpNew('todayCoin');
    if (todayCoinCache != null && todayCoinCache != '') {
      that.setData({
        todayCoin: todayCoinCache
      });
    } else {
      let p = token.todayCoin(app);
      p.then(function (data) {
        if (data.success) {
          that.setData({
            todayCoin: data.content
          });
          //用户佣金保存十分钟
          token.setStorageExp('todayCoin', JSON.stringify(that.data.todayCoin), 10 * 60 * 1000);
        }
      });
    }
  },
  totalCoin: function() {
    let that = this;
    let totalCoinCache = token.getStorageExpNew('totalCoinCache');
    if (totalCoinCache != null && totalCoinCache != '') {
      that.setData({
        totalCoin: totalCoinCache
      })
    } else {
      let p1 = token.todayCoin(app);
      p1.then(function (data1) {
        if (data1.success) {
          let cacheVal = wx.getStorageSync('totalCoin');
          let totalCoin = 0;
          if (cacheVal != null && cacheVal.length > 0) {
            let totalCoinVal = JSON.parse(cacheVal);
            let date = totalCoinVal.date;
            let now = util2.formatTime3(new Date());
            //如果日期没变，使用缓存
            if (date == now) {
              totalCoin = totalCoinVal.totalCoin + data1.content;
              that.setData({
                totalCoin: totalCoin
              })
              token.setStorageExp('totalCoinCache', JSON.stringify(totalCoin), 10 * 60 * 1000);
            } else {
              let p2 = token.totalCoin(app);
              p2.then(function (data2) {
                if (data2.success) {
                  totalCoin = data1.content + data2.content;
                  that.setData({
                    totalCoin: totalCoin
                  });
                  let now2 = util2.formatTime3(new Date());
                  let data = {
                    date: now2,
                    totalCoin: data2.content
                  }
                  wx.setStorageSync('totalCoin', JSON.stringify(data));
                  token.setStorageExp('totalCoinCache', JSON.stringify(totalCoin), 10 * 60 * 1000);
                }
              })
            }
          } else {
            let p3 = token.totalCoin(app);
            p3.then(function (data3) {
              if (data3.success) {
                totalCoin = data1.content + data3.content;
                that.setData({
                  totalCoin: totalCoin
                });
                let now3 = util2.formatTime3(new Date());
                let data = {
                  date: now3,
                  totalCoin: data3.content
                }
                wx.setStorageSync('totalCoin', JSON.stringify(data));
                token.setStorageExp('totalCoinCache', JSON.stringify(totalCoin), 10 * 60 * 1000);
              }
            });
          }
          
        }
      })
    }
  },
  //首页任务统计
  countPromoterTasks: function(taskTab) {
    let that = this;
    if(taskTab == 0) {
      that.countTaskNum(app);
    } else if(taskTab == 1) {
      that.countFlowTaskNum(app);
    }
  },
//首页判断跳转
    directToFunc :function(userInfo){
    
    var users = null;
    if(userInfo != null) {
      users = userInfo;
    } else {
      users = app.globalData.user;
    }
    
    
    //if(users!=null&&users.identity!=null&&users.identity==2){
    if (users != null  && users.status == 2) {
        wx.reLaunch({
            url: '/pages/home/deny/deny',
        })
    }
    if (users != null && users.identity != null ) {

        if (users != null && users.identity != null && users.identity == 2) {
            if (users.bindStatus == 5) {
              console("home跳转注册页面11111")
                wx.redirectTo({
                    url: '/pages/login/register2',
                })
            } else if (users.bindStatus == 0 || users.bindStatus == 3) {
                wx.redirectTo({
                    url: '/pages/login/taobao/taobao',
                })
            } else if (users.bindStatus == 1 || users.bindStatus == 4) {
                wx.redirectTo({
                    url: '/pages/login/taobao/Auditing/Auditing?time=' + users.bindTime,
                })
            }
        }
    }
    token.setStorageExp('userInfo', users, 24*60*60*1000);
},
  //首页渲染请求数据
  loadData:function(){
    var that = this;
      token.refresh(app).then(() => {
        that.setData({
            loading: true
        })
      }).then(function() {
        return token.getStorageExp('userInfo').then(function(res3) {
          console.log(res3)
          let promoterInfo = res3;
          if (promoterInfo != null && promoterInfo != undefined && promoterInfo != "" && promoterInfo.bindStatus == 2) {
            that.directToFunc(promoterInfo);
            app.globalData.user = promoterInfo;
            var users = promoterInfo;

            if (users != null && users != '') {
              var img_url = wx.getStorageSync("wx_headImage_url");
              if (img_url == null || img_url == '') {
                img_url = users.headImage;
              }
              that.setData({
                user: users,
                wx_headImage: img_url
              })
            }
            //设置水印图片
            // token.getBgmarkUrl(app).then(function (res4) {
            //   that.setData({
            //     backgroundUrl: res4
            //   })
            // });
          } else {
            return token.getUserInfo(app)
              .then(function (res2) {
                app.globalData.user = res2.data.content;
                that.directToFunc(res2.data.content);
                var users = app.globalData.user;

                if (users != null && users != '') {
                  var img_url = wx.getStorageSync("wx_headImage_url");
                  if (img_url == null || img_url == '') {
                    img_url = users.headImage;
                  }
                  that.setData({
                    user: users,
                    wx_headImage: img_url
                  })
                }
                //设置水印图片
                // token.getBgmarkUrl(app).then(function (res1) {
                //   that.setData({
                //     backgroundUrl: res1
                //   })
                // });
              })
          }
        })
      })
    .then(function() {
      return token.getBgmarkUrl(app).then(function (res1) {
        that.setData({
          backgroundUrl: res1
        })
      });
    })
    .then(function(){
      that.queryUiparams();
    })
    .then(function () {
        //查询公告
        return page.getSearchMusic(app, 1, 4)
        .then(function (data) {
            that.setData({
                notics_text: data.content.records, //获取数据数组
            });
        })
    }).then(function () {
        //console.log('getFinance=============')
        that.countTaskNum(app);//
        return token.getFinance(app)
            .then(function () {
                var moneys = app.globalData.moneys;
                if (moneys != null && moneys != '') {
                    that.setData({
                        moneys: moneys,
                        money: {
                            commission: token.returnFloat(moneys.earnCoin),
                            capital: token.returnFloat(moneys.earnAmount)
                        }
                    });
                }
            })
    })
    .then(function(){
        return token.checkAppId(app)
            .then(() => {
                that.setData({
                    loading: false,
                })
                if (app.globalData.appId != null && app.globalData.appId != constants.AppId_RedApple) {
                    wx.reLaunch({
                        url: '/pages/home/deny/deny',
                    });
                    return;
                }
            })
    })
    .catch(function (res) {
        that.setData({
            loading: false,
        })
        if (res!=null && res.data!=null && res.data.errmsg != null) {
            if (res.data.errmsg.indexOf('不同平台')!=-1){
              wx.reLaunch({
                url: '/pages/home/notice/notices',
              });
              return;
            }else if (res.data.errmsg.indexOf('未找到用户信息') != -1) {
                that.setData({
                    user: null
                })
                app.globalData.user = null;
                console("home跳转注册页面2222")
                wx.reLaunch({
                    url: '/pages/login/register2',
                });
                return;
            } else if (res.data.errmsg.indexOf('无效的token') != -1) {
              token.refreshPage(res, that);
                that.setData({
                    user: null
                })
                app.globalData.user = null;
               // wx.reLaunch({
               //     url: '/pages/login/register2',
               // })
                return;
            }
            token.refreshPage(res, that);
        } else if (res!=null && res.data!=null && res.data.notes == '间隔刷新3') {
            that.setData({
                user: null
            })
            app.globalData.user = null;
        //   wx.clearStorageSync();
        //    wx.reLaunch({
       //         url: '/pages/login/login',
       //     })
            console.log("清除缓存后跳转home")
        }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: constants.App_name,
    });
    var sauthFlag = wx.getStorageSync('auth_' + constants.AppId_RedApple);
    // if (sauthFlag && sauthFlag == '0') {
    //     console.log("无权限跳转登录页面")
    //    wx.redirectTo({
    //       url: '/pages/login/login',
    //     });
    //     return;
    // }
    var that = this;
    that.loadData();
    that.getBannerFlag(app, this.data.bannerStatus)
    that.showAcceptTask();
    console.log("2" + app.globalData.menu_data);
  },

  //收到接单任务提醒
  showAcceptTask: function () {
    var user = token.getStorageExpNew("userInfo")
    var count = token.getStorageExpNew('currentTabCount' + user.code)
    var tab = token.getStorageExpNew('currentTab' + user.code);
    if (!tab) {
      console.log("进入缓存")
      var that = this;
      var p = page.getOrderCount(app, 4).then(function (res) {
        if (res.success) {
          for (var key in res.content) {
            if (key == 4) {
              token.setStorageExp('currentTabCount' + user.code, res.content[key]);
              token.setStorageExp('currentTab' + user.code, "count",1*60*60*1000);
              if (res.content[key] != count && res.content[key] > 0) {
                wx.setStorageSync("taskOrder", res.content[key])
                wx.showModal({
                  title: '邀请评价任务',
                  content: "商家邀请您参加评价任务!\r\n完成后将获得1.5元奖励哦!",
                  cancelText: "暂时没空",
                  confirmText: "马上参与",
                  success(res) {
                    app.globalData.currentFlag = true
                    if (res.confirm) {
                      wx.switchTab({
                        url: '/pages/home/task/task',
                        success: function (res) {
                        }
                      });
                    } else if (res.cancel) {
                    }
                  }
                })
              }
            }
          }
        }
      });
    }
  },

//
countTaskNum:function(app){
  var that = this;
  let promoterId = '';
  if(app.globalData.user!=null && app.globalData.user.userId!=null){
    promoterId = app.globalData.user.userId;
    that.getCountTask(app, promoterId);
  }
  
},
countFlowTaskNum: function(app) {
  var that = this;
  let promoterId = '';
  if (app.globalData.user != null && app.globalData.user.userId != null) {
    promoterId = app.globalData.user.userId;
    that.getCountTask(app, promoterId);
  }
},

getCountTask:function(app,promoterId){
  var that = this;
  let result = null;
  let taskTab = that.data.taskTab;
  if(taskTab == 0) {
    result = token.CountExecuteTask(app, promoterId);
  } else if(taskTab == 1) {
    result = token.CountExecuteTaskFlow(app, promoterId);
  }
  result.then(function (res) {
    if (res != null && res.data != null && res.data.content != null) {
      var content = res.data.content;
      var table = [];
      var pa1='';
      if (that.data.home_menu_data){
        pa1 = that.data.home_menu_data.home_0004;
      }
      var param_day = { text: '今日' + pa1, num: content.todayCount, num1: content.dayMaxBuys, look: "background:#23b6fc" };
      table.push(param_day);
      var param_week = { text: "7天" + pa1, num: content.weekCount, num1: content.weekMaxBuys, look: "background:#fcb43e" };
      table.push(param_week);
      var param_month = { text: "30天" + pa1, num: content.monthCount, num1: content.monthMaxBuys, look: "background:#36d3a8" };
      table.push(param_month);
      that.setData({
        plan: table
      });
    }
  });
},
getBannerFlag: function (app, status){
  var that = this;
  that.setData({
    imgUrls: []
  })
  var p = page.getBannerFlag(app).then(function (r) {
    if (r.success && r.content) {
      wx.getStorage({
        key: 'bannerImags',
        success: function(res) {
          if(res.data.length >0){
            that.setData({
              imgUrls: res.data
            })
          }else{
            that.getBannerCode(app, status);
          }
        },
        fail: function (res) {
          that.getBannerCode(app, status);
        }
      })
    } else {
      that.getBannerCode(app, status);
    }
  });
},

//获取banner
getBannerCode:function(app,status){
  var that=this;
  that.setData({
    imgUrls:[]
  })
  
  var p=page.getBannerCode(app,status).then(function(res){
    if(res.success){
      if(res.content.length == 0){
        that.setData({
          imgUrls:that.data.imgUrl
        })
        return;
      }
      res.content.forEach((item) =>{
        that.getBanner(app,item.imageUrl)
      })
    }
  })
},

getBanner:function(app,code){
  var that=this;
  var p=page.getBanner(app,code).then(function(res){
    if(res.success){
      var imgUrls=that.data.imgUrls
      var imglist=res.content
      imgUrls == null ? imgUrls = imglist : imgUrls = that.data.imgUrls.concat(imglist);
      that.setData({
        imgUrls:imgUrls
      })
      wx.setStorage({
        key: "bannerImags",
        data: that.data.imgUrls
      })
    }
  })
},


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.stopTaking();
    if (this.data.user != null) {
      var that = this;
      that.setData({
        time: '',
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
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
   * 登录
   */
  login: function () {
    console.log("点击登录跳转")
    wx.navigateTo({
      url: '../login/login',
    })
  },
  /**
   * 注册
   */
  register: function () {
    wx.navigateTo({
      url: '../login/register2',
    })
  },
  

  //下拉刷新
  onPullDownRefresh:function(){
    var _that = this;
    
    _that.loadData();
    // var p = token.getUserInfo(app);
    // p.then(function(){
    //   _that.loadData();
    // });
    wx.stopPullDownRefresh();//停止刷新
  },
  //查询uipara
  queryUiparams() {
    var that = this;
    var shop = wx.getStorageSync('myshope');
    if (shop == 'shop') {
      wx.redirectTo({
        url: '/pages/myshop',
      });
      return;
    }
    var uiparas = wx.getStorageSync('uiparas');
    console.log(app.globalData.menu_data);
    console.log(uiparas);
    wx.connectSocket({
      url: '',
      header: {},
      method: '',
      protocols: [],
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    if(uiparas){
      app.globalData.menu_data = uiparas;
      var mydata = { uiparas: uiparas, requi:'home_'};
      var params=utilsPara.getUiParam(mydata);
      console.log(params);
      that.setData({
        home_menu_data: params,
      })
      return;
    }
    wx.request({
      url: app.globalData.all_url.query_withdraw_endTime_url + '?access_token=' + app.globalData.access_token,
      method: 'POST',
      data: { code: '2' },
      header: {
        "Content-Type": "application/json",
      },
      success: (res) => {
        var data = res.data.content;
        if (res.data.success && data != null) {
          app.globalData.menu_data = data;
          wx.setStorageSync('uiparas', data['2']);
          var uiparas =data['2'];
          if (uiparas) {
            app.globalData.menu_data = uiparas;
            var mydata = { uiparas: uiparas, requi: 'home_' };
            var params = utilsPara.getUiParam(mydata);
            that.setData({
              home_menu_data: params,
            })
          }
        }
      },
      fail: (res) => {

      }
    })
  },

})