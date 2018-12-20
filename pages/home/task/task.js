// pages/home/task/task.js
const app = getApp(); 
const util = require('../../../utils/timer3.js');
const utils = require("../../../utils/util.js");
const page = require("../../../utils/page.js");
const token = require("../../../utils/token.js");
const constants = require('../../../utils/constants.js');
const utilsPara = require('../../../utils/uiparams.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskTab:0,
    taskDayNum : 1,
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab:0,  
    src: '../icon/img_shangpin.png',
    src1: '../icon/icon_dingdanbucunzai.png',
    src2: '../icon/img_sanjiao.png',
    height:1200,
    tasks:[{
      id:'J00987',
    }, {}, {}, {}, {}, {}, {}],
    cartNum1:0,
    cartNum2:0,
    cartNum3:0,
    cartNum4:0,
    cartNum5:0,
    searchLoadingComplete5:true,
    //如果没有数据则显示提示没有相关订单，为true,否则隐藏为false
    notResultsFlag_operate:false,
    notResultsFlag_audit:false,
    notResultsFlag_fini:false,
    notResultsFlag_commen:false,
    notResultsFlag_fail:false,
      backgroundUrl:'',
      sevenDays2:false,
      sevenDays3:false,
  },

  //判断跳转
  directToFunc: function () {
    var users = app.globalData.user;
    if (users != null && users.identity != null && users.identity == 2) {
      if (users.status == 2) {
          wx.reLaunch({
            url: '/pages/home/deny/deny',
         }) 
        }else if (users.bindStatus == 5) {
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
    }else{
      console.log("users为null是否会回到登录页面")
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.directToFunc();
    // util.settimer(24*60*60,that);
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
        });
      }
    });
    if (app.globalData.currentFlag) {
      console.log(app.globalData.currentFlag)
      that.setData({
        currentTab: 3
      })
    } else {
      that.setData({
        currentTab: 0
      })
    }
    that.setData({
      index: 1,
      size: 5,
      index2:1,
      index3: 1,
      index4: 1,
      index5: 1,
      bools1: false,
      bools2: false,
      bools3: false,
      bools4: false,
      bools5: false,
      bools11: false,
      bools22: false,
      bools33: false,
      bools44: false,
      bools55: false,  
    });
    //
    var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
    var params = utilsPara.getUiParam(mydata);
    if (params) {
      this.setData({
        home_menu_data: params,
      })
      var title = params.menu_001;
      wx.setNavigationBarTitle({
        title: title,
      });
    }
    // that.loadTaskCount();
    // that.loadTaskData(that.data.taskTab);
  },

loadTaskDayNum:function(){
  var that = this;
  var p = page.getFrameProp(app, 'promoter.show_task_day');
  p.then(function(data){
    if(data.success && data.content != null){
      that.setData({
        taskDayNum: data.content
      })
    }else{
      that.setData({
        taskDayNum: 1
      })
    }
  });
},


loadTaskCount :function(){
  var that = this;
  that.setData({
      cartNum2: 0,
      cartNum4: 0
  });
  var p = page.getOrderCount(app, '2,4');
  p.then(function (data) {
    if (data.success && data.content) {
      var map = data.content;
      var nub1 = 0;
      var nub2 = 0;
      for (var key in map) {
        if (key == 2) {
          nub1 = map[key]

        } else if (key == 4) {
          nub2 = map[key]
        }
      }
      that.setData({
        cartNum2: nub1,
        cartNum4: nub2
      });
    }
  });
},
    //任务切换
    swichTab: function (e) {
        var that = this;
        if (that.data.taskTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                taskTab: e.target.dataset.current                
            })
          that.setData({
            currentTab: 0
          })
          that.loadTaskData(that.data.taskTab);
        };
    },
  //加载数据
  loadTaskData: function (taskTab) {    
    let that = this;
    that.setData({
      index: 1,
      index2: 1,
      index3: 1,
      index4: 1,
      index5: 1
    })
    that.setData({
      tasklist:[]
    })
    if(taskTab == 0) {
      that.loadTaskCount();
      if (that.data.currentTab == 0) {
        that.setData({
          tasklist: []
        });
        that.searchOne();
      } else if (that.data.currentTab == 1) {
        that.setData({
          tasklist2: []
        });
        that.searchTwo();
      } else if (that.data.currentTab == 2) {
        that.setData({
          tasklist3: []
        });
        that.searchThree();
      } else if (that.data.currentTab == 4) {
        that.setData({
          tasklist5: []
        });
        that.searchFive();
      } else if (that.data.currentTab == 3) {
        that.setData({
          tasklist4: []
        });
        that.searchFour();
      }
    } else if(taskTab == 1) {
      that.setData({
        tasklist: [],
        tasklist2: [],
        tasklist3: [],
        tasklist5: []
      });
      that.loadFlowTaskCount();
      that.loadFlowTaskList(that.data.currentTab);
    }
  },

  loadFlowTaskList: function (currentTab) {
    let that = this;
    let status = null;
    let index = 0;
    switch (currentTab) {
      case 0: status = 2; index = that.data.index;  break;
      case 1: status = 3; index = that.data.index2; break;
      case 2: status = 4; index = that.data.index3;
        that.setData({
          sevenDays2: false
        });
       break;
      case 4: status = 5; index = that.data.index5; 
        that.setData({
          sevenDays3: false
        });
      break;
    }
    that.setData({
      notResultsFlag_commen: false
    })
    let p = token.queryFlowTaskList(app, status, index, that.data.size);
    p.then(function (data) {
      that.setData({
        bools1: false,
        bools2: false,
        bools3: false,
        bools4: false,
        bools5: false,
      });
      //判断是否有数据，有则取数据  
      if (data.content.records.length != 0) {
        let searchList = [];
        switch (currentTab) {
          case 0: status = 2; 
          // that.setData({
          //   tasklist: []
          // });
          searchList = that.data.tasklist;
          break;
          case 1: status = 3; 
          // that.setData({
          //   tasklist2: []
          // });
          searchList = that.data.tasklist2;
          break;
          case 2: status = 4; 
          // that.setData({
          //   tasklist3: []
          // });
          searchList = that.data.tasklist3;
          break;
          case 4: status = 5;
          // that.setData({
          //   tasklist5: []
          // });
          searchList = that.data.tasklist5;
          break;
        }


        // let searchList = that.data.tasklist;
        var tasklist = data.content.records;
        if (tasklist.length < 5) {
          that.setData({
            searchLoadingComplete1: true, //把“没有数据”设为true，显示
            searchLoadingComplete2: true,
            searchLoadingComplete3: true,
            searchLoadingComplete4: true,
            searchLoadingComplete5: true,
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          })
        } else {
          that.setData({
            searchLoading: true   //把"上拉加载"的变量设为true  
          })
        }
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        // searchList == null ? searchList = tasklist : searchList = that.data.tasklist.concat(tasklist)
        switch (currentTab) {
          case 0: searchList == null ? searchList = tasklist : searchList = that.data.tasklist.concat(tasklist)
          that.setData({
              tasklist: searchList,
              index: that.data.index + 1,
              height: searchList.length * 480 + 70,
              height1: searchList.length * 480 + 70,
              notResultsFlag_operate: false
            });
             break;
          case 1: 
            searchList == null ? searchList = tasklist : searchList = that.data.tasklist2.concat(tasklist)
          that.setData({ 
            tasklist2: searchList,
            index2: that.data.index2 + 1,
            height: searchList.length * 480 + 70,
            height2: searchList.length * 480 + 70,
            notResultsFlag_audit: false
            }); break;
          case 2:
            searchList == null ? searchList = tasklist : searchList = that.data.tasklist3.concat(tasklist)
          that.setData({
            tasklist3: searchList,
            index3: that.data.index3 + 1,
            height: searchList.length * 480 + 70,
            height3: searchList.length * 480 + 70,
            notResultsFlag_fini: false
             });
            if (data.content.records.length == data.content.total) {
              that.setData({
                sevenDays2: true
              })
            }
            ; break;
          case 4: 
          searchList == null ? searchList = tasklist : searchList = that.data.tasklist5.concat(tasklist)
          that.setData({
            tasklist5: searchList,
            index5: that.data.index5 + 1,
            height: searchList.length * 480 + 70,
            height5: searchList.length * 480 + 70,
            notResultsFlag_fail: false
            });
            if (data.content.records.length == data.content.total) {
              that.setData({
                sevenDays3: true
              })
            }
            ; break;
        }
        // app.globalData.usermessagesize = searchList.length
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        var flag = true;
        switch(currentTab) {
          case 0: if (that.data.tasklist != null && that.data.tasklist.length > 0) {
            flag = false;
          }
          break;
          case 1: if (that.data.tasklist2 != null && that.data.tasklist2.length > 0) {
            flag = false;
          }
          break;
          case 2: if (that.data.tasklist3 != null && that.data.tasklist3.length > 0) {
            flag = false;
          }
          break;
          case 4: if (that.data.tasklist5 != null && that.data.tasklist5.length > 0) {
            flag = false;
          }
          break;
        }

        that.setData({
          bools1: false,
          bools2: false,
          bools3: false,
          bools4: false,
          bools5: false,
          notResultsFlag_operate: flag,
          notResultsFlag_audit: flag,
          notResultsFlag_fini: flag,
          notResultsFlag_commen: flag,
          notResultsFlag_fail: flag,
          searchLoadingComplete1: true, //把“没有数据”设为true，显示  
          searchLoadingComplete2: true,
          searchLoadingComplete3: true,
          searchLoadingComplete4: true,
          searchLoadingComplete5: true,
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        });
      }
    }).catch(function (res) {
      if (res != null && res.data != null && res.data.errmsg != null) {
        token.refreshPage(res, that);
      }
      var flag = true;
      switch (currentTab) {
        case 0: if (that.data.tasklist != null && that.data.tasklist.length > 0) {
          flag = false;
        }
          break;
        case 1: if (that.data.tasklist2 != null && that.data.tasklist2.length > 0) {
          flag = false;
        }
          break;
        case 2: if (that.data.tasklist3 != null && that.data.tasklist3.length > 0) {
          flag = false;
        }
          break;
        case 4: if (that.data.tasklist5 != null && that.data.tasklist5.length > 0) {
          flag = false;
        }
          break;
      }
      that.setData({
        searchLoadingComplete1: true, //把“没有数据”设为true，显示
        searchLoadingComplete2: true,
        searchLoadingComplete3: true,
        searchLoadingComplete4: true,
        searchLoadingComplete5: true,
        searchLoading: false,  //把"上拉加载"的变量设为false，隐藏  
        notResultsFlag_operate: flag,
        notResultsFlag_audit: flag,
        notResultsFlag_fini: flag,
        notResultsFlag_commen: flag,
        notResultsFlag_fail: flag
      });
    });
  },
  /** 
    * 滑动切换tab 
    */
  bindChange: function (e) {
    // var that = this;
    // that.setData({ currentTab: e.detail.current });
    var that = this;
    that.setData({
      bools1: true,
      bools2: true,
      bools3: true,
      bools4: true,
      bools5: true,
      index: 1,
      size: 5,
      index2: 1,
      index3: 1,
      index4: 1,
      index5: 1,
      tasklist: null,
      tasklist2: null,
      tasklist3: null,
      tasklist4: null,
      tasklist5: null,
      height1: 70,
      height2: 70,
      height3: 70,
      height4: 70,
      height5: 70,
    });
    if (that.data.currentTab === e.detail.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.detail.current
      })
    };
    let taskTab = that.data.taskTab;
    if (that.data.currentTab == 0 && that.data.bools1) {
      if(taskTab == 0) {
        that.searchOne();
      } else if(taskTab == 1) {
        that.loadFlowTaskList(that.data.currentTab);
      } 
    } else if (that.data.currentTab == 1 && that.data.bools2) {
      if (taskTab == 0) {
        that.searchTwo();
      } else if (taskTab == 1) {
        that.loadFlowTaskList(that.data.currentTab);
      }      
    } else if (that.data.currentTab == 2 && that.data.bools3) {
      if (taskTab == 0) {
        that.searchThree();
      } else if (taskTab == 1) {
        that.loadFlowTaskList(that.data.currentTab);
      }      
    } else if (that.data.currentTab == 3 && that.data.bools4) {
      if (taskTab == 0) {
        that.searchFour();
      } else if (taskTab == 1) {
        // that.data.currentTab == 4
        that.setData ({
          currentTab: 4
        })
        //that.loadFlowTaskList(that.data.currentTab);
      }      
    } else if (that.data.currentTab == 4 && that.data.bools5){
      if (taskTab == 0) {

        that.searchFive();
      } else if (taskTab == 1) {
        that.loadFlowTaskList(that.data.currentTab);
      }  
    }
    // if (that.data.currentTab == 0 && that.data.bools1) {
    //   that.searchOne();
    // } else if (that.data.currentTab == 1 && that.data.bools2) {
    //   that.searchTwo();
    // } else if (that.data.currentTab == 2 && that.data.bools3) {
    //   that.searchThree();
    // } else if (that.data.currentTab == 3 && that.data.bools4) {
    //   that.searchFour();
    // } else {
    //   if (that.data.currentTab == 0) {
    //     that.setData({
    //       height: that.data.height1,
    //     })
    //   } else if (that.data.currentTab == 1) {
    //     that.setData({
    //       height: that.data.height2,
    //     })
    //   } else if (that.data.currentTab == 2) {
    //     that.setData({
    //       height: that.data.height3,
    //     })
    //   } else if (that.data.currentTab == 3) {
    //     that.setData({
    //       height: that.data.height4,
    //     })
    //   }
    // }
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    };
    if(that.data.taskTab == 0) {
      that.loadTaskCount();
    } else if( that.data.taskTab == 1) {
      that.loadFlowTaskCount();
    }
  },

  loadFlowTaskCount:function() {
    let that = this;
    that.setData({
      cartNum2: null,
      cartNum4: null
    });
    let status = [3];
    let p = token.getFlowTaskCount(app, status);
    p.then(function(data) {
      if (data.success && data.content) {
        var map = data.content;
        var nub1 = 0;
        var nub2 = 0;
        for (var key of status) {
          if (key == 3) {
            nub1 = map[key]
            // nub1 = 3
          } 
        }
        that.setData({
          cartNum2: nub1
        });
      }
    });
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // let that = this;
    // if(that.data.taskTab == 0) {
    //   that.loadTaskCount();
    // } else if(that.data.taskTab == 1) {
    //   that.loadFlowTaskCount();
    // }
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      taskTab: app.globalData.taskTab
    })
    that.loadTaskDayNum();
    //this.loadTaskCount();

    that.directToFunc();
    if(that.data.taskTab == 0) {
      that.loadTaskCount();
    } else if(that.data.taskTab == 1) {
      that.loadFlowTaskCount();
    }
    
    var p = token.refresh(app);
    p.then(function () {
    //   return token.getUserInfo(app);
    // }).then(function () {
    //   var users = app.globalData.user;
    //   if (users.identity == 2) {
    //     if (users.bindStatus == 5) {
    //       wx.redirectTo({
    //         url: '/pages/login/register2',
    //         // url: '/pages/login/taobao/Auditing/Auditing',
    //       })
    //     } else if (users.bindStatus == 0 || users.bindStatus == 3) {
    //       wx.redirectTo({
    //         url: '/pages/login/taobao/taobao',
    //       })
    //     } else if (users.bindStatus == 1 || users.bindStatus == 4) {
    //       wx.redirectTo({
    //         url: '/pages/login/taobao/Auditing/Auditing?time=' + users.bindTime,
    //       })
    //     } 
    //   }
    // })
    // .then(function(){
      return token.checkAppId(app);
    })
    .catch(function (res) {
       if (res!=null && res.data!=null && res.data.errmsg != null) {
         if (res.data.errmsg.indexOf('不同平台') != -1) {
           wx.reLaunch({
             url: '/pages/home/notice/notices',
           });
           return;
         } else if (res.data.errmsg.indexOf('未找到用户信息') != -1) {
           app.globalData.user = null;
           wx.reLaunch({
             url: '/pages/login/register2',
           });
        } else {
           token.refreshPage(res, that);
        }
      } else if (res!=null && res.data!=null && res.data.notes == '间隔刷新3') {
       //  wx.clearStorageSync();
       //  wx.reLaunch({
      //     url: '/pages/login/login',
      //   })
       console.log("清除缓存后跳转task")
      } 
    });
    let taskTab = that.data.taskTab;
    if (that.data.currentTab == 0) {
      if (taskTab == 0) {
        that.searchOne();
      } else if (taskTab == 1) {
        that.loadFlowTaskList(that.data.currentTab);
      } 
    } else if (that.data.currentTab == 1){      
      if (taskTab == 0) {
        that.searchTwo();
      } else if (taskTab == 1) {
        that.loadFlowTaskList(that.data.currentTab);
      } 
    } else if (that.data.currentTab == 2) {      
      if (taskTab == 0) {
        that.searchThree();
      } else if (taskTab == 1) {
        that.loadFlowTaskList(that.data.currentTab);
      } 
    } else if (that.data.currentTab == 3) {      
      if (taskTab == 0) {
        that.searchFour();
      } else if (taskTab == 1) {
        that.loadFlowTaskList(that.data.currentTab);
      } 
    }else if(that.data.currentTab == 4){     
      if (taskTab == 0) {
        that.searchFive();
      } else if (taskTab == 1) {
        that.loadFlowTaskList(that.data.currentTab);
      } 
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
    var that = this;
    that.setData({
      bools1: true,
      bools2: true,
      bools3: true,
      bools4: true,
      bools5: false,
      index: 1,
      size: 5,
      index2: 1,
      index3: 1,
      index4: 1,
      index5: 1,
      tasklist: null,
      tasklist2: null,
      tasklist3: null,
      tasklist4: null,
      tasklist5:null,
      height1: 70,
      height2: 70,
      height3: 70,
      height4: 70,
      height5: 70,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    that.setData({
      bools1: true,
      bools2: true,
      bools3: true,
      bools4: true,
      bools5: true,
      index: 1,
      size: 5,
      index2: 1,
      index3: 1,
      index4: 1,
      index5: 1,
      tasklist: null,
      tasklist2: null,
      tasklist3: null,
      tasklist4: null,
      tasklist5: null,
      height1: 70,
      height2: 70,
      height3: 70,
      height4: 70,
      height5: 70,
    })
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
    var that = this;
    console.log(that.data.currentTab)
    let taskTab = that.data.taskTab;
    if(that.data.currentTab == 0){
      if (taskTab == 0) {
        that.searchOne();
      } else if (taskTab == 1) {
        that.loadFlowTaskList(that.data.currentTab);
      } 
    } else if (that.data.currentTab == 1) {
      if (taskTab == 0) {
        that.searchTwo();
      } else if (taskTab == 1) {
        that.loadFlowTaskList(that.data.currentTab);
      } 
    } else if (that.data.currentTab == 2) {
      if (taskTab == 0) {
        that.searchThree();
      } else if (taskTab == 1) {
        that.loadFlowTaskList(that.data.currentTab);
      }       
    } else if (that.data.currentTab == 4) {
      if (taskTab == 0) {
        that.searchFive();
      } else if (taskTab == 1) {
        that.loadFlowTaskList(that.data.currentTab);
      }       
    }else if(that.data.currentTab == 3){
      if (taskTab == 0) {
        that.searchFour();
      } else if (taskTab == 1) {
        that.loadFlowTaskList(that.data.currentTab);
      }       
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  searchOne:function(){
    var that = this;
    var p = page.getOrder(app,1, that.data.index, that.data.size);
    p.then(function (data) {
      that.setData({
        bools1: false,
        bools2: false,
        bools3: false,
        bools4: false,
        bools5: false,
      });
      //判断是否有数据，有则取数据  
      if (data.content.records.length != 0) {
        let searchList = that.data.tasklist;
        var tasklist = data.content.records;
        if (tasklist.length < 5) {
          that.setData({
            searchLoadingComplete1: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          })
        } else {
          that.setData({
            searchLoading: true   //把"上拉加载"的变量设为true  
          })
        }
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        searchList == null ? searchList = tasklist : searchList = that.data.tasklist.concat(tasklist)
        that.setData({
          tasklist: searchList, //获取数据数组
          index: that.data.index+1,
          height: searchList.length * 480 + 70,
          height1: searchList.length * 480 + 70,
          notResultsFlag_operate:false
        });
        // app.globalData.usermessagesize = searchList.length
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        var flag = true;
        if (that.data.tasklist != null && that.data.tasklist.length > 0) {
          flag = false;
        }
        that.setData({
          bools1: false,
          bools2: false,
          bools3: false,
          bools4: false,
          bools5: false,
          notResultsFlag_operate: flag,
          searchLoadingComplete1: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        });
      }
    }).catch(function (res) {
      if (res !=null && res.data!=null && res.data.errmsg != null) {
        token.refreshPage(res,that);
      } 
      var flag = true;
      if (that.data.tasklist != null && that.data.tasklist.length > 0) {
        flag = false;
      }
      that.setData({
        searchLoadingComplete1: true, //把“没有数据”设为true，显示  
        searchLoading: false,  //把"上拉加载"的变量设为false，隐藏  
        notResultsFlag_operate: flag
      });
    });
  },
  searchTwo: function () {
    var that = this;
    var h1 = 0;
    var queryArray=[];
    var p = page.getOrder(app,2, that.data.index2, that.data.size);
    p.then(function (data) {
      //判断是否有数据，有则取数据  
      if (data.content.records.length != 0) {
        that.setData({
          bools1: false,
          bools2: false,
          bools3: false,
          bools4: false,
          bools5: false,
        })
        let searchList = that.data.tasklist2;
        var tasklist = data.content.records;
        if (tasklist.length < 5) {
          that.setData({
            searchLoadingComplete2: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          })
        } else {
          that.setData({
            searchLoading: true   //把"上拉加载"的变量设为true  
          })
        }
        for (var i = 0; i < tasklist.length; i++) {
          // tasklist[i].gmtTime = utils.formatTime5(new Date(tasklist[i].real_end_time + 86400000));
          // tasklist[i].gmtTime = utils.formatTime5(new Date(tasklist[i].real_end_time + 7200000));
          tasklist[i].gmtTime = utils.formatTime5(new Date(tasklist[i].real_end_time));
          queryArray.push(tasklist[i].id);
          
        }
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        searchList == null ? searchList = tasklist : searchList = that.data.tasklist.concat(tasklist)
        if (searchList != null) {
          for (var i = 0; i < searchList.length; i++) {
            if (searchList[i].shokey_status == 3) {
              h1++;
            }
          }
        }
       
        that.setData({
          tasklist2: searchList, //获取数据数组
          index2: that.data.index2 + 1,
          height: searchList.length * 480 + h1 * 60 + 70,
          height2: searchList.length * 480 + h1 * 60 + 70,
          notResultsFlag_audit: false,
        });
        // app.globalData.usermessagesize = searchList.length
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        var flag = true;
        if (that.data.tasklist2 != null && that.data.tasklist2.length > 0) {
          flag = false;
        }
        that.setData({
          bools1: false,
          bools2: false,
          bools3: false,
          bools4: false,
          bools5: false,
          notResultsFlag_audit: flag,
          searchLoadingComplete2: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        })
      }
      var p2 = page.getHurryOrder(app,queryArray);
      p2.then(function (data) {
        if (data.success){
          var hurryList = data.content;
          var concatArray=that.convertHurryArray(that.data.tasklist2, hurryList);
          that.setData({
            tasklist2: concatArray
          });
        }
      });
    }).catch(function (res) {
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        token.refreshPage(res, that);

      }
      var flag = true;
      if (that.data.tasklist2 != null && that.data.tasklist2.length > 0) {
        flag = false;
      }
      that.setData({
        searchLoadingComplete2: true, //把“没有数据”设为true，显示  
        searchLoading: false,  //把"上拉加载"的变量设为false，隐藏  
        notResultsFlag_audit: flag
      });
    });
  },
  searchThree: function () {
    var that = this;
    var h1 = 0;
    
    var p = page.getOrder(app, 3, that.data.index3, that.data.size);
    p.then(function (data) {
      //判断是否有数据，有则取数据  
      if (data.content.records.length != 0) {
        that.setData({
          bools1: false,
          bools2: false,
          bools3: false,
          bools4: false,
          bools5: false,
        })
          if(data.content.records.length == data.content.total){
              that.setData({
                  sevenDays2: true
              })
              console.log(1)
          }
        let searchList = that.data.tasklist3;
        var tasklist = data.content.records;
        
        if (tasklist.length < 5) {
          that.setData({
            searchLoadingComplete3: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          })
        } else {
          that.setData({
            searchLoading: true   //把"上拉加载"的变量设为true  
          })
        }
        for (var i = 0; i < tasklist.length; i++) {
          // tasklist[i].real_end_time = utils.formatTime(new Date(tasklist[i].real_end_time)); 
          tasklist[i].real_end_time = utils.formatTime(new Date(tasklist[i].shokey_audit_time)); 
        }
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        searchList == null ? searchList = tasklist : searchList = that.data.tasklist3.concat(tasklist)
        
        that.setData({
          tasklist3: searchList, //获取数据数组
          index3: that.data.index3 + 1,
          height: searchList.length * 480 + 70,
          height3: searchList.length * 480 + 70,
          notResultsFlag_fini: false,
        });
        // app.globalData.usermessagesize = searchList.real_end_time
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        var flag = true;
        if (that.data.tasklist3!=null&&that.data.tasklist3.length>0){
          flag = false;
        }
        that.setData({
          bools1: false,
          bools2: false,
          bools3: false,
          bools4: false,
          bools5: false,
          notResultsFlag_fini: flag,
          searchLoadingComplete3: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
        })
      }
    }).catch(function (res) {
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        token.refreshPage(res, that);
      } 
      var flag = true;
      if (that.data.tasklist3 != null && that.data.tasklist3.length > 0) {
        flag = false;
      }
      that.setData({
        searchLoading: false,  //把"上拉加载"的变量设为false，隐藏 
        notResultsFlag_fini: flag, 
      })
    });
    
  },
  searchFour: function () {
    var that = this;
    var h1 = 0;
    var p = page.getOrder(app, 4, that.data.index4, that.data.size);
    p.then(function (data) {
      //判断是否有数据，有则取数据  
      if (data.content.records.length != 0) {
        that.setData({
          bools1: false,
          bools2: false,
          bools3: false,
          bools4: false,
          bools5: false,
        })
        let searchList = that.data.tasklist4;
        var tasklist = data.content.records;
        if (tasklist.length < 5) {
          that.setData({
            searchLoadingComplete4: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          })
        } else {
          that.setData({
            searchLoading: true   //把"上拉加载"的变量设为true  
          })
        }
        // for (var i = 0; i < tasklist.length; i++) {
        //   tasklist[i].gmtTime = utils.formatTime(new Date(tasklist[i].real_start_time));
        // }
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        searchList == null ? searchList = tasklist : searchList = searchList.concat(tasklist)
        if (searchList != null) {
          for (var i = 0; i < searchList.length; i++) {
            if (searchList[i].shokey_status == 8) {
              h1++;
            }
          }
        }
        
        that.setData({
          tasklist4: searchList, //获取数据数组
          index4: that.data.index4 + 1,
          height: searchList.length * 480 + h1 * 60 + 70,
          height4: searchList.length * 480 + h1 * 60 + 70,
          notResultsFlag_commen: false,
        });
        // app.globalData.usermessagesize = searchList.length
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        var flag = true;
        if (that.data.tasklist4 != null && that.data.tasklist4.length > 0) {
          flag = false;
        }
        that.setData({
          bools1: false,
          bools2: false,
          bools3: false,
          bools4: false,
          bools5: false,
          notResultsFlag_commen: flag,
          searchLoadingComplete4: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
        })
      }
    }).catch(function (res) {
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        token.refreshPage(res, that);
      } 
      var flag = true;
      if (that.data.tasklist4 != null && that.data.tasklist4.length > 0) {
        flag = false;
      }
      that.setData({
        searchLoadingComplete4: true, //把“没有数据”设为true，显示  
        searchLoading: false,  //把"上拉加载"的变量设为false，隐藏  
        notResultsFlag_commen: flag
      });
    });
  },

  searchFive:function(){
    var that = this;
    var h1 = 0;
    var p = page.getOrder(app, 5, that.data.index5, that.data.size);
    p.then(function (data) {
      //判断是否有数据，有则取数据  
      if (data.content.records.length != 0) {
        that.setData({
          bools1: false,
          bools2: false,
          bools3: false,
          bools4: false,
          bools5: false,
        })
          if(data.content.records.length == data.content.total){
              that.setData({
                  sevenDays3: true
              })
          }
        let searchList = that.data.tasklist5;
        var tasklist = data.content.records;
        
        if (tasklist.length < 5) {
          that.setData({
            searchLoadingComplete5: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          })
        } else {
          that.setData({
            searchLoading: true   //把"上拉加载"的变量设为true  
          })
        }
        for (var i = 0; i < tasklist.length; i++) {
          tasklist[i].real_end_time = utils.formatTime(new Date(tasklist[i].real_end_time));
          tasklist[i].real_start_time = utils.formatTime(new Date(tasklist[i].real_start_time));
        }
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        searchList == null ? searchList = tasklist : searchList = that.data.tasklist5.concat(tasklist)
       
        that.setData({
          tasklist5: searchList, //获取数据数组
          index5: that.data.index5 + 1,
          height: searchList.length * 480 + 70,
          height5: searchList.length * 480 + 70,
          notResultsFlag_fail: false
        });
        // app.globalData.usermessagesize = searchList.real_end_time
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        var flag = true;
        if (that.data.tasklist5 != null && that.data.tasklist5.length > 0) {
          flag = false;
        }
        that.setData({
          bools1: false,
          bools2: false,
          bools3: false,
          bools4: false,
          bools5: false,
          notResultsFlag_fail: flag,
          searchLoadingComplete5: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        })
      }
    }).catch(function (res) {
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        token.refreshPage(res, that);

      } 
      var flag = true;
      if (that.data.tasklist5 != null && that.data.tasklist5.length > 0) {
        flag = false;
      }
      that.setData({
        searchLoading: false,
        notResultsFlag_fail: flag
      })
    });
   
  },

  setHurryOrder: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.index.id;
    var hurry = event.currentTarget.dataset.index.hurry;
    //console.log(id);
    if (hurry && (hurry==-1 || hurry==1)){
      console.log("====不用催单");
      return;
    }
    var p2 = page.setHurryOrder(app, id).then(function (res) {
      if (res.success) {
        that.searchTwo();
        wx.showToast({
          title: '催单成功',
          duration: 1500,
        });
      } else {
        token.refreshPage(res, that);
      }
    }).catch(res => {
      if (res != null && res.data != null && res.data.errmsg != null) {
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
            content: res.data.errmsg,
            showCancel: false
          })
        }
      }
    });
  },
  

  /**
   * 复制
   */
  copyCode: function (e) {
    var id = e.target.dataset.id;
    wx.setClipboardData({
      data: id,
    })
    wx.showToast({
      title: '复制成功',
    })
  },
  convertHurryArray:function(task,hurry){
    //hurry = ["1534687188394849"];
    if (hurry == undefined) {
      hurry = [];
    }
    if (task == undefined || task.length == 0){
      return task;
    }
    var convertArray=[];
    for (var j = 0; j < task.length; j++) {
      var tid = task[j].id;
      var temp = task[j];
      temp.hurry =-1;
      temp.hurryCss ="Reminders";
      for (var i = 0; i < hurry.length; i++) {
        if (tid == hurry[i].taskId){
          var remindStatus = hurry[i].remindStatus;
          temp.hurry = remindStatus;
          if (remindStatus==0){
            temp.hurryCss = "Reminders";
          }else{
            temp.hurryCss = "Reminders_disable";
          }
          break;
        }
      }
      convertArray.push(temp);
    }
    return convertArray;
  }
})