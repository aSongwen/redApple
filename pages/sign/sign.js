// pages/sign/sign.js
const app = getApp();
var calendarSignData;
var date;
var date_time;
var calendarSignDay;
var days;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.screenHeight,
          width: res.screenWidth,
        })
      },
    })
    var mydate = new Date();
    var year = mydate.getFullYear();//年
    var month = mydate.getMonth() + 1;//月
    date = mydate.getDate();//日

    var day = mydate.getDay();//星期几
    
    if(day == 1){
      days = '星期一';
    }
    if (day == 2) {
      days = '星期二';
    }
    if (day == 3) {
      days = '星期三';
    }
    if (day == 4) {
      days = '星期四';
    }
    if (day == 5) {
      days = '星期五';
    }
    if (day == 6) {
      days = '星期六';
    }
    if (day == 0) {
      days = '星期日';
    }
    var nbsp = 7 - ((date - day) % 7);
    
    var monthDaySize;
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      monthDaySize = 31;
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      monthDaySize = 30;
    } else if (month == 2) {
      // 计算是否是闰年,如果是二月份则是29天
      if ((year - 2000) % 4 == 0) {
        monthDaySize = 29;
      } else {
        monthDaySize = 28;
      }
    };
    // 判断是否签到过
    if (wx.getStorageSync("calendarSignData") == null || wx.getStorageSync("calendarSignData") == '') {
      wx.setStorageSync("calendarSignData", new Array(monthDaySize));
    };
    if (wx.getStorageSync("calendarSignDay") == null || wx.getStorageSync("calendarSignDay") == '') {
      wx.setStorageSync("calendarSignDay", 0);
    }
    calendarSignData = wx.getStorageSync("calendarSignData")
    calendarSignDay = wx.getStorageSync("calendarSignDay")
    
    date_time = year + '-';
    if(month < 10){
      date_time = date_time + '0' + month + '-';
    }else{
      date_time = date_time + month + '-';
    }
    if (date < 10) {
      date_time = date_time + '0' + date;
    } else {
      date_time = date_time + date;
    }
    this.setData({
      year: year,
      month: month,
      nbsp: nbsp,
      monthDaySize: monthDaySize,
      date: date,
      calendarSignData: calendarSignData,
      calendarSignDay: calendarSignDay,
      date_time:date_time,
      days:days,
      integral:323,
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
  //签到事件处理函数
  calendarSign: function () {
    this.setData({
      showModal: true
    })
    calendarSignData[date] = date;
    
    calendarSignDay = calendarSignDay + 1;
    wx.setStorageSync("calendarSignData", calendarSignData);
    wx.setStorageSync("calendarSignDay", calendarSignDay);
    this.setData({

      calendarSignData: calendarSignData,
      calendarSignDay: calendarSignDay
    })
  },
  /**
   * 弹窗
   */

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
    wx.switchTab({
      url: './personal',
    })
  },
  /**
   * 判断连续签到几天
   */
  continuity:function(){
    var continuity = wx.getStorageSync("calendarSignData");
    var index=0;
    for (var i in continuity){
      if (continuity[i] != null){
        index++;
      }
    }
  }
})