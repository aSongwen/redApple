// pages/login/taobao/Auditing/Auditing.js
const app = getApp();
const util = require('../../../../utils/daytimer.js');
const token = require('../../../../utils/token.js')
const utilsPara = require('../../../../utils/uiparams.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        screen_height:'',
        screen_width:'',
        is_show:true,
        last_format:'',
        orderCode:'',
        retrytime:1,
        shokeyStatus:-1,
        backgroundUrl:'',
        taskAuditMode:2,
        taskFlowType:null,
        executePrice:null
    },

    toHome:function(){
        wx.switchTab({
            url: '../task',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.menu_data){
            var mydata = { uiparas: app.globalData.menu_data, requi: 'home_' };
            var params = utilsPara.getUiParam(mydata);
            if (params) {
                this.setData({
                    home_menu_data: params,
                })
            }
        }


        var res = wx.getSystemInfoSync();
        this.setData({
            screen_height: res.windowHeight,
            screen_width: app.globalData.screenWidth,
            orderCode: app.globalData.orderCode,
            time:options.time,
            user:app.globalData.user,
            retrytime: options.retrytime,
            shokeyStatus: options.shokeyStatus,
            taskAuditMode: options.taskAuditMode,
            taskFlowType: options.taskFlowType,
            executePrice: options.executePrice
        })
        console.log(options.taskAuditMode);
        console.log("==========="+options.retrytime);
        // util.clockTime(this);
        util.clockTime_2(this);
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

    }
})