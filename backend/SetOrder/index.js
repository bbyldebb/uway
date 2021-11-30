// 云函数入口文件
const cloud = require('wx-server-sdk')

// cloud.init()
cloud.init({
  env: "uway-cloud-4gyzvl8k4c9543a5",
  traceUser: "true"
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {

  const temp=await db.collection('order').aggregate()
    .lookup({
      from: "orderItem",
      localField: "_id",
      foreignField: "referOrder",
      as: 'order'
    })
    .match({
      referTable:event.id
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$order', 0]), '$$ROOT'])
    })
    // .project({
    //   _id: 0,
    //   referOrder:1,
    //   state:1
    // })
    .end()

    return temp



}
