// 云函数入口文件
const cloud = require('wx-server-sdk')

//cloud.init()
// 云函数入口文件

//cloud.init()
cloud.init({
    env:"uway-cloud-4gyzvl8k4c9543a5"
  })

  const db = cloud.database()
  const _ =db.command 
  const $ = db.command.aggregate  
// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection('table').get()

}
