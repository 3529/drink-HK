// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: "drink-hk-1gws5hab86b8850a"
})
const db = cloud.database()
const user = db.collection('user')
// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const wxContext = cloud.getWXContext()
        const openid = wxContext.OPENID

        return user.where({
                openid
            })
            .get()
    } catch (e) {
        return {
            success: false,
            errMsg: e
        }
    }


}