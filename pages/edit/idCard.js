// pages/edit/idCard.js
const app = getApp();
const token = require("../../utils/token.js");
const daytimer = require('../../utils/daytimer.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realName: null,
    idCardNumber: null,
    idCardAddress: null,
    gender: null,
    nation: null,
    birthday: null,
    authority: null,
    idCardStartTime: null,
    idCardEndTime: null,
    startTime: null,
    endTime: null,
    idCardImageFront: null,
    idCardImageBack: null,
    frontId: null,
    backId: null,
    frontStatus: 0, //身份证正面上传状态,0未上传,1正在上传,2身份证解析中,3上传成功, -1上传失败
    backStatus: 0,  //身份背面上传状态,0未上传,1正在上传,2身份证解析中,3上传成功,-1上传失败
    isFirst:true,
    array: [],
    bankName:'',
    bankCardNum:'',
    bankName_old:'',//获取到的旧开户名
    bankName_new:'',//新输入的开户名
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    console.log("index======"+that.data.index);
    var users = app.globalData.user;
    if (users != null && users != '') {
      that.setData({
        index:null,
        user: users,
        startTime: this.data.startTime ? this.data.startTime : daytimer.formatTime3(users.idCardStartTime, 'yyyy-MM-dd'),
        endTime: this.data.endTime ? this.data.endTime : daytimer.formatTime3(users.idCardEndTime, 'yyyy-MM-dd'),
        frontStatus: (this.data.idCardImageFront || users.idCardImageFront) ? 3 : 0,
        backStatus: (this.data.idCardImageBack || users.idCardImageBack) ? 3 : 0,
        bankCardNum:users.bankCardNumber,
        bankName_old:users.bankName,
        bankName:users.bankName,
      })
    }
    if (that.data.user.idCardNumber == null) {
      wx.setNavigationBarTitle({
        title: '设置身份证号',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '查看身份证号',
      })
    }
    that.queryBankInfo();
    
  },

  /**
   * 保存身份证信息
   */
  saveIdCard: function () {
    var that = this;
    var errorMsg;

    var frontStatus = this.data.frontStatus;
    var backStatus = this.data.backStatus;
    var realName = this.data.realName;
    var idCardImageFront = this.data.idCardImageFront;
    var idCardImageBack = this.data.idCardImageBack;
    var idCardNumber = this.data.idCardNumber;
    var idCardAddress = this.data.idCardAddress;
    var idCardStartTime = this.data.idCardStartTime;
    var idCardEndTime = this.data.idCardEndTime;
    var nation = this.data.nation;
    var gender = this.data.gender;
    var birthday = this.data.birthday;
    var authority = this.data.authority;
    var bankCardNum = this.data.bankCardNum;
    var bankName = this.data.bankName;
    var reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;

    if (frontStatus == 0){
      errorMsg = "请上传身份头像面";
    } else if (frontStatus == -1) {
      errorMsg = "请重拍身份证头像面";
    } else if (frontStatus == 1) {
      errorMsg = "身份证正在上传中,请稍后点击保存";
    } else if (frontStatus == 2) {
      errorMsg = "身份证正在解析中,请稍后点击保存";
    } else if (backStatus == 0) {
      errorMsg = "请上传身份国徽面";
    } else if (backStatus == -1) {
      errorMsg = "请重拍身份证国徽面";
    } else if (backStatus == 1) {
      errorMsg = "身份证正在上传中,请稍后点击保存";
    } else if (backStatus == 2) {
      errorMsg = "身份证正在解析中,请稍后点击保存";
    }  else if (idCardImageFront == null) {
      errorMsg = "请上传身份证正面";
    } else if (idCardImageBack == null) {
      errorMsg = "请上传身份证反面";
    } else if (realName == null) {
      errorMsg = "真实姓名不能为空";
    } else if (idCardNumber == null) {
      errorMsg = "身份证号不能为空";
    } else if (!reg.test(idCardNumber)) {
      errorMsg = "身份证号格式不正确";
    } else if (idCardAddress == null) {
      errorMsg = "身份证地址不能为空";
    } else if (idCardStartTime == null || idCardEndTime == null) {
      errorMsg = "身份证有效期不能为空";
    } else if (nation == null) {
      errorMsg = "民族不能为空";
    } else if (gender == null) {
      errorMsg = "性别不能为空";
    } else if (birthday == null) {
      errorMsg = "出生年月不能为空";
    } else if (bankName == null || bankName == "") {
        errorMsg = "开户银行不能为空";
    }else if (bankCardNum == null || bankCardNum == "") {
        errorMsg = "银行卡卡号不能为空";
    }
    // else if (authority == null) {
    //   errorMsg = "身份证签发机关不能为空"
    // }
    if (errorMsg) {
      wx.showModal({
        title: '错误提示',
        content: errorMsg,
        showCancel: false,
      })
      return;
    }

    //验证通过就保存身份证信息
    this.setData({
      loading: true
    })
    var idCard = {
      realName: realName,
      idCardNumber: idCardNumber,
      nation: nation,
      gender: gender,
      birthday: birthday,
      authority: authority,
      idCardStartTime: idCardStartTime,
      idCardEndTime: idCardEndTime,
      idCardAddress: idCardAddress,
      idCardImageFront: idCardImageFront,
      idCardImageBack: idCardImageBack,
      isCheck: "1",
      bankCardNumber:bankCardNum,
      bankCardName:realName,
      bankName:bankName
    }
    token.promoterAauth(app, idCard, this);
  },

  /**
   * 设置身份证正面
   */
  setFrontImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var frontId = res.tempFilePaths[0]
        that.setData({
          frontStatus: 1
        })

        var p = token.upload_file(app, frontId);
        p.then(imgRes => {
          var idCardImageFront = imgRes.data.content[0];
          that.setData({
            frontId: frontId,
            idCardImageFront: idCardImageFront,
            frontStatus:2
          });
          //解析身份证正面信息
          that.getOcrIdCard(idCardImageFront, 0);
        });
      },
    })
  },
  /**
   * 设置身份证反面
   */
  setBackImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var backId = res.tempFilePaths[0]
        that.setData({
          backStatus: 1
        })
        var p = token.upload_file(app, backId);
        p.then(imgRes => {
          var idCardImageBack = imgRes.data.content[0];
          that.setData({
            backId: backId,
            idCardImageBack: idCardImageBack,
            backStatus:2
          });
          //解析身份证正面信息
          that.getOcrIdCard(idCardImageBack, 1);
        });
      },
    })
  },
  /**
   * 放大身份证
   */
  // showImage: function (e) {
  //   var path = e.target.dataset.path;
  //   wx.previewImage({
  //     current: path,
  //     urls: [
  //       path
  //     ],
  //   })
  // },

  /**
   * ocr解析身份证信息
   */
  getOcrIdCard: function (idCardImage, idCardType) {
    var that = this;
    var p = token.getOcrIdCard(app, idCardImage, idCardType);
    p.then(function (res) {
      if (idCardType == 0) { //身份证正面
        that.setData({
          realName: res.data.content.realName,
          idCardNumber: res.data.content.idCardNumber,
          idCardAddress: res.data.content.idCardAddress,
          gender: res.data.content.gender,
          nation: res.data.content.nation,
          birthday: res.data.content.birthday,
          frontStatus: 3
        });
      } else if (idCardType == 1) {   //身份证反面
        that.setData({
          authority: res.data.content.authority,
          idCardStartTime: res.data.content.startDate,
          idCardEndTime:res.data.content.endDate,
          startTime: daytimer.formatTime3(res.data.content.startDate, 'yyyy-MM-dd'),
          endTime: daytimer.formatTime3(res.data.content.endDate, 'yyyy-MM-dd'),
          backStatus:3
        });
      }

    }).catch(function (res) {
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        let errmsg = res.data.errmsg;
        if(errmsg.indexOf("存在") > - 1) {
    //      errmsg = "身份证号已存在";
          that.setData({
            frontId: null,
            idCardImageFront: null,
            frontStatus: -1
          })
        } else if (idCardType == 0) {
          //身份证验证失败，请上传身份证原件
          errmsg = errmsg.indexOf("原件") > -1 ? "您提交的身份证不符合认证要求" :'您提交图片清晰度不符合要求,请重拍头像面';
          that.setData({
            frontId: null,
            idCardImageFront: null,
            frontStatus: -1
          })
        } else if (idCardType == 1) {
          //身份证验证失败，请上传身份证原件
          errmsg = errmsg.indexOf("原件") > -1 ? "您提交的身份证不符合认证要求" : '您提交图片清晰度不符合要求,请重拍国徽面';
          that.setData({
            backId: null,
            idCardImageBack: null,
            backStatus: -1
          })
        }
        wx.showModal({
          title: '错误提示',
          content: errmsg,
          showCancel: false
        })
      } else {
        // wx.showModal({
        //   title: '错误提示',
        //   content: '与服务器连接超时',
        //   showCancel: false
        // })
      }
      that.setData({
        loading: false
      })
    });
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
      if (backName != null) {
          that.setData({
              bankName: backName,
              bankName_old:'',
              bankName_new: backName
          })
      }
  },
  /**
   * 设置银行卡号
   */
  setbankNumber: function (e) {
      this.setData({
          bankCardNum: e.detail.value
      });
  },
})