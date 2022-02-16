// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const push_queue = db.collection('push_queue')
const push_record = db.collection('push_record')
// 云函数入口函数
exports.main = async (event, context) => {
    try {
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
                success: true,
                errMsg: "ok"
            }
        } else {
            return {
                success: false,
                errMsg: "请稍后再试"
            }
        }

    } catch (e) {
        return {
            success: false,
            errMsg: e
        }
    }
}