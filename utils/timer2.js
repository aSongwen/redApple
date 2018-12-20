//增加计时器
const app = getApp();
var last_time = '';
var hour = 0;
var min = 0;
var sec = 0;
var timer;

var settimer = function (that) {
  if (sec == 60) {
    sec = sec - 60;
    min = min + 1;
  }
  if (min == 60) {
    min = min - 60;
    hour = hour + 1;
  }
  last_time = '';
  if (hour < 10) {
    last_time = last_time + '0' + hour;
  } else {
    last_time = last_time + hour;
  }
  if (min < 10) {
    last_time = last_time + ':0' + min;
  } else {
    last_time = last_time + ':' + min;
  }
  if (sec < 10) {
    last_time = last_time + ':0' + sec;
  } else {
    last_time = last_time + ':' + sec;
  }
  var sunTime = hour * 60 * 60 + min * 60 + sec;
  var res = app.globalData.task;
  if (res != null && res != ''&& res.data!=null) {

    console.log(res)
    console.log(1111)
    if (res.data.success!=null && res.data.content != null) {
      app.globalData.task = res.data.content;
      console.log(app.globalData.task)
      clearInterval(that.data.takingtime);
      clearTimeout(timer);
      that.setData({
        last_time: '',
        taking: false,
      })
      hour = 0;
      min = 0;
      sec = 0;
      wx.navigateTo({
        url: '/pages/dispatch/dispatch',
      })
    } else if (res.data.success!=null && res.data.content == null && res.data.success) {
      console.log(2222)
      console.log(res)
      that.setData({
        last_time: last_time,
      })
      sec++;
      timer = setTimeout(function () {
        settimer(that)
      }, 1000);
    } else if(res!=null && res.data!=null && res.data.errmsg!=null){
      console.log(333)
      console.log(res)
      var msg = res.data.errmsg ;
      if (msg.indexOf("账号状态异常 ,无法抢单")==-1) {
        console.log(444)
        if (res.data.errmsg.indexOf("Token已失效") == -1) {
          wx.showModal({
            title: '错误提示',
            content: res.data.errmsg,
            showCancel: false
          })
        }
      }
      if (msg.indexOf("账号状态异常 ,无法抢单") == -1){
        console.log(555)
        hour = 0;
        min = 0;
        sec = 0;
        clearInterval(that.data.takingtime);
        clearTimeout(timer);
        that.setData({
          last_time: '',
          taking: false,
        });
      }else{
        console.log(666)
        that.setData({
          last_time: last_time,
        })
        sec++;
        timer = setTimeout(function () {
          settimer(that)
        }, 1000);
      }
        
      app.globalData.task = null;
    }else if(!res.data.success){
      that.setData({
      last_time: last_time,
      })
      sec++;
      timer = setTimeout(function () {
        settimer(that)
      }, 1000);
      }
  } else {
    that.setData({
      last_time: last_time,
    })
    sec++;
    timer = setTimeout(function () {
      settimer(that)
    }, 1000);
  }
}

var stopTimer = function (that) {
  clearInterval(that.data.takingtime);
  clearTimeout(timer);
  that.setData({
    last_time: '',
  })
  hour = 0;
  min = 0;
  sec = 0;
}
module.exports = {
  settimer: settimer,
  stopTimer: stopTimer
}