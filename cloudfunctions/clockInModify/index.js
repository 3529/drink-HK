// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const push_queue = db.collection('push_queue')
const push_record = db.collection('push_record')
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    const res = await push_queue.where({
        openid
    }).update({
        data: {
            pushTime: event.pushTime,
        }
    })
    await push_record.where({
        openid,
        finish: 0
    }).update({
        data: {
            pushTime: event.pushTime,
        }
    })
    if (res.errMsg === 'collection.update:ok') {
        return {
            msg: "修改成功",
            code: 0
        }
    } else {
        return {
            msg: "请稍后再试",
            code: 10002
        }
    }

    // return new Promise((resolve, reject) => {
    //     push_queue.where({
    //         openid,
    //         finish: 0
    //     }).update({
    //         pushTime: event.pushTime,
    //     }).then(() => {
    //         resolve({
    //             msg:"修改成功",
    //             code:0
    //         })
    //     })
    // })

}