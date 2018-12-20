const constants = require('./constants.js')
/**
 * app:全局变量，里面有存放token，pages:第几页，size:查找几条数据,callback:返回的数据执行function
 */
/**
 * 查询公告
 */
function getSearchMusic(app,pages,size) {
  var p = new Promise(function(resolve,reject){
    wx.request({
      url: app.globalData.all_url.query_system_message_url + '?access_token=' + app.globalData.access_token,
      data: {
        applicationId:6,
        appId:constants.AppId_RedApple,
        status:1,
        page: pages,
        pageSize: size
      },
      method: 'POST',
      header: { 'content-Type': 'application/json' },
      success: function (res) {

        if (res.data.success) {
          resolve(res.data);
        }
        else{
          reject(res);
        }
      },
      fail:function(res){
        reject(res);
      }
    })
  })
  return p;
}
/**
 * 查询用户消息
 */
function getSearchUser(app,pages, size) {
  var p = new Promise(function (resolve, reject){
    wx.request({
      url: app.globalData.all_url.find_message_url + '?access_token=' + app.globalData.access_token,
      data: {
        page: pages,
        pageSize: size
      },
      method: 'POST',
      header: { 'content-Type': 'application/json' },
      success: function (res) {
        
        if (res.data.success) {
          
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}
/**
 * 查询明细
 */
function getSearchMoneyCert(app, pageNum, size, withdrawType) {
  
  
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.all_url.query_promoter_finance_cert_url + '?access_token=' + app.globalData.access_token,
      data: {
        withdrawType: withdrawType,
        pageNum: pageNum,
        pageSize: size
      },
      method: 'POST',
      header: { 'content-Type': 'application/json' },
      success: function (res) {
       
        if (res.data.success) {
          
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}
//查询流水
function getSearchAllMoney(app, financeItemType, pageNum, size){
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.all_url.query_promoter_finance_url + '?access_token=' + app.globalData.access_token,
      data: {
        financeItemType: financeItemType,
        pageNum: pageNum,
        pageSize: size,
        device: 'mobile'
      },
      method: 'POST',
      header: { 'content-Type': 'application/json' },
      success: function (res) {
       
        if (res.data.success) {
          
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

//查询流水--新版
function getSearchAllMoneyNew(app,financeItemCode, financeItemType, pageNum, size) {
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.all_url.query_promoter_finance_url_new + '?access_token=' + app.globalData.access_token,
      data: {
        FinanceItemCode: financeItemCode,
        financeItemType: financeItemType,
        pageNum: pageNum,
        pageSize: size,
        device: 'mobile'
      },
      method: 'POST',
      header: { 'content-Type': 'application/json' },
      success: function (res) {

        if (res.data.success) {

          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

function getOrder(app,status, pageNum, size){
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.all_url.getOrders_url + '?access_token=' + app.globalData.access_token,
      data: {
        shokeyStatus:status,
        pageNum: pageNum,
        pageSize: size
      },
      method: 'POST',
      header: { 'content-Type': 'application/json' },
      success: function (res) {
        
        if (res.data.success) {
         
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

function getOrderCount(app, status) {
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.all_url.getOrders_count_url + '?access_token=' + app.globalData.access_token,
      data: {
        shokeyStatus: status
      },
      method: 'POST',
      header: { 'content-Type': 'application/json' },
      success: function (res) {

        if (res.data.success) {
          
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

//获取banner
function getBannerCode(app, status) {
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.all_url.get_bannerCode_url+ '?access_token=' + app.globalData.access_token,
      data: {
        status: status
      },
      method: 'POST',
      header: { 'content-Type': 'application/json' },
      success: function (res) {

        if (res.data.success) {
          
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}
function getBanner(app, code) {
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.all_url.get_bannerRel_url+ '?access_token=' + app.globalData.access_token,
      data: {
        fileId: code
      },
      method: 'POST',
      header: { 'content-Type': 'application/json' },
      success: function (res) {

        if (res.data.success) {
          
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

function getBannerFlag(app) {
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.all_url.get_banner_flag + '?access_token=' + app.globalData.access_token,
      data: {},
      method: 'POST',
      header: { 'content-Type': 'application/json' },
      success: function (res) {
        if (res.data.success) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

function getFrameProp(app, code) {
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.all_url.get_prop + '?access_token=' + app.globalData.access_token,
      data: {
        "code":code
      },
      method: 'POST',
      header: { 'content-Type': 'application/json' },
      success: function (res) {
        if (res.data.success) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

function getHurryOrder(app,taskIds) {
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.all_url.hurry_order_url + '?access_token=' + app.globalData.access_token,
      data: {
        taskIds: taskIds
      },
      method: 'POST',
      header: { 'content-Type': 'application/json' },
      success: function (res) {

        if (res.data.success) {

          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

function setHurryOrder(app, executeId) {
  var p = new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.all_url.remind_url + '?access_token=' + app.globalData.access_token,
      data: {
        executeId: executeId
      },
      method: 'POST',
      header: { 'content-Type': 'application/json' },
      success: function (res) {

        if (res.data.success) {

          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  })
  return p;
}

//查询流量任务流水
function queryFlowFinanceRecord(app,financeItemCode, financeItemType, pageNum, size) {
    var p = new Promise(function (resolve, reject) {
        wx.request({
            url: app.globalData.all_url.queryFlowFinanceRecord + '?access_token=' + app.globalData.access_token,
            data: {
                FinanceItemCode: financeItemCode,
                financeItemType: financeItemType,
                pageNum: pageNum,
                pageSize: size,
                device: 'mobile'
            },
            method: 'POST',
            header: {'content-Type': 'application/json'},
            success: function (res) {

                if (res.data.success) {

                    resolve(res.data);
                } else {
                    reject(res);
                }
            },
            fail: function (res) {
                reject(res);
            }
        })
    })
    return p;
}


module.exports = {
  getSearchMusic: getSearchMusic,
  getSearchUser: getSearchUser,
  getSearchMoneyCert: getSearchMoneyCert,
  getSearchAllMoney: getSearchAllMoney,
  getSearchAllMoneyNew: getSearchAllMoneyNew,
  getOrder: getOrder,
  getOrderCount: getOrderCount,
  getBanner:getBanner,
  getBannerCode:getBannerCode,
  getBannerFlag: getBannerFlag,
  getFrameProp: getFrameProp,
  getHurryOrder: getHurryOrder,
  setHurryOrder: setHurryOrder,
  queryFlowFinanceRecord: queryFlowFinanceRecord
}