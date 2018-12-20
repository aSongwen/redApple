const app = getApp();
const page = require('../../utils/page.js');
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 10,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    height:'',
    width:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      height: app.globalData.screenHeight,
      width: app.globalData.screenWidth
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
    this.setData({
      searchPageNum: 1,   //第一次加载，设置1
      isFromSearch: true,  //第一次加载，设置true  
      searchLoading: true,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })
    this.searchTitle();
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
  //查询公告
  searchTitle:function(){
    var that = this;
    // var t = util.formatTime(new Date());

    var notic = page.getSearchMusic(app, that.data.searchPageNum, that.data.callbackcount);
    notic.then(function (data) {
      //判断是否有数据，有则取数据  
      if (data.content.records != 0) {
        
        let searchList = [];
        var notics = data.content.records;
        if(notics.length < 10){
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          })
        }else{
          that.setData({
            searchLoading: true   //把"上拉加载"的变量设为true  
          })
        }
        for (var i = 0; i < notics.length; i++) {
          notics[i].gmtTime = util.formatTime(new Date(notics[i].gmtCreate));
        }
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = notics : searchList = that.data.notics.concat(notics)
        that.setData({
          notics: searchList, //获取数据数组
          size: searchList.length
        });
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        });
      }
    }).catch(function (res) {
      if (res!=null && res.data!=null && res.data.errmsg != null) {
        token.refreshPage(res, that);
      } 
    });
  },
  //滚动到底部触发事件  
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      that.searchTitle();
    }
  },
  /**
   * 页面跳转
   */
  navTo:function(e){
    var i = e.currentTarget.dataset.data;
    var notics = this.data.notics[i];
    wx.navigateTo({
      url: './detail/detail?id=' + notics.id,
    })
  }
})