// 云函数入口文件
const cloud = require('wx-server-sdk')
const moment = require('moment')
cloud.init()

const db = cloud.database()
const push_queue = db.collection('push_queue')


// 云函数入口函数
exports.main = async (event, context) => {
  console.log('执行成功')
  // 获取当前 时
  let currentH = Number(moment(new Date()).format("H"))
  // 获取当前 分
  let currentM = Number(moment(new Date()).format("m"))
  // 对分进行取整或取半
  currentM = currentM >= 30 ? 30 : "00"
  console.log(`${currentH}:${currentM}`)
  push_queue.where({
    pushTime: `${currentH}:${currentM}`
  })
  .get()
  .then(res=>{
    for(let i = 0, len = res.data.length; i < len; i++){
      cloud.callFunction({
        name:"subscribeMessageSend",
        data:{
          openid:res.data[i].openid
        },
        success:sendSuccessResult=>{
          console.log(sendSuccessResult)
          return sendSuccessResult
        },
        fail:err=>{
          console.log(err)
          return err
        },
        complete:res=>{
          return console.log('===》完成')
        }
      })
    }
  })

}