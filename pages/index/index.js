Page({
  data: {
    imgUrls: [
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201612%2F28%2F20161228094651_NmkPj.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1643453266&t=bc07f84a7210056fa8bff197bd1072b9',
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01625e5bd67e20a8012099c808ff0e.jpg%402o.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1643453292&t=849f5f3414ef74b2394a53c217638c25',
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202005%2F02%2F20200502090907_xbiwr.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1643453209&t=730303d55daae9c663d7663cfac4e969',
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fci.xiaohongshu.com%2F6ef5d419-eb2a-21b3-b204-13753537e877%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fci.xiaohongshu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1643453091&t=0cd680fa373c68b8ab93076e54344815'
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