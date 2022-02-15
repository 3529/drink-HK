// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const push_queue = db.collection('push_queue')
const push_record = db.collection('push_record')
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  const openid = event.openid
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      "touser": openid, // 通过 getWXContext 获取 OPENID
      "page": 'index',
      "lang": 'zh_CN',
      "data": {
        "thing1": {
          "value": "饮水时间到啦，请您记得适量饮水。"
        },
        "character_string3": {
          "value": '300ml'
        }
      },
      "templateId": 'saOql9w0lBzlMb44InDzuAxoidoT24MyHEPEdfhFYgI',
      "miniprogramState": 'developer'
    })
    await push_queue.where({
      openid
    }).remove()
    
    await push_record.where({
      openid,
      finish: 0
    }).update({
      data: {
        finish: 1
      }
    })
    // result 结构
    // { errCode: 0, errMsg: 'openapi.templateMessage.send:ok' }
    return result
  } catch (err) {
    // 错误处理
    // err.errCode !== 0
    throw err
  }
}