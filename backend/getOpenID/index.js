// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "uway-cloud-4gyzvl8k4c9543a5"
})

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取code、userInfo等信息
  wx.cloud.callFunction({
      name: 'getOpenID',
    })
    .then(res => {
      console.log('云函数获取orderItem数据', res.result)
    })
    .catch(res => {
      console.log('云函数获取orderItem数据成功', res)
    })

  var p1 = new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        resolve(res)
      }
    })
  })
  var p2 = new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: res => {
        resolve(res)
      }
    })
  })
  // 同时执行p1和p2，并在它们都完成后执行then
  Promise.all([p1, p2]).then((results) => {
    // results是一个长度为2的数组，放置着p1、p2的resolve
    this.handleUserInfo({
      // 这里也可以选择性返回需要的字段
      ...results[0],
      ...results[1]
    })
  })
  //return cloud.database().collection("orderItem").get();
};