// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const user = db.collection('user')

// 云函数入口函数
exports.main = async (event, context) => {

  user.where({
      openid: event.openid
    })
    .update({
      data: event
    })
}