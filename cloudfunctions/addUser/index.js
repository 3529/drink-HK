// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const user = db.collection('user')
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 查询 openid，得到结果对象
    const _user = user.where({
      openid: event.openid
    })


    // 查询结果为空的情况下，新增用户
    _user
      .get()
      .then(res => {
        if (!res.data.length) {
          return user.add({
            data: {
              ...event
            }
          })
        } else {
          // 更新用户信息
          _user.update({
            data: {
              ...event
            }
          })
        }
      })
  } catch (e) {
    return {
      success: false,
      errMsg: e
    }
  }

}