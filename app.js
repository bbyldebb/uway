// app.js
App({
  onLaunch() {
    console.log('UWAY启动')
   //云开发环境初始化
   wx.cloud.init({
     env:"uway-cloud-4gyzvl8k4c9543a5",
     traceUser:'true'
   })
  }
})
