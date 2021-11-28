Page({
  data: {
    imgUrls: [
      'https://gavindesign.com/wp-content/uploads/2020/10/20201011_003006_062.jpg',
      'https://img.zcool.cn/community/0138265c626ab0a801213f268394eb.jpg@1280w_1l_2o_100sh.jpg',
      'https://www1.pchouse.com.cn/sheji/datu3.jpg'
    ],
    showModal: false
  },
  toCustomer() {
    var p1 = new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          resolve(res)
        }
      })
    }),
    var p2 = new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: res => {
          resolve(res)
        }
    }),
    // 同时执行p1和p2，并在它们都完成后执行then
    Promise.all([p1, p2]).then((results) => {
      // results是一个长度为2的数组，放置着p1、p2的resolve
      this.handleUserInfo({
        // 这里也可以选择性返回需要的字段
        ...results[0],
        ...results[1]
      })
    })
  },

  // 组织好后端需要的字段，并调用接口
  handleUserInfo(data) {
    console.log(data);
    console.log(data.code);
    wx.redirectTo({
      url: '/pages/customer/customer',
    })

  },

  toStaff() {
    this.setData({
      showModal: true
    });
  }

})