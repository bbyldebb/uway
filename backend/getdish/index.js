// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "uway-cloud-4gyzvl8k4c9543a5"
})

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('dish').where({
    ID: event.ID,//根据传入的菜品ID查询名字
    state: _eq(2) //只查询已上架的菜品
  }).get()
}