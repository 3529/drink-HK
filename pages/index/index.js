// index.js
import moment from 'moment'
Page({
  data: {
    helpShow: false,
    clockInShow: false,
    clockInModifyShow: false,
    intake: 100,
    currentIndex: 0,
    clockTimes: [],
    waitPushData: {},
    isClockIn: false,
    todayWaterIntake:0
  },
  changeCurrentIndex(event) {
    this.setData({
      currentIndex: event.currentTarget.dataset.index
    })
  },
  showHelp() {
    this.setData({
      helpShow: true
    })
    wx.hideTabBar({
      animation: true,
    })
  },
  closeHelp() {
    this.setData({
      helpShow: false
    })
    wx.showTabBar({
      animation: true,
    })
  },
  /**
   * 打卡, 弹出对话框,选择本次饮水量/选择下次提醒时间
   */
  showClockIn() {
    this.initClockTimes()
    
    this.setData({
      clockInShow: true
    })
    wx.hideTabBar({
      animation: true,
    })
  },
  closeClockIn() {
    this.setData({
      clockInShow: false
    })
    wx.showTabBar({
      animation: true,
    })
  },
  showClockInModify() {
    this.initClockTimes()

    this.setData({
      clockInModifyShow: true
    })
    wx.hideTabBar({
      animation: true,
    })
  },
  closeClockInModify() {
    this.setData({
      clockInModifyShow: false
    })
    wx.showTabBar({
      animation: true,
    })
  },

  /**
   * 滑块拖动事件
   */
  sliderDrag(e) {
    let val
    if (!isNaN(e.detail)) {
      val = e.detail
    } else {
      val = e.detail.value
    }
    if (val >= 400) {
      wx.showToast({
        title: '下次记得少量多次哦',
        icon: "none"
      })
    }
    this.setData({
      intake: val
    })
  },
  subscribe() {
    wx.requestSubscribeMessage({
      tmplIds: ['saOql9w0lBzlMb44InDzuAxoidoT24MyHEPEdfhFYgI'],
      success: res => {
        if (res.saOql9w0lBzlMb44InDzuAxoidoT24MyHEPEdfhFYgI === 'accept') {
          this.clockIn('clockIn')
        }
      }
    })
  },
  modifySubscribe() {
    wx.requestSubscribeMessage({
      tmplIds: ['saOql9w0lBzlMb44InDzuAxoidoT24MyHEPEdfhFYgI'],
      success: res => {
        if (res.saOql9w0lBzlMb44InDzuAxoidoT24MyHEPEdfhFYgI === 'accept') {
          this.clockIn('clockInModify')
        }
      }
    })
  },
  clockIn(cloudFunctionName) {
    wx.showLoading({
      title: '请稍等',
      mask: true
    })
    let clockInData = {
      intake: this.data.intake,
      pushTime: this.data.clockTimes[this.data.currentIndex]
    }
    wx.cloud.callFunction({
      name: cloudFunctionName,
      data: clockInData,
      success: res => {
        if (res.result.code !== 0) {
          wx.showToast({
            title: res.result.msg,
            icon: "none" 
          })
        } else {
          console.log(cloudFunctionName)
          setTimeout(() => {
            wx.showToast({
              title: (cloudFunctionName === 'clockIn') ? '打卡成功' : "修改成功",
            })
          }, 200)
          this.closeClockIn()
          this.closeClockInModify()
        }
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        this.getClockInState()
        wx.hideLoading()
      }
    })
  },
  sendMessage() {
    wx.cloud.callFunction({
      name: "templateMessageSend",
      success: res => {
        wx.showToast({
          title: '推送成功',
        })
        this.getClockInState()
      }
    })
  },
  defineReactive(data, key, val, fn) {
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function () {
        return val
      },
      set: function (newVal) {
        if (newVal === val) return
        fn && fn(newVal)
        val = newVal
      },
    })
  },

  watch(ctx, obj) {
    Object.keys(obj).forEach(key => {
      this.defineReactive(ctx.data, key, ctx.data[key], function (value) {
        obj[key].call(ctx, value)
      })
    })
  },
  getClockInState() {
    wx.cloud.callFunction({
      name: "getClockInState",
      success: res => {
        console.log(res)
        this.setData({
          todayWaterIntake:res.result.todayWaterIntake
        })
        if (res.result.clockInData.length) {
          this.setData({ 
            waitPushData: res.result.clockInData[0],
            isClockIn: true
          })
        } else {
          this.setData({ 
            isClockIn: false
          })
        }
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        // wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  showClockInTip() {
    wx.showModal({
      title: "温馨提示",
      content: "您已经设置好提醒时间了哦，要修改吗?",
      confirmText: "去修改",
      confirmColor: "#0B67FF",
      cancelText: "不用",
      success: res => {
        console.log(res)
        if (res.confirm) {
          this.showClockInModify()
        }
      }
    })
  },
  //  初始化时间列表
  initClockTimes() {
    this.clockTimes = []
    // 获取当前 时
    let currentH = Number(moment(new Date()).format("H"))
    // 获取当前 分
    let currentM = Number(moment(new Date()).format("m"))
    // 对分进行取整或取半
    currentM = currentM >= 30 ? 30 : 0
    console.log(currentH, currentM)
    let timesArr = []
    for (let i = currentH; i <= 24; i++) {
      if (currentH === i && currentM === 0) {
        timesArr.push(i + ':30')
        continue
      }
      if (currentH === i && currentM === 30) continue
      if (timesArr.length >= 9) break
      if (i === 24) i = 0
      timesArr.push(i + ':00')
      timesArr.push(i + ':30')
    } 
    console.log(timesArr)
    this.setData({
      clockTimes: timesArr
    })

  },
  onPullDownRefresh() {
    // wx.showLoading({
    //   title: '加载中',
    // })
    this.getClockInState()
  },
  onLoad() {


    wx.setBackgroundColor({
      backgroundColor: '#76DAFF',
    })
    this.watch(this, {
      intake: function (newVal) {
        wx.vibrateShort({
          type: "heavy"
        })

      }
    })
  },
  onShow() {
    this.getClockInState()
  }
})