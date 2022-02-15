// pages/loading/loading.js
var app = getApp(); //写在页面顶部page()外

Page({
  handleAuth(userInfoArr) {
    if (userInfoArr.length) {
      wx.setStorageSync('userInfo', userInfoArr[0])
      app.globalData.avatarUrl = userInfoArr[0].avatarUrl
      app.globalData.nickname = userInfoArr[0].nickName
      wx.reLaunch({
        url: '../index/index',
      })
    }else{
      wx.reLaunch({
        url: '../guide/guide',
      })
    }
    wx.hideLoading()
  },
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: "findUser",
      success: res => {
        console.log('findUser res', res)
        this.handleAuth(res.result.data)
      }
    })
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