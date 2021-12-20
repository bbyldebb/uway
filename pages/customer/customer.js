Page({
  data: {
    menuClass: [],
    menuDetail: [],
    comment: [],
    curnav: '全部菜品',
    cuvindex: 0,
    bgImg: "../../utils/dark.png",
    bgfImg: "../../utils/bright.png",
    allstars: [],
    originstars: [{
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
    referCustomer: "",
  },
  onLoad(options) {
    var that = this
    const db = wx.cloud.database()
    const _ = db.command
    const $ = db.command.aggregate
    //云函数获取数据
    //云函数获取菜品数据：
    wx.cloud.callFunction({
        name: 'getdish',
      }).then(res => {
        this.setData({
          menuDetail: res.result.data,
          curindex: 0,
          curnav: "全部菜品"
        })
        let dishclass = new Set();
        dishclass.add("全部菜品")
        for (var i = 0; i < res.result.data.length; i++) {
          dishclass.add(that.data.menuDetail[i].class)
        }

        dishclass = Array.from(dishclass)
        dishclass = {
          ...dishclass
        }
        this.setData({
          menuClass: dishclass,
        })
      })
      .catch(res => {
        console.log('error', res)
      })
    //云函数获取评论数据：
    wx.cloud.callFunction({
        name: 'getComment',
      }).then(res => {
        this.setData({
          comment: res.result.list,
        })
        // star：
        for (let i = 0; i < that.data.comment.length; i++) {
          this.dishstars(i);
          this.reststars(i);
          this.waiterstars(i);
        }
      })
      .catch(res => {
        console.log('error', res)
      })

  },
  dishstars(m) {
    var that = this;
    var dataArr = [];
    var ds = that.data.comment[m].star_dish
    for (var i = 0; i < ds; i++) {
      var dataObj = {}; //在里面定义对象
      dataObj.flag = 2;
      dataArr.push(dataObj);
    }
    for (var j = 0; j < 5 - ds; j++) {
      var dataObj = {};
      dataObj.flag = 1;
      dataArr.push(dataObj);
    }
    var item = 'comment[' + m + '].dishstars';
    that.setData({
      [item]: dataArr
    })
    // that.data.comment[m].dishstars = dataArr;
  },
  reststars(m) {
    var that = this;
    var dataArr = [];
    var ds = that.data.comment[m].star_restaurant;
    for (let i = 0; i < ds; i++) {
      var dataObj = {}; //在里面定义对象
      dataObj.flag = 2;
      dataArr.push(dataObj);
    }
    for (let j = 0; j < 5 - ds; j++) {
      var dataObj = {};
      dataObj.flag = 1;
      dataArr.push(dataObj);
    }
    var item = 'comment[' + m + '].reststars';
    that.setData({
      [item]: dataArr
    })
    // that.data.comment[m].reststars = dataArr;
  },
  waiterstars(m) {
    var that = this;
    var dataArr = [];
    var ds = that.data.comment[m].star_waiter;
    for (let i = 0; i < ds; i++) {
      var dataObj = {}; //在里面定义对象
      dataObj.flag = 2;
      dataArr.push(dataObj);
    }
    for (let i = 0; i < 5 - ds; i++) {
      var dataObj = {};
      dataObj.flag = 1;
      dataArr.push(dataObj);
    }
    var item = 'comment[' + m + '].waiterstars';
    that.setData({
      [item]: dataArr
    })
    // that.data.comment[m].waiterstars = dataArr;
  },


  showExplicit(e) {
    var i = e.currentTarget.dataset.name;
    if (i == '全部菜品') {
      this.setData({
        curindex: 0
      })
    } else {
      this.setData({
        curnav: i,
        curindex: 1

      })
    }
  },
  showDetail(e) {
    var i = e.currentTarget.dataset.index;
    wx.showModal({
      title: this.data.menuDetail[i].name,
      content: this.data.menuDetail[i].description,
      success(res) {
        if (res.confirm) {} else if (res.cancel) {}
      }
    })
  },
  toComment() {
    wx.navigateTo({
      url: '/pages/comment/comment',
    })
  },
  callWaiter() {
    var that = this
    const db = wx.cloud.database()
    const _ = db.command
    const $ = db.command.aggregate
    wx.showModal({
      title: '顾客您好',
      content: '是否需要呼叫服务员',
      success(res) {
        if (res.confirm) {
          //console.log('用户点击确定')
          wx.cloud.callFunction({
            name: 'callWaiter',
            data: {
              tableid: 1,
              callWaiter: '1'
            }
          }).then(res => {
            //console.log('云函数更新table数据成功', res)
          }).catch(res => {
            //console.log('云函数更新table数据失败', res)
          })
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  }
})