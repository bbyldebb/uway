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
      from: "table",
      localField: "referTable",
      foreignField: "_id",
      // pipeline: $.pipeline()
      //   .group({
      //     _id: null,
      //     referTable: '$referTable'
      //   }).done(),
      as: 'table'
    })
    .match({
      _id:event.id
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$table', 0]), '$$ROOT'])
    })
    .project({
      _id: 0,
      ID: 1
    })
    .end()

    return temp



}
