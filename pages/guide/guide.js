// pages/guide/guide.js
var app = getApp(); //写在页面顶部page()外

Page({
    
    /**
     * 页面的初始数据
     */
    data: {

    },
    getUserInfo() {
        var that = this;
        wx.getUserProfile({
            desc: "用于获取您的头像等信息",
            success: function (resInfo) {
                wx.showLoading({
                  title: '请等待',
                })
                // 透过云函数，获取解密后的用户数据
                wx.cloud.callFunction({
                    name: 'weRun', 
                    data: {
                        userInfoData: wx.cloud.CloudID(resInfo.cloudID)
                    },
                    success: function (res) {
                        // 解密后的用户数据
                        const uinfo = res.result.event.userInfoData.data
                     
                        // 查询并注册用户
                        wx.cloud.callFunction({
                            name: "getUserInfo",
                            data: {
                                ...uinfo,
                                openid: res.result.openid
                            },
                            success: res => {
                                console.log(res)
                            }
                        })

                        // 将用户信息存入全局变量
                        app.globalData.avatarUrl = uinfo.avatarUrl
                        app.globalData.nickname = uinfo.nickName
                        // console.log(app)
                        wx.hideLoading()
                        // 登录成功，跳转至首页
                        wx.switchTab({
                            url: '../index/index',
                        })
                    }
                })
            },
            fail: error => {
                // 授权失败逻辑
                console.log(error)
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})