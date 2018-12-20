// pages/home/personal/statistics.js
const app = getApp();
const token = require("../../../utils/token.js");
const utilsPara = require('../../../utils/uiparams.js');

Page({
  data: {
    taskTab:0,//0-销量任务，1-流量任务
    hiddenLoading: false,
    currentTab: 0, //当前tab
    currentMonth: null,
    currentMonths: null,
    preMonth: null,
    getYears: null,
    getRefereeMoney: null,
    getRefereeSum: null,
    taskCompleted: [],
    showContact: false,
    moreScreening: true,
    isScroll: true,
    date: '',
    date1: '',
    date2: '',
    inputValue: '',
    totalChose: false,
    background: false,
    showModal: false,
    totalShow: true,
    searchList: {
      date: null,
      promoteKeyWord: "",
      pageIndex: 1,
      pageSize: 20
    },
    searchLoading: false,  //上拉加载
    NoData: false,       //没有数据
    warning: false,
    total: null,
    home_menu_data: null,
  },
  // onHide:function(){
  //   var searchList=this.data.searchList
  //     searchList.pageIndex=1
  //     this.setData({
  //        searchList:searchList,
  //     })  
  // },
    //任务切换
    swichTab: function (e) {
        var that = this;
        if (that.data.taskTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                taskTab: e.target.dataset.current
            })
        };
        that.selectVolume()
    },

//tab切换查询销量任务
selectVolume: function () {
    var getYear = new Date().getFullYear()
    var getCurMonth = this.data.currentMonth
    this.data.searchList.promoteKeyWord = '';
    this.getTime(getYear, getCurMonth)
    var searchList = this.data.searchList;
    searchList.pageIndex = 1
    this.setData({
        currentMonth: new Date().getMonth() + 1,
        currentMonths: new Date().getMonth() + 1,
        getYears: new Date().getFullYear(),
        filtrateTab: false,
        totalShow: true,
        searchList: searchList,
        taskCompleted: [],
        hiddenLoading: false
    })
    wx.setStorage({
        key: "time",
        data: this.data.searchList.date
    })
    this.getRefereeMoney().then(() => {
        this.loadData()
    })
},
  swichNav: function (e) {
    var getYear = new Date().getFullYear()
    var getCurMonth = this.data.currentMonth
    var getPreMonth = this.data.preMonth
    this.data.searchList.promoteKeyWord = '';
    if (e.target.dataset.current == 0) {
      this.getTime(getYear, getCurMonth)
      var searchList = this.data.searchList;
      searchList.pageIndex = 1
      this.setData({
        currentMonth: new Date().getMonth() + 1,
        currentMonths: new Date().getMonth() + 1,
        getYears: new Date().getFullYear(),
        filtrateTab: false,
        totalShow: true,
        searchList: searchList,
        taskCompleted: [],
        hiddenLoading: false
      })
      wx.setStorage({
        key: "time",
        data: this.data.searchList.date
      })
    } else if (e.target.dataset.current == 1) {
      this.getTime(getYear, getPreMonth)
      var searchList = this.data.searchList
      searchList.pageIndex = 1
      this.setData({
        preMonth: new Date().getMonth(),
        currentMonths: new Date().getMonth(),
        getYears: new Date().getFullYear(),
        filtrateTab: false,
        totalShow: true,
        searchList: searchList,
        taskCompleted: [],
        hiddenLoading: false
      })
      wx.setStorage({
        key: "time",
        data: this.data.searchList.date
      })

    }
    this.setData({
      currentTab: e.target.dataset.current,
    })
    this.getRefereeMoney().then(() => {
      this.loadData()
    })
  },
  //显示筛选弹窗、重置
  filtrate: function (e) {
    var getYear = new Date().getFullYear()
    var getMonth = new Date().getMonth() + 1;
      if (getMonth < 10) {
          getMonth ="0" + getMonth;
      }
    var date = getYear + '-' + getMonth;
      var d = new Date()
      d.setMonth(d.getMonth()-2);
      var getYear =d.getFullYear()
      var getMonth2 = d.getMonth();
      var date2 = getYear + '-' + getMonth2;
    this.setData({
      isScroll: false,
      moreScreening: false,
      totalChose: false,
      inputValue: '',
      date: date,
      date1: date,
      date2:date2
    })
    console.log(this.data.date)
  },
  //提交筛选
  submit: function () {
    let search = this.data.inputValue;
    this.data.searchList.promoteKeyWord = search;
    if (this.data.totalChose) {
      this.data.searchList.date = '';
      var totalShow = false
    } else {
      var year = new Date(this.data.date).getFullYear();
      var month = new Date(this.data.date).getMonth() + 1;
      if (month < 10) {
        month ="0" + month;
      }
      this.data.searchList.date = new Date(this.data.date).getTime();
      var totalShow = true;
      this.setData({
        getYears: year,
        currentMonths: month
      })
      wx.setStorage({
        key: "time",
        data: this.data.searchList.date
      })
    }
    this.data.searchList.pageIndex = 1;
    this.data.searchList.pageSize = 20;
    this.setData({
      moreScreening: true,
      totalShow: totalShow,
      filtrateTab: true,
      currentTab: 2,
      taskCompleted: [],
      hiddenLoading: false
    })
    this.getRefereeMoney().then(() => {
      this.loadData()
    })
      console.log(this.data.date)
  },
  //隐藏筛选弹窗
  hide: function (e) {
    this.setData({
      isScroll: true,
      moreScreening: true,
    })
  },
  goDetails: function (e) {
    let date = this.data.getYears + "-" + this.data.currentMonths;
    let promoterId = e.currentTarget.dataset.promoterId;
    wx.navigateTo({
      url: '/pages/home/personal/statisticsDetails?promoterId=' + promoterId + '&date=' + date+'&taskTab='+this.data.taskTab,
    });
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      totalChose: false
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  isChose: function (e) {
    this.setData({
      totalChose: (!this.data.totalChose),
      date: ''
    })
    console.log(this.data.date)
  },
  onLoad: function () {
    if (app.globalData) {
      var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
      var params = utilsPara.getUiParam(mydata);
      if (params) {
        this.setData({
          home_menu_data: params,
        })
      }
    }
    var year = new Date().getFullYear()
    //获取当月日期
    this.setData({
      currentMonth: new Date().getMonth() + 1,
      currentMonths: new Date().getMonth() + 1,
      preMonth: new Date().getMonth(),
      getYears: new Date().getFullYear(),
    })
    this.getTime(this.data.getYears, this.data.currentMonth);
    //统计列表查询
    this.getRefereeMoney().then(() => {
      this.queryFirst()
    })
  },
  /**
* 页面上拉触底事件的处理函数
*/
  onReachBottom: function () {
    if (this.data.taskCompleted.length < this.data.total) {
      var searchList = this.data.searchList
      searchList.pageIndex = searchList.pageIndex++
      this.setData({
        searchList: searchList,
        NoData: false, //把“没有数据”设为true，显示  
        searchLoading: true,  //把"上拉加载"的变量设为false，隐藏 
      })
      this.loadData();
    } else {
      this.setData({
        searchLoading: false,
        NoData: true,//把"暂无数据"的变量设为false 
      })
    }
  },

  hideModal: function () {
    this.setData({
      background: false,
      showModal: false,
    });
  },
  export: function () {
    this.setData({
      background: true,
      showModal: true,
    })
  },
  //获取第一页数据
  queryFirst: function () {
    var that = this;
    var searchList = that.data.searchList
    searchList.pageIndex = 1
    this.setData({
      searchList: searchList,
      taskCompleted: []
    });
    console.log(this.data.searchList)
    this.getDate()
  },
  getDate:function(){
    var that = this
    wx.getStorage({
      key: 'time',
      success: function (res) {
        console.log(res)
        console.log("月份下标" + that.data.currentTab)
        if (res.data == "" && that.data.current == 0) {
          that.getTime(that.data.getYears, that.data.currentMonth);
        } else {
          that.getTime(that.data.getYears, res.data);
        }
      }
    })
    console.log("获取时间数据" + that.data.currentMonth)
    console.log(this.data.searchList)
    console.log(typeof (this.data.searchList.date))
    that.loadData()
  },
  //加载数据
  loadData: function () {
    var that = this
    console.log(this.data.searchList)
    if(that.data.taskTab==0){
      var p = token.getCountreferee(app, this.data.searchList).then(res => {
      //判断是否有数据
      if (res.data.content != null) {
        var task = this.data.taskCompleted;
        var taskList = res.data.content.records;
        var searchList = this.data.searchList
        searchList.pageIndex = this.data.searchList.pageIndex + 1;
        searchList.promoteKeyWord = ""
        //分页加载
        task == null ? task = taskList : task = this.data.taskCompleted.concat(taskList);
        if (this.data.totalShow == false) {
          this.data.searchList.date = '';
        }
        this.setData({
          taskCompleted: task,
          searchList: searchList,
          total: res.data.content.total,
          hiddenLoading: true
        })

        //进度条与颜色
        for (var i = 0; i < task.length; i++) {
          var item = task[i];
          var random = Math.floor(Math.random() * 1000000)
          if (random.toString().length != 6) {
            random = "0d8d67"
          }
          item.pc = '#' + random;
          if ((item.pc).substr(0, 2) == "#f") {
            item.pc = "#333333"
          }
          var sum = task[0].taskNum
          var percent = (Number(item.taskNum) / Number(sum)) * 100
          item.percent = percent
        }

        this.setData({
          taskCompleted: task
        })

      } else {
        this.setData({
          NoData: true, //把“没有数据”设为true，显示
          searchLoading: false,  //把"上拉加载"的变量设为false，隐藏
          taskCompleted: []
        })
      }


    });
    }else{
        var p = token.countApprenticeFlowTask(app, this.data.searchList).then(res => {
            //判断是否有数据
            if (res.data.content != null) {
            var task = this.data.taskCompleted;
            var taskList = res.data.content.records;
            var searchList = this.data.searchList
            searchList.pageIndex = this.data.searchList.pageIndex + 1;
            searchList.promoteKeyWord = ""
            //分页加载
            task == null ? task = taskList : task = this.data.taskCompleted.concat(taskList);
            if (this.data.totalShow == false) {
                this.data.searchList.date = '';
            }
            this.setData({
                taskCompleted: task,
                searchList: searchList,
                total: res.data.content.total,
                hiddenLoading: true
            })

            //进度条与颜色
            for (var i = 0; i < task.length; i++) {
                var item = task[i];
                var random = Math.floor(Math.random() * 1000000)
                if (random.toString().length != 6) {
                    random = "0d8d67"
                }
                item.pc = '#' + random;
                if ((item.pc).substr(0, 2) == "#f") {
                    item.pc = "#333333"
                }
                var sum = task[0].taskNum
                var percent = (Number(item.taskNum) / Number(sum)) * 100
                item.percent = percent
            }

            this.setData({
                taskCompleted: task
            })

        } else {
            this.setData({
                NoData: true, //把“没有数据”设为true，显示
                searchLoading: false,  //把"上拉加载"的变量设为false，隐藏
                taskCompleted: []
            })
        }


    });
    }
  },
  //转换时间
  getTime: function (year, month) {
    var searchList = this.data.searchList
    var data = null;
    if (month < 10) {
      data = year + "-0" + month;
    } else {
      data = year + '-' + month;
    }
    searchList.date = new Date(data).getTime()

    this.setData({
      searchList: searchList
    })
  },
  getRefereeMoney: function () {
    if(this.data.taskTab==0) {
      return token.getRefereeMoney(app, this.data.searchList).then(res => {
        if(res.data.success){
        if (res.data.content != null) {
            this.setData({
                getRefereeMoney: res.data.content.totalCoin,
                getRefereeSum: res.data.content.totalCount
            })
        } else {
            this.setData({
                getRefereeMoney: 0,
                getRefereeSum: 0
            })
        }
        }
      })
    }else{
      return token.countFlowTaskData(app, this.data.searchList).then(res=> {
        if(res.data.success){
        if (res.data.content != null) {
            this.setData({
                getRefereeMoney: res.data.content.totalCoin,
                getRefereeSum: res.data.content.totalCount
            })
        } else {
            this.setData({
                getRefereeMoney: 0,
                getRefereeSum: 0
            })
        }
        }
      })
    }
  },
  //关闭复制链接的弹窗
  onCancel: function () {
    this.setData({
      showModal: false,
      background: false
    })

  },
  //复制链接
  copyLink: function () {
    var token = app.globalData.access_token
    var urlLink = app.globalData.all_url.location_url
    var url="";
    if(this.data.taskTab==0) {
        url = urlLink + '/pbs/api/promoter/export_referee_invate_task_data?access_token=' + token
    }else{
        url = urlLink + '/pbs/api/promoter/export_apprentice_flow_task_data?access_token=' + token
    }
    wx.setClipboardData({
      data: url,
    })
    wx.showToast({
      title: '复制成功',
      icon: 'success',
      duration: 2000
    })
    this.onCancel()
  }
})
