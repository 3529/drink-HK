// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  const options = {
    uri: 'http://39.100.240.28:3000/analysis',
    method: "GET",
    qs: {
      url: event.url
    }
  }
  const res = await rp(options)
  return JSON.parse(res)
}