// pages/capital/capital.js
const app = getApp();
const utils = require("../../utils/verify.js");
const token = require("../../utils/token.js");
const page = require("../../utils/page.js");
const util = require("../../utils/util.js");
const utilsPara = require('../../utils/uiparams.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    width: '',
    status:'2',
    backNum:"银行卡卡号000",
    leftMoney:'333',
    detail: [],
    home_menu_data: null,
    backgroundUrl:'',
    moreFiltrate: false,
    typeList: [
      /*{ code: "", type: "全部", isSelected: true },
      { code: "11", type: "任务佣金", isSelected: false },
      { code: "14", type: "分佣佣金", isSelected: false },
      { code: "17", type: "佣金提现", isSelected: false },
      { code: "13", type: "评价佣金", isSelected: false },
      { code: "20", type: "投诉扣款", isSelected: false },
      { code: "12", type: "管理员操作", isSelected: false }*/
    ],
    itemCode: "",
    financeItemCode: "",
    typeName: "全部",
    light: "0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      height: app.globalData.screenHeight,
      width: app.globalData.screenWidth,
      capital: token.returnFloat(app.globalData.moneys.earnAmount)
    })
    //
    var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
    var params = utilsPara.getUiParam(mydata);
    if (params) {
      this.setData({
        home_menu_data: params,
      })
      var title = params.home_0002 + "账户";
      wx.setNavigationBarTitle({
        title: title,
      });
    }
    var users = app.globalData.user;
    if (users != null && users != '') {
    	// token.getFeeWithdraw(app);
      this.setData({
        user: users
      })
    } else {
      if (wx.getStorageSync("user") != null || wx.getStorageSync("user") != '') {

      } else {
        console("capital222跳转注册页面")
    	 wx.reLaunch({
             url: '/pages/login/register2',
           })
        return;
    }
    }
    // token.getToken(app);
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
    var that = this;
    that.setData({
      tasklist: [],
      index: 1,
      size: 6,
      commission: token.returnFloat(app.globalData.moneys.earnCoin),
    })
    var users = app.globalData.user;
    if (users != null && users != '') {
      this.setData({
        user: users
      })
    } else {
      // utils.verify();
    }
    that.findFinance();
    that.getUserinfo();
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
    var that = this;
    that.findFinance();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //重置
  reset(){
      this.setData({
          itemCode: "",
          typeName:"全部"
      })
      var item = this.data.typeList[0];
      item.isSelected = true;
      console.log(this.data.typeList)
      this.setData({
          typeList: this.data.typeList
      })
      for(var i=1;i<this.data.typeList.length;i++){
          var item = this.data.typeList[i];
          item.isSelected = false;
          console.log(this.data.typeList)
          this.setData({
              typeList: this.data.typeList
          })
      }
  },
  //根据类型查询
  typeSelect(){
      this.setData({
          tasklist: [],
          index: 1,
          size: 6,
          financeItemCode: this.data.itemCode,
          moreFiltrate: false
      })
      this.findFinance();
  },
  getUserinfo: function() {
      var userinfo=app.globalData.user
      //判断用户类型
      if(userinfo.identity==1 && userinfo.bindStatus == 2){//师傅
          this.setData({
              typeList:[
                  {code:"",type:"全部",isSelected: true},
                  {code:"11",type:"本金返现",isSelected: false},
                  {code:"16",type:"本金提现",isSelected: false},
                  {code:"20",type:"投诉扣款",isSelected: false},
                  {code:"12",type:"管理员操作",isSelected: false}
              ]
          })
      }else{//徒弟
          this.setData({
              typeList: [
                  {code:"",type:"全部",isSelected: true},
                  {code:"11",type:"本金返现",isSelected: false},
                  {code:"16",type:"本金提现",isSelected: false},
                  {code:"20",type:"投诉扣款",isSelected: false},
                  {code:"12",type:"管理员操作",isSelected: false}
              ]
          })
      }
  },
  selectByType() {
      var moreFiltrate = !this.data.moreFiltrate
      this.setData({
          moreFiltrate: moreFiltrate
      })
  },
  choseType(e) {
    var index = e.currentTarget.dataset.id;
    var code = e.currentTarget.dataset.code;
    var type = e.currentTarget.dataset.type;
      if(index==0){
          var item = this.data.typeList[0];
          item.isSelected = true;
          console.log(this.data.typeList)
          this.setData({
              typeList: this.data.typeList
          })
          for(var i=1;i<this.data.typeList.length;i++){
              var item = this.data.typeList[i];
              item.isSelected = false;
              console.log(this.data.typeList)
              this.setData({
                  typeList: this.data.typeList
              })
          }
      }else {
          var item = this.data.typeList[0];
          item.isSelected = false;
          console.log(this.data.typeList)
          this.setData({
              typeList: this.data.typeList
          })
          var item = this.data.typeList[index];
          item.isSelected = !item.isSelected;
          console.log(this.data.typeList)
          this.setData({
              typeList: this.data.typeList
          })
      }

    console.log(index)
    console.log(code)
    if(code==null || code==""){
        this.setData({
            itemCode: "",
            typeName:"全部"
        })
    }else {
        if(this.data.typeName=="全部"){
            this.setData({
                typeName:""
            })
        }
        console.log("itemCode="+this.data.itemCode)
        var a=this.data.itemCode.indexOf(code)
        console.log("a="+a)

        if(a == -1) {
            var code1= this.data.itemCode + "," + code
            this.setData({
                itemCode: code1,
                typeName: this.data.typeName+ type+"/"
            })
        }else{
            var code2=this.data.itemCode.replace(","+code,'')
            this.setData({
                itemCode: code2,
                typeName: this.data.typeName.replace(type+"/",'')
            })
        }
    }
  },
  findFinance: function () {
    var that = this;
    var p = token.refresh(app);
    p.then(function (res) {
      return page.getSearchAllMoneyNew(app,that.data.financeItemCode,2, that.data.index, that.data.size);
    }).then(function (data) {
      //判断是否有数据，有则取数据  
      if (data.content.records.length != 0) {
        let searchList = that.data.tasklist;
        var tasklist = data.content.records;
        if (tasklist.length < 6) {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          })
        } else {
          that.setData({
            searchLoading: true   //把"上拉加载"的变量设为true  
          })
        }
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        searchList == null ? searchList = tasklist : searchList = that.data.tasklist.concat(tasklist);
        var earnFees = token.returnFloat(app.globalData.moneys.earnAmount);
        for (var i = 0; i < searchList.length; i++) {
          if (searchList[i].tradingType == 3) {
            var card = searchList[i].payeeAccount;
            searchList[i].card = card.substr(card.length - 4);
          }
          searchList[i].gmtTime = util.formatTime(new Date(searchList[i].gmtCreate));
          var coinChange = parseFloat(searchList[i].coinChange);
          var amountChange = parseFloat(searchList[i].amountChange);
          var amount_change = parseFloat(searchList[i].amount_change);
          if (amountChange != 0) {
            searchList[i].amount = token.returnFloat(amountChange);
            if (searchList[i].amount > 0) {
              searchList[i].amount = '+' + searchList[i].amount;
            }
          }else{
            searchList[i].amount = 0;
          }
          if (coinChange != 0 && amountChange != 0) {
            var countAll = coinChange + amountChange;
            if (countAll > 0) {
              countAll = token.returnFloat(countAll);
              searchList[i].countAll = '+' + countAll;
            }
          } else if (coinChange==0){
            searchList[i].amount = token.returnFloat(searchList[i].rejectAmount);
          }
          
          searchList[i].current_amount = earnFees - that.countTotalFee(searchList,i);
          var num = searchList[i].current_amount;
          searchList[i].current_amount = num.toFixed(2);
          if (amountChange != 0) {
            searchList[i].amount_change = amountChange;
          }
        }
        // for (var i = 0; i < searchList.length;i++){
        //   if (searchList[i].financeItemCode == "20"){
        //     searchList.splice(i,1)
        //   }
        // }
        that.setData({
          tasklist: searchList, //获取数据数组
          index: that.data.index + 1,
        });
        
        // app.globalData.usermessagesize = searchList.length
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        });
      }
    }).catch(function (res) {
      
      if (res != null && res.data != null && res.data.errmsg!=null) {
        token.refreshPage(res, that);
      } 
      that.setData({
        searchLoadingComplete: true, //把“没有数据”设为true，显示  
        searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
      });
    });
  },

//计算余额
  countTotalFee(data, index){
    var total =0;
    for(var i =0;i<index;i++ ){
      total = total + data[i].amountChange;
    }
    return total;
  },

  /**
   * 跳转到页面详情
   */
  navToDetails: function (e) {
   
    var that = this;
    var id = e.currentTarget.dataset.id;
    var ids = that.data.tasklist[id].id;
    var financeCode = that.data.tasklist[id].financeItemCode;
    var amount_change = null;
    if (financeCode != null && financeCode == 16) {
      amount_change = that.data.tasklist[id].amount_change;
    }
    wx.navigateTo({
      url: '../moneydetail/moneydetail?typeid=2&&id=' + ids + "&amount_change=" + "&&typeIndex=0",
    })
  }
})