// pages/my/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickname: '',
    days:26
  },
  clockInLog(){
    wx.navigateTo({
      url: '../clog/clog',
    })
  },
  logout() {
    wx.showModal({
      content: "确认要离我而去吗？>_<",
      success: (valid) => {
        if (valid.confirm) {
          wx.clearStorageSync()
          wx.reLaunch({
            url: '../guide/guide',
          })
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      avatarUrl: app.globalData.avatarUrl,
      nickname: app.globalData.nickname
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