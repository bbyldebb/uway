const DISH = wx.cloud.database().collection("dish")
Component({
  //组件属性列表
  properties: {
    //是否显示modal弹窗
    show: {
      type: Boolean,
      value: false
    },
    dishID: {
      type: String,
      value: ""
    }
  },

  //组件数据
  data: {
    dishName: "",
    dishImg: "",
    dishSold: "",
    dishDsc: "",
    dishPrice: ""
  },
  //组件初始化渲染
  pageLifetimes: {
    show: function () {
      console.log(this.properties.show)
      console.log(this.properties.dishID)
      var that = this;
      DISH.where({
        ID: that.data.dishID
      }).get({
        success: function (res) {
          that.setData({
            dishName: res.data[0].name,
            dishImg: res.data[0].image,
            dishSold: res.data[0].soldNum,
            dishDsc: res.data[0].description,
            dishPrice: res.data[0].price
          })
        }
      })
    },
  },
  //组件方法
  methods: {
    // 点击取消按钮的回调函数
    cancel() {
      this.setData({
        show: false
      })
    }
  }
})