var is_login_success = false;
var verify = function(){
  wx.showModal({
    title: '未登录',
    content: '您还未登录，请登录后在进行此操作',
    confirmText:'前往登录',
    cancelText:'取消',
    success:function(res){
      if(res.confirm){
        console.log("登录1")
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }else{
        wx.switchTab({
          url: '/pages/home/home',
        })
      }
    }
  })
}

module.exports = {
  verify: verify
}