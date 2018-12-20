// pages/home/personal/histroy.js
const app = getApp();
const utils = require("../../../utils/verify.js");
const util = require("../../../utils/util.js");
const token = require("../../../utils/token.js");
const page = require("../../../utils/page.js");
const daytimer = require("../../../utils/daytimer.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:1,
    pageSize:15
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index:1,
      pageSize:15,
    })
    var res = wx.getSystemInfoSync();
    this.setData({
      height: res.windowHeight
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
    this.setData({
      searchPageNum: 1,   //第一次加载，设置1
      isFromSearch: true,  //第一次加载，设置true  
      searchLoading: true,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })
    this.searchTitle();
  },
  //查询公告
  searchTitle: function () {
    var that = this;
    // var t = util.formatTime(new Date());
    var p = token.refresh(app);
    p.then(function () {
    return token.queryCode2(app, that.data.index, that.data.pageSize);
    }).then(function (res) {
     
      //判断是否有数据，有则取数据  
      if (res.data.content.records != null && res.data.content.records.length !=0) {
        let searchList = [];
        var notics = res.data.content.records;
        if (notics.length < 10) {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: true  //把"上拉加载"的变量设为false，隐藏  
          })
        } else {
          that.setData({
            searchLoading: false   //把"上拉加载"的变量设为true  
          })
        }
        for (var i = 0; i < notics.length; i++) {
          notics[i].gmtTime = util.formatTime(new Date(notics[i].gmtCreate));
        }
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = notics : searchList = that.data.notics.concat(notics)
        that.setData({
          notics: searchList, //获取数据数组
          size: searchList.length
        });
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: true  //把"上拉加载"的变量设为false，隐藏  
        });
      }
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
  },
  //滚动到底部触发事件  
  searchScrollLower: function () {
    let that = this;
    if (!that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        index: that.data.index + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false,  //触发到上拉事件，把isFromSearch设为为false  
        searchLoading: true
      });
      that.searchTitle();
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
    
    // let that = this;
    // if (that.data.searchLoading && !that.data.searchLoadingComplete) {
    //   that.setData({
    //     index: that.data.index + 1,  //每次触发上拉事件，把searchPageNum+1  
    //     isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
    //   });
    //   that.searchTitle();
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var inviteCode = e.target.dataset.invitecode;
    return {
      title: '内部定向邀请',
      desc: '使用我的内部定向邀请码，一起加入吧。',
      imageUrl: './icon/tuiguang.jpg',
      path: '/pages/login/register2?inviteCode=' + inviteCode
    }
  },
  /**
   * 复制邀请码
   */
  copyCode:function(e){
    
    var code = e.target.dataset.code;
    wx.setClipboardData({
      data: code,
    })
    wx.showToast({
      title: '复制成功',
    })
  }
})