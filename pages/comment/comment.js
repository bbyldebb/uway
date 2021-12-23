// pages/comment/comment.js
Page({
  data: {
    imgshow: false,
    commentContent: "",
    CommentPhoto: "",
    CommentTime: "",
    referCustomer: "",
    referOrder: "",
    star_dish: "",
    star_restaurant: "",
    star_waiter: "",
    imgurl: "",
    input: "",
    bgImg: "../../static/img/dark.png",
    bgfImg: "../../static/img/bright.png",
    dishstars: [{
        flag: 1,
      },
      {
        flag: 1,
      },
      {
        flag: 1,
      },
      {
        flag: 1,
      },
      {
        flag: 1,
      },
    ],
    reststars: [],
    waiterstars: []
  },
  onLoad: function (options) {
    this.setData({
      reststars: this.data.dishstars,
      waiterstars: this.data.dishstars,
      referCustomer: options.referCustomer
    })
  },
  chooseImage() {
    let that = this
    //选择要上传的图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.uploadImg(res.tempFilePaths[0])

      }
    })
  },
  deleteimg(e) {
    wx.cloud.deleteFile({
      fileList: [this.data.imgurl],
      success: res => {},
      fail: err => {
        console.log(err);
        // handle error
      }
    })
    this.setData({
      imgshow: false,
      imgurl: "",
    })

  },
  uploadImg(tempFile) {
    var random = new Date().getTime();
    wx.cloud.uploadFile({
      cloudPath: random + '.jpg',
      filePath: tempFile,
      success: res => {
        this.setData({
          imgurl: res.fileID,
          imgshow: true
        })
      },
      fail(err) {
        console.log('fail', res)

      }
    })
  },
  formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },

  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  async formSubmit(e) {
    var time = this.formatTime(new Date());
    this.setData({
      imgshow: false,
      commentContent: e.detail.value.input,
      CommentPhoto: this.data.imgurl,
      CommentTime: time,
      imgurl: "",
      input: "",
    })
    await wx.cloud.callFunction({
      name: 'addComment',
      data: {
        commentContent: this.data.commentContent,
        CommentPhoto: this.data.CommentPhoto,
        CommentTime: this.data.CommentTime,
        referCustomer: this.data.referCustomer,
        referOrder: this.data.referOrder,
        star_dish: this.data.star_dish,
        star_restaurant: this.data.star_restaurant,
        star_waiter: this.data.star_waiter
      }
    }).then(res => {}).catch(res => {
      console.log('云函数添加comment数据失败', res)
    })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.onLoad(prevPage.options);
    wx.navigateBack({});

  },
  score: function (e) {
    var that = this;
    for (var i = 0; i < that.data.dishstars.length; i++) {
      var allItem = 'dishstars[' + i + '].flag';
      that.setData({
        [allItem]: 1
      })
    }
    var index = e.currentTarget.dataset.index;

    for (var i = 0; i <= index; i++) {
      var item = 'dishstars[' + i + '].flag';
      that.setData({
        [item]: 2
      })
    }
    this.setData({
      star_dish: (index + 1).toString()
    })
  },
  score1: function (e) {
    var that = this;
    for (var i = 0; i < that.data.reststars.length; i++) {
      var allItem = 'reststars[' + i + '].flag';
      that.setData({
        [allItem]: 1
      })
    }
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i <= index; i++) {
      var item = 'reststars[' + i + '].flag';
      that.setData({
        [item]: 2
      })
    }
    this.setData({
      star_restaurant: (index + 1).toString()
    })
  },
  score2: function (e) {
    var that = this;
    for (var i = 0; i < that.data.waiterstars.length; i++) {
      var allItem = 'waiterstars[' + i + '].flag';
      that.setData({
        [allItem]: 1
      })
    }
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i <= index; i++) {
      var item = 'waiterstars[' + i + '].flag';
      that.setData({
        [item]: 2
      })
    }
    this.setData({
      star_waiter: (index + 1).toString()
    })
  },

})