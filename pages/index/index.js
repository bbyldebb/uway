Page({
  data: {
    imgUrls: [
      'https://gavindesign.com/wp-content/uploads/2020/10/20201011_003006_062.jpg',
      'http://jintangjiang.oss-cn-beijing.aliyuncs.com/images/5c2fd268db26d1745e76e0057064c64e52866a97.jpg',
      'https://img.zcool.cn/community/0138265c626ab0a801213f268394eb.jpg@1280w_1l_2o_100sh.jpg',
      'https://www1.pchouse.com.cn/sheji/datu3.jpg'
    ],
    showModal: false
  },
  toCustomer() {
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