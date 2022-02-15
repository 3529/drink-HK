// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const push_queue = db.collection('push_queue')
const push_record = db.collection('push_record')
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    const clockInData = await push_queue.where({
            openid
        })
        .field({
            createTime: true,
            intake: true,
            pushTime: true,

        })
        .get()

    //  获取当天水摄入量
    var today_date = new Date(); //获取Date对象
    today_date.setHours(0); //设置小时
    today_date.setMinutes(0); //设置分钟
    today_date.setSeconds(0); //设置秒
    today_date.setMilliseconds(0); //设置毫妙

    // 查询当天已打卡数据
    const todayData = await push_record.where({
            openid,
            createTime: _.gte(today_date),
            finish: 1
        })
        .get()
    const todayIntakeArr = todayData.data.map((item) => item.intake)
    let todayWaterIntake = 0
    // 计算当天饮水总量
    if (todayIntakeArr.length) {
        todayWaterIntake = todayIntakeArr.reduce((total, intake) => total + intake)
    }
    return {
        clockInData: clockInData.data,
        todayWaterIntake
    }
}