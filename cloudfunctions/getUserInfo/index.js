// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    // console.log(event)

    const openid = wxContext.OPENID
    if (openid !== event.openid) {
        return {
            msg: "openid不合法",
            code: "-1",
            function:"getUserInfo"
        }
    }

    console.log(event)
    const db = cloud.database()
    const user = db.collection('user')
    user.where({
            openid
        })
        .get()
        .then(res => {
            console.log(res)
            
            if (!res.data.length) {
                console.log('不存在')
                // 用户不存在
                cloud.callFunction({
                    name: "addUser",
                    data: event,
                    success: addUserRes => {
                        console.log(addUserRes)
                    }
                })

            } else {
                console.log('用户已存在')
                // 用户已存在
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