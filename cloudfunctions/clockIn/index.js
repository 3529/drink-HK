// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const push_record = db.collection('push_record')
const push_queue = db.collection('push_queue')

// 云函数入口函数
exports.main = async (event, context) => {

    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    /**
     * @todo
     * @description 对传入的时间做计算，判断是否小于当前时间30秒
     */

    // ...

    // 查询是否存在未完成推送
    try {
        return await push_record
            .where({
                openid,
                finish: 0
            })
            .get()
            .then(res => {
                if (res.data.length > 0) {
                    return {
                        success: false,
                        errMsg: '请不要重复打卡哦'
                    }
                } else {
                    // 新增推送记录
                    push_record.add({
                        data: {
                            openid,
                            ...event,
                            createTime: db.serverDate(),
                            finish: 0 // 0 - 未推送， 1 - 已推送
                        }

                    })
                    // 新增推送记录
                    push_queue.add({
                        data: {
                            openid,
                            ...event,
                            createTime: db.serverDate()
                        }

                    })
                    return {
                        success: true,
                        errMsg: 'ok'
                    }
                }
            })
    } catch (e) {
        return {
            success: false,
            errMsg: e
        }
    }

}