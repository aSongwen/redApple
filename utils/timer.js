//验证码计时器var countdown = '';
var timer;
var countdown = 0;
var timer_new;
var countdown_new = 0 ;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      is_show: true,
      last_time:'',
    })
    countdown = that.data.countdown;
    return;
  } else {
    that.setData({
      is_show: false,
      last_time: countdown
    })
    countdown--;
  }

  that.last_time = '';
  that.is_show = true;

  timer = setTimeout(function () {
    settime(that)
  }
    , 1000)
}

//新手机号验证码倒计时
var settime_new = function(that){
  if (countdown_new == 0) {
    that.setData({
      is_show_new: true,
      last_time_new: '',
    })
    countdown_new = that.data.countdown_new;
    return;
  } else {
    that.setData({
      is_show_new: false,
      last_time_new: countdown_new
    })
    countdown_new--;
  }
  that.last_time_new = '';
  that.is_show_new = true;
  timer_new = setTimeout(function () {
    settime_new(that)
  }, 1000)
}

var downTimer = function (num, that) {
  if (!that.data.enOutTime) {
    if (that.data.taskStatus == 1){
      wx.setStorageSync("bool5", 0);
      wx.setStorageSync("checkLinkTime", "");
      wx.setStorageSync("linkAddress", "");
    }else{
      wx.setStorageSync("flowLinkAddress", "");
      wx.setStorageSync("bool", 0);
      wx.setStorageSync("checkFlowLinkTime", "");
    }
    clearTimeout(timer);
    that.setData({
      earnCode: '核对成功后完成提交',
      disable: true,
    });
    return;
  }
  num--;
  if (num <= 0) {  
    that.setData({
      earnCode: '完成提交',
      disable: false,
    })
    clearTimeout(timer);
    return;
  }
  that.setData({
    earnCode: `${num}s` + '后可以提交',
  })
  timer = setTimeout(function () {
    downTimer(num, that)
  }, 1000);
}

var clearTimer = function(){
  clearTimeout(timer);
  countdown = 0;
}

var clickVerify = function (thisdate) {
  var that = thisdate;
  if (that.data.last_time != 0 && that.data.last_time != null && that.data.last_time != ''){
    countdown = that.data.last_time;
  }else{
    countdown = that.data.countdown;
  }
  // 将获取验证码按钮隐藏60s，60s后再次显示
  that.setData({
    is_show: (!that.data.is_show)  //false
  })
  settime(that);
}

var clickVerify_new = function(val){
  var that = val;
  if (that.data.last_time_new != 0 && that.data.last_time_new != null && that.data.last_time_new!=''){
    countdown_new = that.data.last_time_new;
  }else{
    countdown_new = that.data.countdown_new;
  }
  // 将获取验证码按钮隐藏60s，60s后再次显示
  that.setData({
    is_show_new: (!that.data.is_show_new)  //false
  })
  settime_new(that);
}

function stopTimer() {
  clearTimeout(timer);
}
module.exports = {
  clickVerify: clickVerify,
  clickVerify_new: clickVerify_new,
  clearTimer: clearTimer,
  downTimer: downTimer,
  stopTimer: stopTimer,
}