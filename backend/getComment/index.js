// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "uway-cloud-4gyzvl8k4c9543a5"
})
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('comment')
    .aggregate()
    .match({
      referCustomer: _.neq('')
    })
    .lookup({
      from: 'customer',
      foreignField: 'openId',
      localField: 'referCustomer',
      as: 'customer_info'
    }).replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$customer_info', 0]), '$$ROOT'])
    })
    .sort({
      'commentTime': -1
    })
    .end()

}