// 云函数入口文件
const cloud = require('wx-server-sdk')

//cloud.init()
cloud.init({
  env: "uway-cloud-4gyzvl8k4c9543a5"
})
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('orderItem')
    .aggregate()
    .match({
      state: _.neq('4')
    })
    .lookup({
      from: 'dish',
      foreignField: 'ID',
      localField: 'referDish',
      as: 'dish_detail'
    }).lookup({
      from: 'order',
      foreignField: '_id',
      localField: 'referOrder',
      as: 'orderdetail'
    }).replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$dish_detail', 0]), $.arrayElemAt(['$orderdetail', 0]), '$$ROOT'])
    })
    .project({
      ID: 1,
      name: 1,
      description: 1,
      price: 1,
      number: 1,
      orderTime: 1,
      state: 1
    })
    .sort({
      'orderTime': 1
    })
    .end()
}