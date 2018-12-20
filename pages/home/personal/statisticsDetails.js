const app = getApp();
const token = require("../../../utils/token.js");
const daytimer = require('../../../utils/daytimer.js');
const utilsPara = require('../../../utils/uiparams.js');

Page({
  data: {
    example:{
      page: 1,
      limit: 20,
      promoterId: null,    //推手id
      realStartTimeStart: null,      //接单时间起
      realStartTimeEnd:null      //接单时间至
    },
    promoter: {},   //推手信息
    taskList: [],    //任务列表
    total:0,         //总数
    date:null,        //当前选中时间
    dateView:null,    //当前选中时间'x年x月'格式
    endTime: new Date(),      //时间控件选择范围结束
    home_menu_data:null,
    date2:null,
    taskTab:0,
  },

  /**
   * 加载
   */
  onLoad: function (options) {
    let example = this.data.example;
    example.promoterId = options.promoterId;
    this.data.taskTab=options.taskTab;
/*  this.setData({
      example: example
    }); */
      var d = new Date()
      d.setMonth(d.getMonth()-2);
      var getYear =d.getFullYear()
      var getMonth2 = d.getMonth();
      var date2 = getYear + '-' + getMonth2;
      this.setData({
          date2: date2
      });
    this.bindDateChange({
      detail:{
        value: options.date
      }
    });
  },

  /**
   * 加载
   */
  onShow: function () {
    if (app.globalData) {
      var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
      var params = utilsPara.getUiParam(mydata);
      if (params) {
        this.setData({
          home_menu_data: params,
        })
      }
    }
    //加载推手信息
    this.getPromoter();
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  
  onPullDownRefresh: function () {
    this.getFirstTaskList();
  },*/

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //有下一页就查询
    if (this.data.taskList.length < this.data.total) {
      this.data.example.page++;
      this.getTaskList();
    }
  },

  /**
   * 获取推手信息
   */
  getPromoter() {
    var me = this;
    token.getPromoter(app, me.data.example.promoterId).then(res => {
      me.setData({
        promoter: res.data.content
      });
    });
  },

  /**
   * 获取第一页任务列表
   */
  getFirstTaskList() {
    let example = this.data.example;
    example.page = 1;
    this.setData({
      example: example,
      taskList: []
    });
    this.getTaskList();
  },

  /**
   * 获取任务列表
   */
  getTaskList() {
    let me = this;
    if(me.data.taskTab==0){
      token.getTaskList(app, me.data.example).then(res => {
        let data = res.data.content;
        let list = data.records;
        for (let i = 0; i < list.length; i++){
          list[i].realStartTime = daytimer.formatTime3(list[i].realStartTime, 'yyyy-MM-dd');
        }

        //合并数组
        let taskList = me.data.taskList.concat(list);
        me.setData({
          taskList: taskList,
          total: data.total
        });
      });
    }else{
        token.flowQueryMini(app, me.data.example).then(res => {
            let data = res.data.content;
        let list = data.records;
        for (let i = 0; i < list.length; i++){
            list[i].realStartTime = daytimer.formatTime3(list[i].realStartTime, 'yyyy-MM-dd');
        }

        //合并数组
        let taskList = me.data.taskList.concat(list);
        me.setData({
            taskList: taskList,
            total: data.total
        });
    });
    }
  },

  /**
   * 选择日期
   */
  bindDateChange: function (e) {
    let date = e.detail.value;
    let example = this.data.example;
    //获取当前月开始于结束时间
    let array = daytimer.getMonthScope(date);
    example.realStartTimeStart = array[0];
    example.realStartTimeEnd = array[1];
    this.setData({
      date: date,
      dateView: date.replace("-", "年") + "月",
      // example: example
    })
    this.getFirstTaskList();
  },

})
