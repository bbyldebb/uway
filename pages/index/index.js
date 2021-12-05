const CUSTOMER = wx.cloud.database().collection("customer")
Page({
  data: {
    imgUrls: [
      'https://gavindesign.com/wp-content/uploads/2020/10/20201011_003006_062.jpg',
      'https://img.zcool.cn/community/0138265c626ab0a801213f268394eb.jpg@1280w_1l_2o_100sh.jpg',
      'https://www1.pchouse.com.cn/sheji/datu3.jpg'
    ],
    showModal: false,
    nickName: '',
    avatarUrl: '',
    openId: ''
  },
  toCustomer() {
    var that = this;
    //获取用户授权
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: res => {
        //获取用户的 nickName 和 avatarUrl
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
        //调用云函数获取用户的openId
        wx.cloud.callFunction({
          name: 'getOpenID',
          complete: res => {
            that.setData({
              openId: res.result.openId
            })
            //查询用户的openId，若表中没有则添加记录
            CUSTOMER.where({
              openId: that.data.openId
            }).get({
              success: function (res) {
                if (res.data.length == 0) {
                  CUSTOMER.add({
                    data: {
                      avatarUrl: that.data.avatarUrl,
                      nickName: that.data.nickName,
                      openId: that.data.openId
                    },
                    success: function (res) {
                      wx.showToast({
                        title: '欢迎光临UWAY',
                        icon: 'success',
                        duration: 500
                      });
                      setTimeout(function () {
                        wx.redirectTo({
                          url: '/pages/customer/customer',
                        })
                      }, 500)
                    }
                  });
                } else {
                  wx.showToast({
                    title: '欢迎老顾客回家',
                    icon: 'success',
                    duration: 500
                  });
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '/pages/customer/customer',
                    })
                  }, 500)
                }
              }
            });
          }
        })
      }
    })
  },
  toStaff() {
    this.setData({
      showModal: true
    });
  }
})