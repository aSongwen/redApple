var constants = require('./constants.js');

//获取公开信息和位置信息的授权
/*
var authSetting = function () {
    return new Promise(function (resolve, reject) {
        wx.getSetting({
            success: (authSucc) => {
                console.log('au========' + JSON.stringify(authSucc))
                if (!authSucc.authSetting['scope.userLocation']) {//未授权
                    console.log('wx.authorize====')
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success: (openSucc) => {
                            resolve()
                        },
                        fail: (openFail) => {
                            wx.openSetting({
                                success: (ops) => {
                                    resolve()
                                }, fail: (opf) => {
                                    reject(opf)
                                }
                            });
                        }
                    })
                } else {//获取位置，允许登录
                    resolve()
                }
            }, fail: (authFail) => {
                reject(authFail)
            }
        })
    }).then(() => {
        return new Promise((resolve, reject) => {
            wx.getSetting({
                success: function (authSucc) {
                    if (authSucc.authSetting['scope.userLocation'] && authSucc.authSetting['scope.userInfo']) {
                        resolve()
                    } else {
                        reject(new Error('未授权'))
                    }
                },
                fail: function (e) {
                    reject(e)
                }
            })
        })
    })
}
*/
var authSettingNew = function () {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success: (authSucc) => {
        //console.log('au========' + JSON.stringify(authSucc))
        if (!authSucc.authSetting['scope.userLocation']) {//未授权
          //console.log('wx.authorize====')
          wx.authorize({
            scope: 'scope.userLocation',
            success: (openSucc) => {
              resolve()
            },
            fail: (openFail) => {
              reject(new Error('openSetting_failed'))
            }
          })
        } else {//获取位置，允许登录
          resolve()
        }
      }, fail: (authFail) => {
        reject(authFail)
      }
    })
  }).then(() => {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: function (authSucc) {
          if (authSucc.authSetting['scope.userLocation'] && authSucc.authSetting['scope.userInfo']) {
            resolve()
          } else {
            reject(new Error('未授权'))
          }
        },
        fail: function (e) {
          reject(e)
        }
      })
    })
  })
}

//
var authSettingCamera = function () {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success: (authSucc) => {
        //console.log('au========' + JSON.stringify(authSucc))
        if (!authSucc.authSetting['scope.writePhotosAlbum']) {//未授权
          //console.log('wx.authorize====')
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: (openSucc) => {
              resolve()
            },
            fail: (openFail) => {
              reject(new Error('openSetting_failed'))
            }
          })
        } else {//获取位置，允许登录
          resolve()
        }
      }, fail: (authFail) => {
        reject(authFail)
      }
    })
  }).then(() => {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: function (authSucc) {
          if (authSucc.authSetting['scope.writePhotosAlbum']) {
            resolve()
          } else {
            reject(new Error('未授权'))
          }
        },
        fail: function (e) {
          reject(e)
        }
      })
    })
  })
}
//
const checkAuth = type => {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success: (authSucc) => {
        //console.log("======checkAuth=====type===" + type);
        if (type == 1) {
          if (authSucc.authSetting['scope.userLocation'] && authSucc.authSetting['scope.userInfo']) {
            resolve(1)
            console.log("======checkAuth=====1===" + type );
          }
        } else if (type == 2) {
          if (authSucc.authSetting['scope.writePhotosAlbum'] ) {
            resolve(1)
          }
          console.log("======checkAuth=====2===" + type);
        }
        resolve(0)

      }, fail: (authFail) => {
        reject(new Error('authFail'))
      }
    })});
  
}

//获取微信授权(获取微信openId)
var getWechatAuth = function (app) {
    var that = this;
    var code = app.globalData.code;
    var data = app.globalData.data;
    var iv = app.globalData.iv;
    var app_url = app.globalData.all_url.wechat_auth_url;
    var authType = app.globalData.authType;
    var headImage = '';
    var nickName = '';
    var encryptedData = app.globalData.data;
    if (app.globalData.userinfo) {
      headImage = app.globalData.userinfo.avatarUrl;
      nickName = app.globalData.userinfo.nickName;
    }
    return new Promise(function (resolve, reject) {
        wx.login({
            success: function (res) {
                resolve(res);
            },
            fail: function (res) {
                reject(res);
            }
        });
    }).then((res)=>{
        return new Promise(function (resolve, reject) {
            wx.request({
                url: app_url + '?access_token=' + app.globalData.access_token,
                header: {
                    "Content-Type": "application/json",
                },
                data: {
                    appid: constants.AppId_RedApple,
                    code: res.code,
                    data: 1,
                    iv: 1,
                    authType: authType,
                    headImage: headImage,
                    nickName: nickName,
                    encryptedData: encryptedData,
                },
                method: "POST",
                success: function (res) {
                    if (res.data.success == true) {
                        wx.setStorageSync('auth_' + constants.AppId_RedApple, '1');
                        resolve(res);
                    } else {
                      wx.setStorageSync('auth_' + constants.AppId_RedApple, '0'); 
                        reject(res);
                    }
                },
                fail: function (res) {
                  wx.setStorageSync('auth_' + constants.AppId_RedApple, '1');
                    reject(res);
                }
            })
        })
    })
};

var checkWechatOpenId = function (app) {
  var that = this;
  var code = app.globalData.code;
  var data = app.globalData.data;
  var iv = app.globalData.iv;
  var app_url = app.globalData.all_url.check_wechat_openid_url;
  var authType = app.globalData.authType;
  var headImage = '';
  var nickName = '';
  var encryptedData = app.globalData.data;
  if (app.globalData.userinfo) {
    headImage = app.globalData.userinfo.avatarUrl;
    nickName = app.globalData.userinfo.nickName;
  }
  //console.log("code="+code);
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        resolve(res);
      },
      fail: function (res) {
        reject(res);
      }
    });
  }).then((res) => {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: app_url,
        header: {
          "Content-Type": "application/json",
        },
        data: {
          appid: constants.AppId_RedApple,
          secret: constants.AppSecret_RedApple,
          code: res.code,
          data: 1,
          iv: 1,
          authType: authType,
          headImage: headImage,
          nickName: nickName,
          encryptedData: encryptedData,
        },
        method: "POST",
        success: function (res) {
          if (res.data.success == true) {
            resolve(res);
          } else {
            if (res.data.errmsg.indexOf("Token已失效") == -1) {
              wx.showModal({
                title: '错误提示',
                content: res.data.errmsg,
                showCancel: false
              })
            }
          }
        },
        fail: function (res) {
          reject(res);
        }
      })
    })
  })
};

module.exports = {
    //authSetting,
    getWechatAuth,
    checkWechatOpenId,
    authSettingNew,
  authSettingCamera,
  checkAuth: checkAuth
}