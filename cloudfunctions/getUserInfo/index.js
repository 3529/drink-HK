// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const user = db.collection('user')
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    user.where({
            openid
        })
        .get()
        .then(res => {
            if (!res.data.length) {
                // 用户不存在
                console.log('不存在')
                cloud.callFunction({
                    name: "addUser",
                    data: event,
                    success: addUserRes => {
                        console.log(addUserRes)
                    }
                })

            } else {
                // 用户已存在
                console.log('用户已存在')
                cloud.callFunction({
                    name: "updateUser",
                    data: event,
                    success: updateUser => {
                        console.log(updateUser)
                    },
                    fail:error=>{
                        console.log(error)
                    }
                    
                })

            }
        })

}