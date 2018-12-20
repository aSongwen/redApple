// pages/home/task/evaluate-task/evaluate-task.js
const app = getApp();
const util = require('../../../../utils/timer3.js')
const token = require('../../../../utils/token.js')
const utils = require("../../../../utils/util.js");
const utilsPara = require('../../../../utils/uiparams.js');
const wxAuthorize = require('../../../../utils/wxAuthorize.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    saveImage: true,
    saveTask: true,
      backgroundUrl:'',
    modalAuthShow:false
  },
 
  saveTask: function () {
    var that = this;
    that.setData({
      saveTask: false,
    })
    var pics = that.data.pics;
    if (pics != null && pics.length > 0) {
      var auditReviewImages = new Array();
      var id = that.data.id
      var i = 0;
      for (var x in pics) {
        var p = token.upload_file(app, pics[x]);
        p.then(function (res) {
          auditReviewImages[i] = res.data.content[0];
          i = i + 1;
          var sum = i;
          if (sum == pics.length) {

            var pro = token.pushOrder2(app, id, 1, null, null, auditReviewImages);
            pro.then(function (res) {
              if (res.data.success) {
                wx.showModal({
                  title: '提交成功',
                  content: '提交成功，请等待后台审核',
                  showCancel: false,
                  success: function (res) {
                    wx.switchTab({
                      url: '/pages/home/task/task',
                    })
                  }
                })
              } else {
                that.setData({
                  saveTask: true,
                })
              }
            }).catch(function (res) {
              that.setData({
                saveTask: true,
              })
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
          }
        }).catch(function (res) {
          that.setData({
            saveTask: true,
          })
          if (res!=null && res.data!=null && res.data.errmsg != null) {
            token.refreshPage(res, that);
          } else {
            // wx.showModal({
            //   title: '错误提示',
            //   content: '与服务器连接超时',
            //   showCancel: false
            // })
          }
        })
      };
    } else {
      wx.showModal({
        title: '错误提示',
        content: '请选择要提交的图片',
        showCancel: false,
      })
      that.setData({
        saveTask: true,
      })
    }
  },
  /**
   * 一键复制评价，并把图片下载到相册
   */
  download: function () {
    var that = this;
    wx.setClipboardData({
      data: that.data.comment,
    })
    that.setData({
      saveImage: false,
    })
    var srcs = that.data.srcs;
    if (srcs != null && srcs.length > 0 ){
      wx.getSetting({
        success: function (res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                
                for (var x in srcs) {
                  var p = new Promise(function (resolve, reject) {
                    wx.downloadFile({
                      url: srcs[x],
                      success: function (res) {
                        
                        resolve(res);
                      },
                      fail: function (res) {
                        reject(res);
                      }
                    });
                  });
                  p.then(function (res) {
                    wx.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath,
                      success: function (res) {
                        
                        var sum = parseInt(x) + 1;
                        if (sum == srcs.length) {
                          wx.showToast({
                            title: '保存成功',
                          });
                          that.setData({
                            saveImage: true,
                          });
                        }
                      },
                      fail: function (res) {
                        that.setData({
                          saveImage: true,
                        })
                        // if (res.errMsg == null) {
                        //   res.errMsg = '与服务器连接超时'
                        // }
                        // wx.showModal({
                        //   title: '错误提示',
                        //   content: res.errMsg,
                        //   showCancel: false,
                        // })
                      }
                    });
                  }).catch(function (res) {
                    that.setData({
                      saveImage: true,
                    })
                    // if (res.errMsg == null) {
                    //   res.errMsg = '与服务器连接超时'
                    // }
                    // wx.showModal({
                    //   title: '错误提示',
                    //   content: res.errMsg,
                    //   showCancel: false,
                    // })
                  });
                }
              },
              fail() {
                // 用户拒绝了授权  
                
                // 打开设置页面 
                wxAuthorize.authSettingCamera()
                  .then(() => {
                    that.setData({
                      saveImage: true,
                    });
                    for (var x in srcs) {
                      var p = new Promise(function (resolve, reject) {
                        wx.downloadFile({
                          url: srcs[x],
                          success: function (res) {

                            resolve(res);
                          },
                          fail: function (res) {
                            reject(res);
                          }
                        });
                      });
                      p.then(function (res) {
                        wx.saveImageToPhotosAlbum({
                          filePath: res.tempFilePath,
                          success: function (res) {

                            var sum = parseInt(x) + 1;
                            if (sum == srcs.length) {
                              wx.showToast({
                                title: '保存成功',
                              });
                              that.setData({
                                saveImage: true,
                              });
                            }
                          },
                          fail: function (res) {
                            that.setData({
                              saveImage: true,
                            })
                            // if (res.errMsg == null) {
                            //   res.errMsg = '与服务器连接超时'
                            // }
                            // wx.showModal({
                            //   title: '错误提示',
                            //   content: res.errMsg,
                            //   showCancel: false,
                            // })
                          }
                        });
                      }).catch(function (res) {
                        that.setData({
                          saveImage: true,
                        })
                        // if (res.errMsg == null) {
                        //   res.errMsg = '与服务器连接超时'
                        // }
                        // wx.showModal({
                        //   title: '错误提示',
                        //   content: res.errMsg,
                        //   showCancel: false,
                        // })
                      });
                    }
                  }).catch((e) => {
                    if (e == 'Error: openSetting_failed') {
                      that.setData({ modalAuthShow: true });
                      return;
                    }
                    //console.log('getFirstUserInfo.error===', e)
                    wx.showModal({
                      content: '位置授权失败，请登录并授权',
                      showCancel: false
                    });
                  })
                /*
                wx.openSetting({
                  success: function (data) {
                    
                    that.setData({
                      saveImage: true,
                    });
                    
                    if (data.authSetting["scope.writePhotosAlbum"]) {
                      for (var x in srcs) {
                        var p = new Promise(function (resolve, reject) {
                          wx.downloadFile({
                            url: srcs[x],
                            success: function (res) {
                              
                              resolve(res);
                            },
                            fail: function (res) {
                              reject(res);
                            }
                          });
                        });
                        p.then(function (res) {
                          wx.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success: function (res) {
                              
                              var sum = parseInt(x) + 1;
                              if (sum == srcs.length) {
                                wx.showToast({
                                  title: '保存成功',
                                });
                                that.setData({
                                  saveImage: true,
                                });
                              }
                            },
                            fail: function (res) {
                              that.setData({
                                saveImage: true,
                              })
                              // if (res.errMsg == null) {
                              //   res.errMsg = '与服务器连接超时'
                              // }
                              // wx.showModal({
                              //   title: '错误提示',
                              //   content: res.errMsg,
                              //   showCancel: false,
                              // })
                            }
                          });
                        }).catch(function (res) {
                          that.setData({
                            saveImage: true,
                          })
                          // if (res.errMsg == null) {
                          //   res.errMsg = '与服务器连接超时'
                          // }
                          // wx.showModal({
                          //   title: '错误提示',
                          //   content: res.errMsg,
                          //   showCancel: false,
                          // })
                        });
                      }
                    } else {
                      wx.showModal({
                        title: '错误提示',
                        content: '您已拒绝授权，请授权后在保存图片',
                        showCancel: false,
                      })
                    }
                  },
                  fail: function (data) {
                    
                  }
                });
                */
              }
            })
          } else {
            for (var x in srcs) {
              var p = new Promise(function (resolve, reject) {
                wx.downloadFile({
                  url: srcs[x],
                  success: function (res) {
                    
                    resolve(res);
                  },
                  fail: function (res) {
                    reject(res);
                  }
                });
              });
              p.then(function (res) {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function (res) {
                    
                    var sum = parseInt(x) + 1;
                    
                    if (sum == srcs.length) {
                      wx.showToast({
                        title: '保存成功',
                      });
                      that.setData({
                        saveImage: true,
                      });
                    }
                  },
                  fail: function (res) {
                    that.setData({
                      saveImage: true,
                    })
                    // if (res.errMsg == null) {
                    //   res.errMsg = '与服务器连接超时'
                    // }
                    // wx.showModal({
                    //   title: '错误提示',
                    //   content: res.errMsg,
                    //   showCancel: false,
                    // })
                  }
                });
              }).catch(function (res) {
                that.setData({
                  saveImage: true,
                })
                // if (res.errMsg == null) {
                //   res.errMsg = '与服务器连接超时'
                // }
                // wx.showModal({
                //   title: '错误提示',
                //   content: res.errMsg,
                //   showCancel: false,
                // })
              });
            }
          }
        },
        fail: function (res) {
          
        }
      });
      that.setData({
        saveImage: true,
      })
    }else{
      that.setData({
        saveImage: true,
      })
        wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
        })
    }
  },
  //取消按钮点击事件 
  modalBindcancel: function () {
    this.setData({ modalAuthShow: false, })
  },
  /**
   * 返回tabBar页面
   */
  totask: function () {
    wx.switchTab({
      url: '../task',
    })
  },

  //预览图片
  listenerButtonPreviewImage1: function (e) {
    var current = e.target.dataset.src;
    var that = this;
    wx.previewImage({
      current: current,
      urls: that.data.srcs,
    })
  },
  /**
   * 本地上传图片预览
   */
  listenerButtonPreviewImage2: function (e) {
    var current = e.target.dataset.src;
    var that = this;
    wx.previewImage({
      current: current,
      urls: that.data.pics,
      success: function (e) {
        
      }
    })
  },

  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.pics;
    var index = e.currentTarget.dataset.id;
    imgs.splice(index, 1);
    this.setData({
      pics: imgs
    });
  },

  gotoShow: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
       
        var imgsrc = res.tempFilePaths;
        var pics = that.data.pics;
        pics = pics.concat(imgsrc);
        that.setData({
          pics: pics,
        });
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      width: app.globalData.screenWidth,
      height: app.globalData.screenHeight,
      id: options.id,
    });
    var that = this;
    if (options.status != null) {
      that.setData({
        status: options.status,
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          width: res.windowWidth,
        })
      },
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
    var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
    var params = utilsPara.getUiParam(mydata);
    if (params) {
      this.setData({
        home_menu_data: params,
      })
      var title = '评价' + params.persion_0003;
      wx.setNavigationBarTitle({
        title: title,
      });
    }
    wxAuthorize.checkAuth(2)
      .then(val => {
        console.log("val========" + val);
        if (val == 1) {
          this.setData({ modalAuthShow: false });
        }
      }).catch((e) => {
        console.log("val====e====" + e);
      });

    util.stopTime();
    var that = this;
    that.setData({
      realEndTime:null,
      end:null,
      endTime:null,
    })
    var p = token.getTaskDetail(app, that.data.id);
    p.then(function (res) {
      
      var task = res.data.content;
      if (task.orderPayTime != null) {
        task.orderPayTime = utils.formatTime(new Date(task.orderPayTime));
      };
      that.setData({
        task: task
      })
      var task = that.data.task;
      
      var url = [task.listing.mainImageUrl];
      var size = 0;
      if (task.task.comment.images != null) {
        size = task.task.comment.images.length;
      }
      var imgHeight = Math.ceil(size / 5) * 180;
      for (var x in task.task.comment.images) {
        task.task.comment.images[x] =app.globalData.all_url.location_url + task.task.comment.images[x];
      }
      var srcs = [];
      // tasklist[i].gmtTime = utils.formatTime(new Date(tasklist[i].real_start_time));
      if (task.task.comment.images != null) {
        srcs = task.task.comment.images;
      }
      that.setData({
        user: app.globalData.user,
        imagelist: url,
        imgHeight: imgHeight,
        comment: task.task.comment.comment,
        srcs: srcs,
      });
      if (that.data.status == 1) {
        var realStartTime = parseInt(task.task.shokeyAuditTime);
        that.setData({
          realEndTime: realStartTime + task.timeOut,
          end: that.data.task.currentServerTime,
          // realEndTime: realStartTime + 3600000,
          // realEndTime: new Date().getTime() + 100000,
        })
       
        var realEndTime = parseInt(that.data.realEndTime);
        var date = parseInt(task.currentServerTime);
        that.setData({
          // thisDate: new Date().getTime(),
          endTime: realEndTime - date,
        })
        var endTime = Math.floor(that.data.endTime / 1000);
        
        if (endTime > 0) {
          util.settimer(endTime, that);
        } else {
          that.setData({
            date: '任务已超时',
            disable: true
          })
        }
        var endTime = parseInt(that.data.endTime) * 1000;
        endTime = Math.floor(endTime / 1000)
      }
    }).catch(function (res) {
      
      if(res!=null && res.data!=null &&res.data.errmsg!=null) {
        token.refreshPage(res, that);
      };
      wx.navigateBack({});
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 弹窗
   */
  showDialogBtn: function () {
    this.setData({
      showModal: true
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
    wx.navigateTo({
      url: './cancel',
    })
  },
  /**
   * 设置评论
   */
  setComment: function (e) {
    
    var that = this;
    that.setData({
      comment: e.target.dataset.comment,
    })
  }
})