//const util1 = require('timer.js')

//倒计时定时器
var hour = 0;
var min = 0;
var sec = 0;
var timer;
var settimer = function(number,that){
  /*
  var realEndTime = 0;
  if(that.data.task.task.shokeyStatus==1){
    realEndTime = that.data.realEndTime;
  }else{
    realEndTime = that.data.task.realEndTime;
  }*/
  var realEndTime = 0;
  if (that.data.task.shokeyStatus == 1) {
    realEndTime = that.data.realEndTime;
  } else {
    realEndTime = that.data.realEndTime;
  }
  
  var end = parseInt(that.data.end) + 1000;
  if (realEndTime > end){
    number--;
    if (number<=0){
      clearTimeout(timer);
      that.setData({
        date: '任务已超时',
        enOutTime: false,
      });
      return;
    }
    that.setData({
      date: formatTime(number),
      endTime: number,
      end: end,
    })
    
    timer = setTimeout(function () {
      settimer(number, that)
    }, 1000);
  }else{
    clearTimeout(timer);
    that.setData({
      date: '任务已超时',
      enOutTime: false,
    });
  }
}
function stopTime(){
  clearTimeout(timer);
}
function formatTime(that){
  hour = Math.floor(that/3600)
  min = Math.floor((that-hour*3600)/60);
  sec = that - hour * 3600 - min * 60;
  var date='';
  if (hour < 10) {
    date = date + '0' + hour;
  } else {
    date = date + hour;
  }
  if (min < 10) {
    date = date + ':0' + min;
  } else {
    date = date + ':' + min;
  }
  if(sec < 10){
    date = date + ':0' + sec;
  }else{
    date = date + ':' + sec;
  }
  return date;
} 

module.exports = {
  settimer: settimer,
  stopTime: stopTime,
}