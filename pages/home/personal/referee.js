// pages/home/personal/referee.js
const app = getApp();
const utils = require("../../../utils/verify.js");
const token = require("../../../utils/token.js");
const daytimer = require("../../../utils/daytimer.js");
const util = require("../../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    warningtext:false,
    height: '',
    width: '',
    swiperH: 0,
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    roles: 0,
    src: './icon/center_img_erweima.png',
    src1: './icon/center_icon_yaoqinghaoyou.png',
    src2: '../icon/img_touxiang.png',
    imagelist: [],
    codeState:'',
    disabled:false,
    isClicked:false,
    recomment_url:'',
    isClicked:false,
    // isEdited:false,
    note:"",
    hasCode:0,
    codeCount:0,
    showModal3:false,
    index3:0,
    qrcode:'',
    ActivatedUser:null,
    inactivatedUser:null,
    currentMonth:null,
    preMonth:null,
    searchNote:null,   //搜索条件
    showModal4:false,
    showIcon:true,
    showBack:false,
    condition:null,   //搜索条件
      backgroundUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.checkSwiperH(0);
    this.setData({
      height: app.globalData.screenHeight,
      width: app.globalData.screenWidth,
      inviteCode: null,
    })
    // if (app.globalData.qrcode == null){
    //   this.setData({
    //     qrcode: null,
    //   })
    // }else{
    //   this.setData({
    //     qrcode: app.globalData.qrcode[0],
    //   })
    // }
    var that = this;
    that.setData({
      bools1: true,
      bools2: true,
      index: 1,
      size: 5,
      index2: 1,
      height:50,
      height1: 50,
      height2: 50,
      tasklist: null,
      tasklist2: null,
    })
    // token.getToken(app);
  },

  navigatorToStatistics:function(e){
    wx.navigateTo({
      url:e.currentTarget.dataset.url
    })
 },

  listenerButtonPreviewImage: function (e) {
    var current = e.target.dataset.src;
    var table = [];
    table.push(current);
    wx.previewImage({
      current: current,
      urls: table,
    })
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
      index: 1,
      index2: 1,
      tasklist: null,
      tasklist2: null,
    })
    if (this.data.currentTab === e.detail.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.detail.current
      })
    }
    if (that.data.currentTab == 0 && that.data.bools1) {
      that.setData({
        height: that.data.height1,
      })
      that.searchOne();
    } else if (that.data.currentTab == 1 && that.data.bools2) {
      that.setData({
        height: that.data.height2,
      })
      that.searchTwo();
    }
    //  else {
    //   if (that.data.currentTab == 0) {
    //     that.setData({
    //       height: that.data.height1,
    //     })
    //   } else if (that.data.currentTab == 1) {
    //     that.setData({
    //       height: that.data.height2,
    //     })
    //   }
    // }
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    that.setData({
        currentTab: e.target.dataset.current,
        bools1: true,
        bools2: true,
        index: 1,
        index2: 1,
        tasklist: null,
        tasklist2: null,
      })
    // if (that.data.currentTab === e.target.dataset.current) {
    //   return false;
    // } else {
    //   that.setData({
    //     currentTab: e.target.dataset.current
    //   })
    // }
    if (that.data.currentTab == 0 && that.data.bools1) {
      that.setData({
        height: that.data.height1,
      })
      that.searchOne();
    } else if (that.data.currentTab == 1 && that.data.bools2) {
      that.setData({
        height: that.data.height2,
      })
      that.searchTwo();
      console.log("yfhdshfdsgbfgf")
      console.log(that.data.height)
    }



    // var that = this;
    // if (this.data.currentTab === e.target.dataset.current) {
    //   return false;
    // } else {
    //   that.setData({
    //     currentTab: e.target.dataset.current
    //   })
    // }
    // if (that.data.currentTab == 0 && that.data.bools1) {
    //   that.searchOne();
    // } else if (that.data.currentTab == 1 && that.data.bools2) {
    //   that.searchTwo();
    // }
    // else {
    //   if (that.data.currentTab == 0) {
    //     that.setData({
    //       height: that.data.height1,
    //     })
    //   } else if (that.data.currentTab == 1) {
    //     that.setData({
    //       height: that.data.height2,
    //     })
    //   }
    // }
  },
  /**
   * 判断swiper的高
   */
  checkSwiperH: function (e) {
    var i = 0;
    var users = this.data.users;
    for (var index in users) {
      if (users[index].types == e) {
        i++;
      }
    }
    this.setData({
      swiperH: i * 200
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.searchTwo();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      currentMonth:new Date().getMonth() + 1,
      preMonth:new Date().getMonth() 
    })
    var that = this;
    var p = token.refresh(app);
    p.then(function () {
      return that.refreshUser();
    }).then(function () {
    return token.countPromoterRewardMoney(app);
    }).then(function (res) {
      that.setData({
        coin: res.data.content.totalCoin,
      })
    }).catch(function (res) {
      
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        token.refreshPage(res, that);

      } else {
        // wx.showModal({
        //   title: '错误提示',
        //   content: '与服务器连接超时',
        //   showCancel: false
        // })
      }
    });
    if (that.data.currentTab == 0) {
      that.searchOne();
    } else if (that.data.currentTab == 1) {
      that.searchTwo();
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
    var that = this;
    if (that.data.currentTab == 0) {
      that.searchOne();
    } else if (that.data.currentTab == 1) {
      that.searchTwo();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '内部定向邀请',
      desc: '使用我的内部定向邀请码，一起加入吧。',
      imageUrl: './icon/tuiguang.jpg',
      path: '/pages/login/register2?inviteCode=' + this.data.inviteCode
    }
  },

  /**
   * 弹窗
   */
  showDialogBtn: function (e) {
    this.setData({
      background: true,
      showModal: true,
    })
    let i = parseInt(e.target.dataset.promoterid);
    var that = this;
    var table = null;
    if (this.data.currentTab == 1){
      table = that.data.tasklist2;
    } else if (this.data.currentTab === 0){
      table = that.data.tasklist;
    }
    if (table==null){
      return;
    }
    // var promoterId = that.data.tasklist[i].id;
    var promoterId = table[i].id;
    
    that.setData({
      promoterId: promoterId,
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
      background: false,
      showModal: false,
      showModal1: false,
      showModal2: false,
      showModal3: false,
      showModal4: false,
      showModal4: false,
      background: false,
      warningtext: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function (e) {
    // var index = parseInt(e.target.dataset.index);
    // if(index>0){
    //   index = index -1;
    // }
    var index = this.data.index3;
    var table = this.data.tasklist2;
    if(table==null&&table.length==0){
      return;
    }
    table[index].isEdited = false;
    table[index].note = this.data.tasklist2[index].note;
    
    this.setData({
      tasklist2: table
    });
    this.hideModal();
  },

  onCancelDetele:function(e){
    this.hideModal();
  },

  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    var that = this;
    
    var promoterId = that.data.promoterId;
    that.setData({
      hiddens: true
    })
    var p = token.refresh(app);
    p.then(function () {
    return token.delRecommends(app, promoterId);
    }).then(function (res) {
      that.setData({
        hiddens: false
      })
      wx.showToast({
        title: res.data.content,
        duration: 1500
      });
      return token.getUserInfo(app);
    }).then(function () {
      return token.getRewardMoney(app);
    }).then(function (res) {
      that.setData({
        coin: res.data.content.coin,
      })
      return token.getConfig(app);
    }).then(function () {
      return token.getFinance(app);
    }).then(function () {
      // return token.getLastCode(app);
    }).then(function () {
      // return token.countCode(app);
    }).then(function () {
      // return token.queryCode(app);
    }).then(function () {
      return token.getFeeWithdraw(app);
    }).then(function () {
      that.refreshUser();
      that.setData({
        index: 1,
        size: 5,
        index2: 1,
        tasklist: null,
        tasklist2: null,
      });
      if (that.data.currentTab == 0 && that.data.tasklist == null) {
        that.searchOne();
      } else if (that.data.currentTab == 1 && that.data.tasklist2 == null) {
        that.searchTwo();
      };
    }).catch(function (res) {
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        token.refreshPage(res, that);
        that.setData({
          hiddens: false
        })
      } else {
        // wx.showModal({
        //   title: '错误提示',
        //   content: '与服务器连接超时',
        //   showCancel: false
        // })
      }
    //  that.setData({
    //    hiddens: true
    //  })
      
    })
    that.hideModal();
  },

  /**
   * 弹窗
   */
  showDialogBtn1: function () {
    this.setData({
      background: true,
      showModal1: true
    })
  },

  /**
   * 对话框取消按钮点击事件
   */
  onCancel1: function () {
    this.hideModal1();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm1: function () {
    this.hideModal1();
    wx.switchTab({
      url: './personal',
    })
  },
  /**
   * 历史邀请码弹窗
   */
  showDialogBtn2: function () {
    wx.navigateTo({
      url: './histroy',
    })
  },
  /**
   * 生成邀请码
   */
  createCode: function () {
    var that = this;
    that.setData({
      disabled: true
    })
    var p = new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.all_url.create_promoter_code_url + '?access_token=' + app.globalData.access_token,
        header: {
          "Content-Type": "application/json",
        },
        method: "POST",
        success: function (res) {
          
          if (res.data.success) {
            resolve();
          } else {
            if (res!=null && res.data!=null && res.data.errmsg != null) {
              token.refreshPage(res, that);

            } else {
              // wx.showModal({
              //   title: '错误提示',
              //   content: '与服务器连接超时',
              //   showCancel: false
              // })
            }
            that.setData({
              disabled: false
            })
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
          that.setData({
            disabled: false
          });
        }
      })
    });
    p.then(function () {
      return token.getUserInfo(app);
    }).then(function () {
      return token.getConfig(app);
    }).then(function () {
      // return token.getFinance(app);
    }).then(function () {
      // return token.getLastCode(app);
    }).then(function () {
      return token.countCode(app);
    }).then(function () {
      // return token.queryCode(app);
    }).then(function () {
      // return token.getFeeWithdraw(app);
    }).then(function () {
      var code = app.globalData.code;
      wx.setClipboardData({
        data: code,
      });
      wx.showToast({
        title: '邀请码已生成',
      })
      that.refreshUser();
      that.setData({
        disabled: false
      })
    })
  },
  /**
   * 刷新用户
   */
  refreshUser: function () {
    var that = this;
    if (app.globalData.user == null) {
      wx.navigateBack({})
    } else {
      that.setData({
        user: app.globalData.user,
        codeCount: app.globalData.codeCount,
        hasCode: app.globalData.codeUsed,
      });
      var codeList = app.globalData.codeList;
      if (codeList != null) {
        for (var i = 0; i < codeList.length; i++) {
          codeList[i].gmtCreate = daytimer.formatTime2(codeList[i].gmtCreate, 'Y/M/D h:m:s');
        }
        that.setData({
          codeList: codeList,
        })
      }
      var code = app.globalData.code;
      
      // if (code != null && code != '' ) {
      //   that.setData({
      //     inviteCode: code
      //   })
      // }
      // if (app.globalData.qrcode && app.globalData.qrcode.length > 0){
      //   that.setData({
      //     qrcode: app.globalData.qrcode[0]
      //   });
      // }
      //查询邀请码状态
      wx.request({
        url: app.globalData.all_url.get_invite_codes_url + '?access_token=' + app.globalData.access_token,
        header: {"Content-Type": "application/json"},
        data: { "promoterId": app.globalData.user.userId, used:false,"page":1,"pageSize":10},
        method: "POST",
        success: function (res){
          if(res==null)
          return;
          var datas = res.data.content.records;
          if(datas && datas.length > 0 ){
            var refereePromoterId = datas[0].refereePromoterId;
            var codeNew = datas[0].code;
            //app.globalData.qrcode = datas[0].file;
            var qr = datas[0].file;
            that.setData({
              qrcode: qr
            })
            if (refereePromoterId){
              that.setData({
                codeState:1,
                inviteCode: codeNew
              });
            }else{
              that.setData({
                codeState: 2,
                inviteCode: codeNew
              });
            }
          }
        }
        
      })
    }
  },
  //点击推荐人跳转链接
  clickRecomment:function(){
    this.setData({
      isClicked:true
    });
  },
  navigateToWeb:function(){
    this.setData({
      recomment_url:'https://mp.weixin.qq.com/'
    })
  },
  searchOne: function () {
    var that = this;
    var p = token.findRecommends(app, that.data.index, that.data.size, false);
    p.then(function (data) {
      //判断是否有数据，有则取数据  
      if (data.content.records.length != 0) {
        that.setData({
          bools1: false,
          bools2: false,
          inactivatedUser: data.content.total
        })
        let searchList = that.data.tasklist;
        var tasklist = data.content.records;
        for (var i = 0; i < tasklist.length; i++) {
          tasklist[i].gmtTime = util.formatTime3(new Date(tasklist[i].registerTime));
          if (tasklist[i].audit_status===0){
            tasklist[i].audit_status = '待填写订单号';
          } else if (tasklist[i].audit_status==1){
            tasklist[i].audit_status = '待同步订单数据';
          } else if (tasklist[i].audit_status == 2){
            tasklist[i].audit_status = '安全员审核成功';
          } else if (tasklist[i].audit_status == 3){
            tasklist[i].audit_status = '自动审核失败';
          } else if (tasklist[i].audit_status == 4){
            tasklist[i].audit_status = '待安全员审核';
          } else if (tasklist[i].audit_status == 5){
            tasklist[i].audit_status = '安全员审核失败';
          }
        }
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        searchList == null ? searchList = tasklist : searchList = that.data.tasklist.concat(tasklist)
        
        that.setData({
          tasklist: searchList, //获取数据数组
          index: that.data.index + 1,
          height: searchList.length * 200 + 50,
          height1: searchList.length * 200 + 50,
        });
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        that.setData({
          bools1: false,
          bools2: false,
        })
      }
    }).catch(function (res) {
      that.setData({
        bools1: false,
        bools2: false,
      })
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        token.refreshPage(res, that);

      } else {
        // wx.showModal({
        //   title: '错误提示',
        //   content: '与服务器连接超时',
        //   showCancel: false
        // })
      };
    });
  },
  searchTwo: function () {
    var that = this;
    var p = token.findRecommends(app, that.data.index2, that.data.size, true, that.data.condition);
    p.then(function (data) {
      //判断是否有数据，有则取数据  
      if (data.content.records.length != 0) {
        
        that.setData({
          bools1: false,
          bools2: false,
        })
        let searchList = that.data.tasklist2;
        var tasklist = data.content.records;
        that.setData({
          ActivatedUser: data.content.total
        }) 
        for (var i = 0; i < tasklist.length; i++) {
          tasklist[i].gmtTime = util.formatTime3(new Date(tasklist[i].registerTime));
          tasklist[i].isEdited = false;
        }
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        searchList == null ? searchList = tasklist : searchList = that.data.tasklist2.concat(tasklist);

        that.setData({
          tasklist2: searchList, //获取数据数组
          index2: that.data.index2 + 1,
          height: searchList.length * 200 + 50,
          height2: searchList.length * 200 + 50,
        });
        // app.globalData.usermessagesize = searchList.length
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        that.setData({
          bools1: false,
          bools2: false,
        })}
 
      
    }).catch(function (res) {
      
      that.setData({
        bools1: false,
        bools2: false,
      })
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        token.refreshPage(res, that);
      } else {
        // wx.showModal({
        //   title: '错误提示',
        //   content: '与服务器连接超时',
        //   showCancel: false
        // })
      };
    });
  },

//拨打电话
  makePhoneCall:function(e){
    var phone = e.currentTarget.dataset.id;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function (res) {
        console.log("拨打电话成功");
      },
      fail: function (res) {
        console.log("拨打电话失败")
      }
    });
    
  },

  //点击编辑图片编辑
  clickEdit:function(e){
    var index = parseInt(e.target.dataset.index);
    var type = e.target.dataset.type;
    this.setData({
      index3:index
    });

    var table;
    if (type == 1){
      table = this.data.tasklist;
    }else{
      table = this.data.tasklist2;
    }
    if (table == null && table.length == 0) {
      return;
    }
    var memo = table[index].note;
    this.setData({
      note:memo
    })
    table[index].isEdited = false;
    if (type == 1){
      this.setData({
        tasklist: table,
        background: true,
        showModal3: true,
        isType:type
      });
    }else{
      this.setData({
        tasklist2: table,
        background: true,
        showModal3: true,
        isType: type
      });
    }  
  },
  //搜索条件
  search:function(e){
    var memo = e.detail.value;
    this.setData({
      searchNote: memo,
      showModal4:true,
      background:true
    })
  },
  //返回我推荐的人页面
  backToreferee:function(){
    // wx.navigateTo({
    //   url: '/pages/home/personal/referee',
    // });
    this.setData({
      currentTab:1,
      index2:1,
      tasklist2:[],
      condition:null,
      showBack:false
    })
    this.searchTwo()
  },
  //编辑备注
  bindKeyInput:function(e){
    var memo = e.detail.value;

    this.setData({
      note: memo
    })
  },
  //输入搜索条件
  searchCondition:function(e){
    var condition = e.detail.value;
    this.setData({
      condition:condition
    })
  },
  //取消弹窗
  cancelSure:function(){
    this.setData({
      showModal4:false,
      background:false,
      warningtext:false

    })
  },
  //搜索确认
  searchSure(){
    var that = this;
    that.setData({
        index2:1
    })
    var that = this;
    var p = token.findRecommends(app, that.data.index2, that.data.size, true, that.data.condition);
    p.then(function (data) {
      //判断是否有数据，有则取数据
      if (data.content.records.length != 0) {
        that.setData({
          bools1: false,
          bools2: false,
        })
        that.setData({
          tasklist2:null
        })
        let searchList = that.data.tasklist2;
        var tasklist = data.content.records;
        that.setData({
          ActivatedUser: data.content.total
        })
        for (var i = 0; i < tasklist.length; i++) {
          tasklist[i].gmtTime = util.formatTime3(new Date(tasklist[i].registerTime));
        }
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
        searchList == null ? searchList = tasklist : searchList = that.data.tasklist2.concat(tasklist);
        that.setData({
          tasklist2: searchList, //获取数据数组
          index2: that.data.index2 + 1,
          height: searchList.length * 200 + 50,
          height2: searchList.length * 200 + 50,
          showModal4: false,
          background: false,
          showBack:true
        });
      } else {
        that.setData({
          bools1: false,
          bools2: false,
          warningtext:true
        })
      }
    }).catch(function (res) {

      that.setData({
        bools1: false,
        bools2: false,
      })
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        token.refreshPage(res, that);

      } else {
        // wx.showModal({
        //   title: '错误提示',
        //   content: '与服务器连接超时',
        //   showCancel: false
        // })
      };
    });



  },

  //保存备注
  onBlur:function(e){
    var index = this.data.index3;
    var id = e.target.dataset.id;
    var type = this.data.isType;
    var table;
    if (type == 1){
      table = this.data.tasklist;
    }else{
      table = this.data.tasklist2;
    } 
    if (table==null){
      return;
    } else if (table != null && table.length>0){
      id = table[index].id;
    }
    if (this.data.note == null || this.data.note==""){
      wx.showModal({
        title: '错误提示',
        content: '当前输入为空,请重新输入',
      })
      var values = table;
      values[index].isEdited = false;
      if (type == 1){
        this.setData({
          tasklist: values,
        })
      }else{
        this.setData({
          tasklist2: values,
        })
      }
      return;
    } else if (this.data.note == table[index].note){
      wx.showModal({
        title: '错误提示',
        content: '新备注与旧备注一致，请重新输入',
      });
      var tb = table;
      tb[index].isEdited = false;
      tb[index].note = this.data.note;
      if (type == 1) {
        this.setData({
          tasklist:tb,
          background:false,
          showModal3:false
       });
      }else{
        this.setData({
          tasklist2: tb,
          background: false,
          showModal3: false
        });
      }
      return;
    }
    //保存的接口，保存之后将编辑框隐藏掉，并刷新数据
    if (id != null && id!=""){
        wx.request({
          url: app.globalData.all_url.update_promoter_info_url + '?access_token=' + app.globalData.access_token,
          header: {
            "Content-Type": "application/json",
          },
          data: { promoterId: id, note:this.data.note},
          method: 'POST',
          success: (res) => {
            this.setData({
              bools1: true,
              bools2: true,
              index: 1,
              index2: 1,
              tasklist: null,
              tasklist2: null,
              height:this.data.height2,
              background: false,
              showModal3: false
            })
            if(type==1){
              this.searchOne();
            }else if(type==2){
              this.searchTwo();
            }
          },
          fail: (res) => {
            wx.showModal({
              title: '错误提示',
              content: '更新失败',
            })
          },
      });
    }
    // this.searchTwo();
    if(type==1){
      var values2 = this.data.tasklist;
      console.log(values2)
      values2[index].isEdited = false;
      this.setData({
        tasklist: values2
      })
    }else{
      var values2 = this.data.tasklist2;
      values2[index].isEdited = false;
      this.setData({
        tasklist2: values2
      })
    }
    
  },

  clickToOtherWeb:function(){
    this.setData({
      isClicked:true
    });
    wx.showToast({
      title: '跳转成功',
      icon: 'success',
      image: '',
      duration: 1000
    })
  }
 
})