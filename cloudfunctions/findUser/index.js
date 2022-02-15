// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env:"drink-hk-1gws5hab86b8850a"
})

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const db = cloud.database()
    const user = db.collection('user')
    return new Promise((resolve, reject) => {
        user.where({
                openid
            })
            .get()
            .then(res => {
                console.log('findUser === > ', res)
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })

}