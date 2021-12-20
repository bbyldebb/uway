// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "uway-cloud-4gyzvl8k4c9543a5",
  traceUser: "true"
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('comment').add({
    data: {
      commentContent: event.commentContent,
      commentPhoto: event.CommentPhoto,
      commentTime: event.CommentTime,
      referCustomer: event.referCustomer,
      referOrder: event.referOrder,
      star_dish: event.star_dish,
      star_restaurant: event.star_restaurant,
      star_waiter: event.star_waiter
    },
  })

}