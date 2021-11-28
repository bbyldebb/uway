// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "uway-cloud-4gyzvl8k4c9543a5"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();//目的：获取_openid
  return cloud.database().collection('orderItem')
    .doc(event._id)
    .update({
      data: {
        _openid: wxContext.OPENID,
        state: event.state
      }
    })
}