Page({
  data: {
    address: '地址地址'
  },
  onLoad() {
    // 尝试连接数据库，似乎失败了
    wx.cloud.database().collection('restraunt')
      .get({
        success(res) {
          this.address = res[1].data.data.address
          console.log(this.address)
        },
        fail(error) { }
      })
  },
  toCustomer() {
    wx.navigateTo({
      url: '/pages/customer/customer',
    })
  },
  toCook() {
    wx.navigateTo({
      url: '/pages/cook/cook',
    })
  },
  toManager() {
    wx.navigateTo({
      url: '/pages/manager/manager',
    })
  }
})