// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    /**
     * @todo
     * @description 对传入的时间做计算，判断是否小于当前时间30秒
     */

    // ...



    // 实例化数据库
    const db = cloud.database()
    const push_record = db.collection('push_record')
    const push_queue = db.collection('push_queue')
    // push_record.where({
    //     openid
    // }).remove()
    // return

    // 查询是否存在未完成推送
    const res = await push_record
        .where({
            openid,
            finish: 0
        })
        .get()
        .then(res => {
            if (res.data.length > 0) {
                return {
                    msg: "请不要重复打卡哦",
                    code: "10001"
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
                    msg: "成功",
                    code: 0
                }
            }
        })

    console.log(res)
    return res

    // return new Promise((resolve, reject) => {
    //     // 查询是否存在未完成推送
    //     push_record
    //         .where({
    //             openid,
    //             finish: 0
    //         })
    //         .get()
    //         .then(res => {
    //             if (res.data.length > 0) {
    //                 resolve({
    //                     msg: "请不要重复打卡哦",
    //                     code: "10001"
    //                 })
    //             } else {
    //                 // 新增推送记录
    //                 push_record.add({
    //                         data: {
    //                             openid,
    //                             ...event,
    //                             createTime: db.serverDate(),
    //                             finish: 0 // 0 - 未推送， 1 - 已推送
    //                         }

    //                     })
    //                     .then(() => {
    //                         resolve({
    //                             msg: "新增成功",
    //                             code: 0
    //                         })
    //                     })
    //                 // 新增推送记录
    //                 push_queue.add({
    //                         data: {
    //                             openid,
    //                             ...event,
    //                             createTime: db.serverDate()
    //                         }

    //                     })
    //                     .then(() => {
    //                         resolve({
    //                             msg: "新增成功",
    //                             code: 0
    //                         })
    //                     })
    //             }
    //         })

    // })






}