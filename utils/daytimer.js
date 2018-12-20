//时间
var clockTime = function (thisdate) {
  var that = thisdate;
  var time = parseInt(that.data.time);
  time = time + 86400000;
  that.setData({
    last_format: formatTime2(time, 'Y/M/D h:m:s')
  })
}

//加2小时
var clockTime_2 = function (thisdate) {
  var that = thisdate;
  var time = parseInt(that.data.time);
  time = time + 7200000;
  that.setData({
    last_format: formatTime2(time, 'Y/M/D h:m:s')
  })
}

//数据转化  
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}  

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTime(number, format) {
  if(!number) return null;

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date();

  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate() + 1));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}  
/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTime2(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number);
  
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

/* 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
*/
function formatTime3(number, format) { //author: meizz 
  if(!number) return null;
  var date = new Date(number);

  var o = {
    "M+": date.getMonth() + 1, //月份 
    "d+": date.getDate(), //日 
    "h+": date.getHours(), //小时 
    "m+": date.getMinutes(), //分 
    "s+": date.getSeconds(), //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return format;
}

/**
 * 获取当前日期本月第一天与最后一天
 */
function getMonthScope(day){
  var array = new Array();
  //先转换为时间格式
  if (typeof (day) == "string") {
    var array2 = day.split("-");
    day = new Date(array2[0], array2[1] - 1, 1);
  }
  var year = day.getFullYear();
  var month = day.getMonth() + 1;
  array.push(year + '-' + month + '-01 00:00:00');   //当月第一天
  var day = new Date(year, month, 0);
  array.push(year + '-' + month + '-' + day.getDate() + ' 23:59:59');   //当月最后一天
  return array;
}

function getDayHour(){
  var myDate = new Date();
  return myDate.getHours();
}

function getCanReport(){
  var hour = getDayHour();
  if(hour==0){
    return false;
  }
  return true;
}

module.exports = {
  clockTime: clockTime,
  clockTime_2: clockTime_2,
  formatTime: formatTime,
  formatTime2: formatTime2,
  formatTime3: formatTime3,
  getMonthScope: getMonthScope,
  getDayHour: getDayHour,
  getCanReport: getCanReport
}