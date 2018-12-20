// pages/commission/commission.js
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
    height:'',
    width:'',
    commission:0,
    detail: [],
    home_menu_data: null,
    backgroundUrl:'',
    financeRecordList: [],//流水列表
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
      typeTask: [
          {code:"1",type:"下单任务",isSelected: true},
          {code:"2",type:"浏览任务",isSelected: false},
      ],
    itemCode: "",
    financeItemCode: "",
    typeName: "全部",
    light: "0",
    typeIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      height: app.globalData.screenHeight,
      width: app.globalData.screenWidth, 
    })
    var users = app.globalData.user;
    if (users != null && users != '') {
      this.setData({
        user: users
      })
    } else {
      // utils.verify();
    }
    //
    var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
    var params = utilsPara.getUiParam(mydata);
    if(params){
      this.setData({
        home_menu_data: params,
      })
      var title = params.home_0001 + "明细";
      wx.setNavigationBarTitle({
        title: title,
      });
    }

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
      financeRecordList:[],
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

     that.showType(that.data.typeIndex)
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
          financeRecordList: [],
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
                  {code:"11",type:"下单佣金",isSelected: false},
                  {code:"14",type:"下单分佣佣金",isSelected: false},
                  {code:"17",type:"佣金提现",isSelected: false},
                  {code:"13",type:"评价佣金",isSelected: false},
                  {code:"20",type:"投诉扣款",isSelected: false},
                  {code:"12",type:"管理员操作",isSelected: false}
              ]
          })
      }else{//徒弟
          this.setData({
              typeList: [
                  {code:"",type:"全部",isSelected: true},
                  {code:"11",type:"下单佣金",isSelected: false},
                  {code:"13",type:"评价佣金",isSelected: false},
                  {code:"17",type:"佣金提现",isSelected: false},
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
    choseType1(e) {
        this.setData({
            index:1,
            itemCode: "",
            typeName:"全部",
            financeItemCode:"",
        })
        var userinfo=app.globalData.user
        var index = e.currentTarget.dataset.id;
        var code = e.currentTarget.dataset.code;
        var type = e.currentTarget.dataset.type;
        if(index==0){
            var item = this.data.typeTask[0];
            item.isSelected = true;
            console.log(this.data.typeTask)
            this.setData({
                typeTask: this.data.typeTask
            })
            for(var i=1;i<this.data.typeTask.length;i++){
                var item = this.data.typeTask[i];
                item.isSelected = false;
                console.log(this.data.typeTask)
                this.setData({
                    typeTask: this.data.typeTask
                })
            }
            //判断用户类型
            if(userinfo.identity==1 && userinfo.bindStatus == 2) {//师傅
                this.setData({
                    typeIndex: 0,
                    typeList: [
                        {code: "", type: "全部", isSelected: true},
                        {code: "11", type: "下单佣金", isSelected: false},
                        {code: "14", type: "下单分佣佣金", isSelected: false},
                        {code: "17", type: "佣金提现", isSelected: false},
                        {code: "13", type: "评价佣金", isSelected: false},
                        {code: "20", type: "投诉扣款", isSelected: false},
                        {code: "12", type: "管理员操作", isSelected: false}
                    ]
                })
            }else{
                this.setData({
                    typeIndex: 0,
                    typeList: [
                        {code: "", type: "全部", isSelected: true},
                        {code: "11", type: "下单佣金", isSelected: false},
                        {code: "17", type: "佣金提现", isSelected: false},
                        {code: "13", type: "评价佣金", isSelected: false},
                        {code: "20", type: "投诉扣款", isSelected: false},
                        {code: "12", type: "管理员操作", isSelected: false}
                    ]
                })
            }
        }else {
            var item = this.data.typeTask[0];
            item.isSelected = false;
            console.log(this.data.typeTask)
            this.setData({
                typeTask: this.data.typeTask
            })
            var item = this.data.typeTask[index];
            item.isSelected = !item.isSelected;
            console.log(this.data.typeTask)
            this.setData({
                typeTask: this.data.typeTask
            })
            //判断用户类型
            if(userinfo.identity==1 && userinfo.bindStatus == 2) {//师傅
                this.setData({
                    typeIndex: 1,
                    typeList: [
                        {code: "", type: "全部", isSelected: true},
                        {code: "5", type: "浏览佣金", isSelected: false},
                        {code: "10", type: "浏览分佣佣金", isSelected: false},
                        {code: "12", type: "管理员操作", isSelected: false}
                    ]
                })
            }else {
                this.setData({
                    typeIndex: 1,
                    typeList: [
                        {code: "", type: "全部", isSelected: true},
                        {code: "5", type: "浏览佣金", isSelected: false},
                        {code: "12", type: "管理员操作", isSelected: false}
                    ]
                })
            }
        }
        //this.findFinance();
    },

    showType(indextype) {

        var userinfo=app.globalData.user
        if(indextype==0){
            if(userinfo.identity==1 && userinfo.bindStatus == 2) {//师傅
                this.setData({
                    typeIndex: 0,
                    typeList: [
                        {code: "", type: "全部", isSelected: true},
                        {code: "11", type: "下单佣金", isSelected: false},
                        {code: "14", type: "下单分佣佣金", isSelected: false},
                        {code: "17", type: "佣金提现", isSelected: false},
                        {code: "13", type: "评价佣金", isSelected: false},
                        {code: "20", type: "投诉扣款", isSelected: false},
                        {code: "12", type: "管理员操作", isSelected: false}
                    ]
                })
            }else{
                this.setData({
                    typeIndex: 0,
                    typeList: [
                        {code: "", type: "全部", isSelected: true},
                        {code: "11", type: "下单佣金", isSelected: false},
                        {code: "17", type: "佣金提现", isSelected: false},
                        {code: "13", type: "评价佣金", isSelected: false},
                        {code: "20", type: "投诉扣款", isSelected: false},
                        {code: "12", type: "管理员操作", isSelected: false}
                    ]
                })
            }
        }else {
            //判断用户类型
            if(userinfo.identity==1 && userinfo.bindStatus == 2) {//师傅
                this.setData({
                    typeIndex: 1,
                    typeList: [
                        {code: "", type: "全部", isSelected: true},
                        {code: "5", type: "浏览佣金", isSelected: false},
                        {code: "10", type: "浏览分佣佣金", isSelected: false},
                        {code: "12", type: "管理员操作", isSelected: false}
                    ]
                })
            }else {
                this.setData({
                    typeIndex: 1,
                    typeList: [
                        {code: "", type: "全部", isSelected: true},
                        {code: "5", type: "浏览佣金", isSelected: false},
                        {code: "12", type: "管理员操作", isSelected: false}
                    ]
                })
            }
        }
        //this.findFinance();
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
  findFinance:function(){
    var that = this;
    var p = token.refresh(app);
    p.then(function(res){
        if(that.data.typeIndex==0) {
          return page.getSearchAllMoneyNew(app,that.data.financeItemCode,1, that.data.index, that.data.size);
        }else {
          return page.queryFlowFinanceRecord(app, that.data.financeItemCode, 1, that.data.index, that.data.size);
        }
    }).then(function (data) {
      //判断是否有数据，有则取数据  
      if (data.content.records.length != 0) {
        let searchList = that.data.financeRecordList;
        var records = data.content.records;
        if (records.length < 6) {
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
        searchList == null ? searchList = records : searchList = that.data.financeRecordList.concat(records);

        var earnFees = token.returnFloat(app.globalData.moneys.earnCoin);

        for (var i = 0; i < searchList.length; i++) {
          if (searchList[i].tradingType == 3) {
            var card = searchList[i].payeeAccount;
            searchList[i].card = card.substr(card.length - 4);
          }
          searchList[i].gmtTime = util.formatTime(new Date(searchList[i].gmtCreate));
          var coinChange = parseFloat(searchList[i].coinChange);
          var coin_change = parseFloat(searchList[i].coin_change);
          var amountChange = parseFloat(searchList[i].amountChange);
          if (coinChange != 0){
            searchList[i].coin = token.returnFloat(coinChange);
            if (searchList[i].coin > 0){
              searchList[i].coin = '+' + searchList[i].coin;
            }
          } else if (coin_change != 0){
            searchList[i].coin = '+' + coin_change;
          }
         

          
          // searchList[i].current_amount = earnFees - (i) * searchList[i].coin;
          searchList[i].current_amount = earnFees - that.countFees(searchList,i);
          var num = searchList[i].current_amount;
          searchList[i].current_amount = num.toFixed(2);
        }
       
        that.setData({
          financeRecordList: searchList, //获取数据数组
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

    findFinance:function(){
        var that = this;
        var p = token.refresh(app);
        p.then(function(res){
            if(that.data.typeIndex==0) {
                return page.getSearchAllMoneyNew(app, that.data.financeItemCode, 1, that.data.index, that.data.size);
            }else {
                return page.queryFlowFinanceRecord(app, that.data.financeItemCode, 1, that.data.index, that.data.size);
            }
        }).then(function (data) {
            //判断是否有数据，有则取数据
            if (data.content.records.length != 0) {
                let searchList = that.data.financeRecordList;
                var records = data.content.records;
                if (records.length < 6) {
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
                searchList == null ? searchList = records : searchList = that.data.financeRecordList.concat(records);

                var earnFees = token.returnFloat(app.globalData.moneys.earnCoin);

                for (var i = 0; i < searchList.length; i++) {
                    if (searchList[i].tradingType == 3) {
                        var card = searchList[i].payeeAccount;
                        searchList[i].card = card.substr(card.length - 4);
                    }
                    searchList[i].gmtTime = util.formatTime(new Date(searchList[i].gmtCreate));
                    var coinChange = parseFloat(searchList[i].coinChange);
                    var coin_change = parseFloat(searchList[i].coin_change);
                    var amountChange = parseFloat(searchList[i].amountChange);
                    if (coinChange != 0){
                        searchList[i].coin = token.returnFloat(coinChange);
                        if (searchList[i].coin > 0){
                            searchList[i].coin = '+' + searchList[i].coin;
                        }
                    } else if (coin_change != 0){
                        searchList[i].coin = '+' + coin_change;
                    }



                    // searchList[i].current_amount = earnFees - (i) * searchList[i].coin;
                    searchList[i].current_amount = earnFees - that.countFees(searchList,i);
                    var num = searchList[i].current_amount;
                    searchList[i].current_amount = num.toFixed(2);
                }

                that.setData({
                    financeRecordList: searchList, //获取数据数组
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
countFees(data,index){
  var total = 0;
  for(var i = 0 ;i<index;i++){
    total = total + data[i].coinChange;
  }
  return total;
},


  /**
   * 跳转到页面详情
   */
  navToDetails:function(e){
    
    var that = this;
    var id = e.currentTarget.dataset.id;
    var ids = that.data.financeRecordList[id].id;
    var financeCode = that.data.financeRecordList[id].financeItemCode;
    var typeIndex = that.data.typeIndex;

    var coin_change = null;
    if(financeCode != null && financeCode == 17){
      coin_change = that.data.financeRecordList[id].coin_change;
    }
    wx.navigateTo({
      url: '../moneydetail/moneydetail?typeid=1&&id=' + ids + "&&coin_change=" + coin_change+"&&typeIndex="+typeIndex,
    })
  }
})