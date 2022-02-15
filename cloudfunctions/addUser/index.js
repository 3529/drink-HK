// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  /**
   * 校验 event 传入的 openid 云函数间调用，无法获取getWXContext中的OPENID
   */
  if (!event.openid) {
    return {
      msg: "openid不合法",
      code: "-1"
    }
  }

  /**
   * 获取数据库实例
   * 获取集合引用
   */
  const db = cloud.database()
  const user = db.collection('user')

  /**
   * 查询 openid，得到结果对象
   */
  const _user = user.where({
    openid: event.openid
  })


  /**
   * 查询结果为空的情况下，新增用户
   */
  
  _user
    .get()
    .then(res => {
      console.log(res)
      if (!res.data.length) {
        return user.add({
          data: {
            ...event
          }
        })
      } else {


        /**
         * 更新用户信息
         */

        _user.update({
          data: {
            ...event
          }
        })


      }
    })



}