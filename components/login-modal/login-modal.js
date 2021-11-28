const STAFF = wx.cloud.database().collection("staff")
Component({
  //组件属性列表
  properties: {
    //是否显示modal弹窗
    show: {
      type: Boolean,
      value: false
    }
  },

  //组件数据
  data: {
    staffID: "",
    pwd: ""
  },

  //组件方法
  methods: {
    inputID(e) {
      this.setData({
        staffID: e.detail.value
      });
    },
    inputPwd(e) {
      this.setData({
        pwd: e.detail.value
      });
    },
    // 点击取消按钮的回调函数
    cancel() {
      this.setData({
        show: false,
        staffID: "",
        pwd: ""
      })
    },
    // 点击确定按钮的回调函数
    confirm() {
      var that = this
      STAFF.where({
        ID: that.data.staffID,
        password: that.data.pwd
      }).get({
        success: function (res) {
          if (res.data.length != 0) {
            var type = res.data[0].type;
            var staffID = that.data.staffID;
            that.setData({
              show: false,
              staffID: "",
              pwd: ""
            });
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 500
            });
            setTimeout(function () {
              wx.redirectTo({
                url: `/pages/` + type + `/` + type + `?staffID=${staffID}`,
              })
            }, 500)
          } else {
            wx.showToast({
              title: '工号或密码错误',
              icon: 'error',
              duration: 1000
            })
          }
        }
      });
    }
  }
})