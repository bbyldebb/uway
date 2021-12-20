const ORDER = wx.cloud.database().collection("order")
const ORDERITEM = wx.cloud.database().collection("orderItem")
const CUSTOMER = wx.cloud.database().collection("customer")
const TABLE = wx.cloud.database().collection("table")
Page({
  data: {
    menuClass: [],
    menuDetail: [],
    comment: [],
    bgImg: "../../static/img/dark.png",
    bgfImg: "../../static/img/bright.png",
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
    curnav: '全部菜品',
    cuvindex: 0,
    showDishCard: false,
    cardID: 233,
    flag: true,
    totalMoney: 0,
    totalNum: 0,
    orderDetail: [],
    showCart: false,
    referTable: '',
    referTableID: '',
    referCustomer: '',
    nickName: '',
    avatarUrl: '',
    showTable: false,
    submitORcall: 1,
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
        let newArr = res.result.data.map(item => {
          item.num = 0;
          return item;
        });
        this.setData({
          menuDetail: newArr,
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
  async showDetail(e) {
    var that = this
    if (this.data.flag == true) {
      var i = e.currentTarget.dataset.index;
      this.setData({
        cardID: this.data.menuDetail[i].ID
      });
      var o = this.selectComponent("#dishcard")
      await o.getDate();
      setTimeout(function () {
        that.setData({
          showDishCard: true,
        })
      }, 250)
    }
    that.setData({
      flag: true
    })
  },
  AddorMinus() {
    this.setData({
      flag: false
    })
  },
  addDish(e) {
    var i = e.currentTarget.dataset.index;
    var ID = this.data.menuDetail[i].ID;
    let order = this.data.orderDetail;
    let newArr = this.data.menuDetail.map(item => {
      if (item.ID == ID) {
        item.num += 1;
        //判断是否已经在订单中存在
        for (var j = 0; j < order.length; j++) {
          if (order[j].ID == ID) {
            order[j].num = item.num
            return item;
          }
        }
        order.push(item);
      }
      return item;
    });
    this.setData({
      menuDetail: newArr,
      totalNum: this.data.totalNum += 1,
      totalMoney: this.data.totalMoney += (Number)(this.data.menuDetail[i].price),
      orderDetail: order
    });
    //wx.setStorageSync('cart', order);
  },
  minusDish(e) {
    var i = e.currentTarget.dataset.index;
    var ID = this.data.menuDetail[i].ID;
    if (this.data.menuDetail[i].num >= 1) {
      let order = this.data.orderDetail;
      let newArr = this.data.menuDetail.map(item => {
        if (item.ID == ID) {
          item.num = item.num - 1;
          for (var j = 0; j < order.length; j++) {
            if (order[j].ID == ID) {
              order[j].num = item.num
              if (order[j].num == 0) {
                order = order.filter(function (orderItem) {
                  return orderItem.ID != ID;
                })
              }
              return item;
            }
          }
        }
        return item;
      });
      this.setData({
        menuDetail: newArr,
        totalNum: this.data.totalNum -= 1,
        totalMoney: this.data.totalMoney -= (Number)(this.data.menuDetail[i].price),
        orderDetail: order
      });
      //wx.setStorageSync('cart', order);
    }
  },
  toComment() {
    this.setData({
      submitORcall: 3
    })
    if (this.data.referCustomer == '') {
      this.getCustomer();
      return
    }
    wx.navigateTo({
      url: '/pages/comment/comment?referCustomer='+this.data.referCustomer,
    })
  },
  callWaiter() {
    var that = this
    if(that.data.referTable == ''){
      that.setData({
        submitORcall: 2
      });
      that.getTable();
      return
    }
    const db = wx.cloud.database()
    const _ = db.command
    const $ = db.command.aggregate
    wx.showModal({
      title: '顾客您好',
      content: '是否需要呼叫服务员',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'callWaiter',
            data: {
              tableid: that.data.referTableID,
              callWaiter: '1'
            }
          }).then(res => {
            console.log('云函数更新table数据成功', res)
          }).catch(res => {
            console.log('云函数更新table数据失败', res)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  showCart() {
    this.setData({
      showCart: true
    })
  },
  hideCart() {
    this.setData({
      showCart: false
    })
  },
  minusDishIn(e) {
    var i = e.currentTarget.dataset.index;
    var ID = this.data.orderDetail[i].ID;
    var dishNum;
    let order = this.data.orderDetail.map(item => {
      if (item.ID == ID) {
        item.num = item.num - 1;
        dishNum = item.num;
      }
      return item;
    });
    if (dishNum == 0) {
      order = order.filter(function (orderItem) {
        return orderItem.ID != ID;
      })
    }
    let newArr = this.data.menuDetail.map(item => {
      if (item.ID == ID) {
        item.num = dishNum;
      }
      return item;
    });
    this.setData({
      menuDetail: newArr,
      totalNum: this.data.totalNum -= 1,
      totalMoney: this.data.totalMoney -= (Number)(this.data.orderDetail[i].price),
      orderDetail: order
    });
  },
  addDishIn(e) {
    var i = e.currentTarget.dataset.index;
    var ID = this.data.orderDetail[i].ID;
    var dishNum;
    let order = this.data.orderDetail.map(item => {
      if (item.ID == ID) {
        item.num += 1;
        dishNum = item.num;
      }
      return item;
    });

    let newArr = this.data.menuDetail.map(item => {
      if (item.ID == ID) {
        item.num = dishNum;
      }
      return item;
    });
    this.setData({
      menuDetail: newArr,
      totalNum: this.data.totalNum += 1,
      totalMoney: this.data.totalMoney += (Number)(this.data.menuDetail[i].price),
      orderDetail: order
    });
  },
  submitOrder() {
    this.setData({
      submitORcall: 1
    })
    if (this.data.referCustomer == '') {
      this.getCustomer();
      return
    }
    if (this.data.referTable == '') {
      this.getTable();
      return
    }
    var util = require('../../utils/util.js')
    var today = util.formatTime(new Date())
    if (this.data.totalMoney != 0) {
      //创建订单放入数据库，并返回获取订单id
      var that = this
      ORDER.add({
        data: {
          orderPrice: that.data.totalMoney,
          orderTime: today,
          referCustomer: that.data.referCustomer,
          referTable: that.data.referTable
        },
        success: function (res) {
          //创建订单项放入数据库
          for (var i = 0; i < that.data.orderDetail.length; i++) {
            let oneDish = that.data.orderDetail[i];
            ORDERITEM.add({
              data: {
                description: oneDish.description,
                number: oneDish.num,
                price: oneDish.num * oneDish.price,
                referDish: oneDish.ID,
                referOrder: res._id,
                state: '2'
              }
            })
          };
          //清空购物车
          that.clearOrder();
          //显示提交成功
          wx.showToast({
            title: '提交订单成功',
            icon: 'success',
            duration: 1500
          });
        }
      })
    } else {
      //显示提交成功
      wx.showToast({
        title: '您还未点餐',
        icon: 'error',
        duration: 1500
      });
    }
  },
  clearOrder() {
    //购物车清空
    let newArr = this.data.menuDetail;
    for (var j = 0; j < this.data.orderDetail.length; j++) {
      newArr = newArr.map(item => {
        if (item.ID == this.data.orderDetail[j].ID) {
          item.num = 0;
        }
        return item;
      });
    };
    this.setData({
      totalMoney: 0,
      totalNum: 0,
      orderDetail: [],
      menuDetail: newArr
    })
  },
  getCustomer() {
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
              referCustomer: res.result.openId
            })
            //查询用户的openId，若表中没有则添加记录
            CUSTOMER.where({
              openId: that.data.referCustomer
            }).get({
              success: function (res) {
                if (res.data.length == 0) {
                  CUSTOMER.add({
                    data: {
                      avatarUrl: that.data.avatarUrl,
                      nickName: that.data.nickName,
                      openId: that.data.referCustomer
                    },
                    success: function (res) {
                      wx.showToast({
                        title: '欢迎光临UWAY',
                        icon: 'success',
                        duration: 500
                      });
                    }
                  });
                } else {
                  wx.showToast({
                    title: '欢迎老顾客回家',
                    icon: 'success',
                    duration: 500
                  });
                }
                if(that.data.submitORcall == 3) {
                  setTimeout(function () {
                    that.toComment()
                  }, 500)
                }
                else if(that.data.submitORcall == 1){
                  setTimeout(function () {
                    that.getTable()
                  }, 500)
                }
              }
            });
          }
        })
      }
    })
  },
  cancelTable() {
    this.setData({
      showTable: false,
      referTable: ''
    })
  },
  inputTable: function (e) {
    this.setData({
      referTable: e.detail.value
    })
  },
  confirmTable() {
    var that = this
    if (this.data.referTable != '') {
      //在数据库中查找自动生成的桌号id
      TABLE.where({
        ID: this.data.referTable
      }).get({
        success: function (res) {
          //成功查找
          if (res.data.length != 0) {
            that.setData({
              referTable: res.data[0]._id,
              referTableID: res.data[0].ID,
              showTable: false
            })
            if(that.data.submitORcall == 1) {
              that.submitOrder()
            }
            else if(that.data.submitORcall == 2){
              that.callWaiter()
            }
          }
          //查找失败，即输入桌号不存在
          else {
            wx.showToast({
              title: '请输入正确桌号',
              icon: 'error',
              duration: 700
            });
            that.setData({
              referTable: ''
            })
          }
        }
      });
    } else {
      wx.showToast({
        title: '请输入桌号',
        icon: 'error',
        duration: 700
      });
    }
  },
  getTable() {
    if(this.data.referTable == ''){
      this.setData({
        showTable: true
      })
    }
  }
})