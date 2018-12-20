// pages/commission/bindbankcard.js
const app = getApp();
const token = require("../../utils/token.js");
const utilsPara = require('../../utils/uiparams.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['招商银行', '中国银行', '兴业银行', '中国建设银行', '民生银行', '中国农业银行', '光大银行', '中国工商银行', '中信银行', '交通银行'],
    bool: true,
    loading: true,
    bankCardNum:'',
    bankName_old:'',//获取到的旧开户名
    bankName_new:'',//新输入的开户名
  },
  /**
   * 设置银行卡类型，例如:工商，民生等，对应类型为interger
   */
  bindPickerChange: function (e) {

    var that = this;
    var num = parseInt(e.detail.value);
    that.setData({
      index: e.detail.value,
    })
    var backName = null;
    var table = that.data.array;
    for(var i = 0;i<table.length;i++){
      if(num ==i){
        backName = table[i];
        break;
      }
      backName = null;
    }
    // switch (num) {
    //   case 0:
    //     backName = '招商银行'
    //     break;
    //   case 1:
    //     backName = '中国银行'
    //     break;
    //   case 2:
    //     backName = '兴业银行'
    //     break;
    //   case 3:
    //     backName = '中国建设银行'
    //     break;
    //   case 4:
    //     backName = '民生银行'
    //     break;
    //   case 5:
    //     backName = '中国农业银行'
    //     break;
    //   case 6:
    //     backName = '光大银行'
    //     break;
    //   case 7:
    //     backName = '中国工商银行'
    //     break;
    //   case 8:
    //     backName = '中信银行'
    //     break;
    //   case 9:
    //     backName = '交通银行'
    //     break;
    //   default:
    //     backName = null
    // }
    
    if (backName != null) {
      that.setData({
        // index: e.detail.value,
        bankName: backName,
        bankName_old:'',
        bankName_new: backName
      })
    }
  },
  /**
   * 设置持卡人
   */
  setName: function (e) {
   
    this.setData({
      bankCardName: e.detail.value
    })
  },

/**
 * 设置开户银行名称
 */
  setBankName:function(e){
    var that = this;
    that.setData({
      bankName_new:e.detail.value
    })
  },

  /**
   * 设置银行卡号
   */
  setbankNumber: function (e) {
    this.setData({
      bankCardNumber: e.detail.value
    });
  },
  /**
   * 修改银行卡
   */
  saveCard: function (e) {
    var bankCardName = this.data.bankCardName;
    var bankCardNumber = this.data.bankCardNumber;
    if (this.data.bankName_new == null || this.data.bankName_new==""){
      wx.showModal({
        title: '错误提示',
        content: '您输入的开户银行名称不能为空',
        showCancel: false,
      })
      return;
    }
    if (this.data.bankCardNumber == this.data.bankCardNum && this.data.bankName_old == this.data.bankName_new) {
      wx.showModal({
        title: '错误提示',
        content: '您输入的新数据与旧数据相同,请重新输入',
        showCancel: false,
      })
      return;
    }
    // var bankName = this.data.bankName;
    var bankName = this.data.bankName_new;
    var bool = false;
    
    var exp = /^([1-9]{1,})(\d{15,}|\d{17,}|\d{18,})$/;
    
    if (!exp.test(bankCardNumber)) {
      wx.showModal({
        title: '错误提示',
        content: '银行卡号格式不正确',
        showCancel: false,
      })
    } else {
      if (bankCardName != null && bankName != null && bankCardNumber != null) {
        bool = true;
      }
      var that = this;
      if (bool) {
        if (that.data.bool) {
          that.setData({
            loading: false
          })
          var p = token.refresh(app)
          p.then(function () {
          var app_url = app.globalData.all_url.change_user_bank_number_url;
          wx.request({
            url: app_url + '?access_token=' + app.globalData.access_token,
            header: {
              "Content-Type": "application/json",
            },
            data: {
              bankCardNumber: bankCardNumber,
              bankCardName: bankCardName,
              bankName: bankName
            },
            method: "POST",
            success: function (res) {
              
              var msg = null;
              if (res.data.success) {
                // that.data.bool = false;
                wx.showToast({
                  title: '银行卡设置成功',
                  duration: 3000
                })
                var pro = token.getUserInfo(app);
                pro.then(function(res){
                  that.setData({
                    loading: true
                  })
                })
              } else {
                if(res!=null && res.data!=null && res.data.errmsg!=null){
                  wx.showModal({
                    title: '错误提示',
                    content: res.data.errmsg,
                    showCancel: false
                  })
                }
                
                that.setData({
                  loading: true
                })
              }
            },
            fail: function (res) {
              if(res!=null && res.data!=null && res.data.errmsg!=null){
                wx.showModal({
                  title: '错误提示',
                  content: res.data.errmsg,
                  showCancel: false
                })
              }
              
              that.setData({
                loading: true
              })
            }
          })
          }).catch(function (res) {
            that.setData({
              loading: true
            })
            if (res != null && res.data != null && res.data.errmsg != null) {
              token.refreshPage(res, that);
            }
          })
        }   
      } else {
        wx.showModal({
          title: '错误提示',
          content: '持卡人，开户银行和银行卡号不能为空',
          showCancel:false,
        })
      }
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    token.refresh(app);
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
    // change_user_bank_number_url
    var that = this;
    if (app.globalData.menu_data){
      var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
      var params = utilsPara.getUiParam(mydata);
      if (params) {
        this.setData({
          home_menu_data: params,
        })
        var title = '绑定' + params.home_0006 + '银行卡';
        wx.setNavigationBarTitle({
          title: title,
        });
      }
    }
    // token.getToken(app);
    that.setData({
      user: null,
    })
    var users = app.globalData.user;
    if (users != null && users != '') {
      that.queryBankInfo();
      that.setData({
        user: users
      })
    };
    if(that.data.index==null){
        that.setData({
            bankCardNum: users.bankCardNumber,
            bankCardNumber: users.bankCardNumber,
            bankName_old: users.bankName,
            bankName_new: users.bankName,
            bankName: users.bankName
        });
    }else {
        that.setData({
            bankCardNum: users.bankCardNumber,
            bankCardNumber: users.bankCardNumber,
            bankName_old: '',
            bankName_new: users.bankName,
            bankName: users.bankName
        });
    }

    if (users.realName != null){
      that.setData({
        bankCardName: users.realName,
      })
    }else{
      wx.showModal({
        title: '您还未绑定身份证',
        content: '绑定身份证后，才能绑定银行卡',
        showCancel:false,
        success:function(res){
          wx.redirectTo({
            url: '/pages/edit/idCard',
          })
        }
      })
    }
  },

  //查询银行卡信息
  queryBankInfo:function(){
    var that = this;
    wx.request({
      url: app.globalData.all_url.qeury_bank_url + '?access_token=' + app.globalData.access_token,
      header: {
        "Content-Type": "application/json",
      },
      method:'POST',
      data:{status:1,pageIndex:1,pageSize:200},
      success:(res)=>{
        var data = res.data.content.records;
        if (data != null) {
          var table = [];
          for(var i = 0;i<data.length;i++){
            table.push(data[i].name);
          }
          that.setData({
            array: table
          })
        }
        
      },
      fail:(res)=>{
       
      }
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

  }
})