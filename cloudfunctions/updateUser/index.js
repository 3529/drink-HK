// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
/**
 * ? 更新用户信息
 * ! 此方法仅用于云函数之间调用，未做 openid 校验
 */
exports.main = async (event, context) => {
  const db = cloud.database()
  const user = db.collection('user')
  user.where({
      openid: event.openid
    })
    .update({
      data: event
    })
}