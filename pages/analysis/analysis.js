// pages/analysis/analysis.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sourceVideoUrl: '',
    finallyUrl:'',
    autosize: {
      maxHeight: "200rpx",
      minHeight: "150rpx"
    },
    showVideo: false
  },
  removeWatermark() {
    wx.showLoading({
      title: '解析中',
    })
    wx.cloud.callFunction({
      name:"removeWatermark",
      data:{
        url:this.data.sourceVideoUrl
      },
      success: res => {
        console.log(res)
        if (res.result.state === 200) {
          this.setData({
            showVideo:true,
            finallyUrl:"https:" + res.result.data.url
          })
        }
      },
      complete:()=>{
        wx.hideLoading()
      }
    })
    // wx.request({
    //   url: 'http://39.100.240.28:3000/analysis',
    //   data: {
    //     url: this.data.sourceVideoUrl
    //   },
    //   method: 'GET',
    //   success: res => {
    //     console.log(res)
    //     if (res.data.state === 200) {
    //       this.setData({
    //         showVideo:true,
    //         finallyUrl:"https:" + res.data.data.url
    //       })
    //     }
    //   },
    //   complete:()=>{
    //     wx.hideLoading()
    //   }
    // })
  },
  handleVideoUrlChange(event) {
    console.log(event)
    this.setData({
      sourceVideoUrl: event.detail
    })
  },
  handleDownload(e) {
    let link = e.currentTarget.dataset.link;
    let fileName = new Date().valueOf();
    wx.downloadFile({
      url: link,
      filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.mp4',
      success: res => {
        console.log(res);
        let filePath = res.filePath;
        wx.saveVideoToPhotosAlbum({
          filePath,
          success: file => {
            wx.showToast({
              title: '下载成功',
              icon: 'success',
              duration: 2000
            })
            let fileMgr = wx.getFileSystemManager();
            fileMgr.unlink({
              filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.mp4',
              success: function (r) {

              },
            })
          },
          fail: err => {
            console.log(err)
            if (err.errMsg === 'saveVideoToPhotosAlbum:fail auth deny') {
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success: data => {
                  wx.openSetting({
                    success(settingdata) {
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限成功,再次点击下载即可保存',
                          showCancel: false,
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          showCancel: false,
                        })
                      }
                    },
                  })
                }
              })
            }
          }
        })
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