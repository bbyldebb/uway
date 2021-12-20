const ORDER = wx.cloud.database().collection("order")
const ORDERITEM = wx.cloud.database().collection("orderItem")
Page(
    {

        data: {
            info: [
                {
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                },
                {
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                },
                {
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                },
                {
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                },
                {
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                },
                {
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                },
                {
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                },
                {
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                },
                {
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                },
                {
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                },
                {
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                },
                {
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                },


            ],


            CustNum: 0,
            CookNum: 0,
            id: 0,
            control: 0,
            // 控制点餐界面
            Rinfoall: true,


            menuClass: [],
            menuDetail: [],
            curnav: '全部菜品',
            showDishCard: false,
            cardID: 233,
            flag: true,
            totalMoney: 0,
            totalNum: 0,
            orderDetail: [],
            showCart: false,
            temp1: false,
            referTable: 1,
            referCustomer: "customer"

        },

        async onLoad() {
            var that = this;
            wx.getSystemInfo({
                success: function (res) {
                    // 高度,宽度 单位为px
                    that.setData({
                        windowHeight: res.windowHeight,
                        windowWidth: res.windowWidth,
                        buttonLeft: res.windowWidth * 0.302,
                        buttonTop: res.windowHeight * 0.1,
                        control: 0
                    })
                }
            })
            this.WatchTable()
        },
        onShow() {
            // wx.cloud.callFunction({
            //     name: 'delet',
            // }).then(res => {})

            this.WatchOrder()
            this.WatchCust()
        },
        async WatchCust() {
            var that = this
            const db = wx.cloud.database()
            const temp = await db.collection('table').where({
                callWaiter: "1"
            }).watch({
                onChange: snapshot => {
                    that.setData({
                        temp1: snapshot.docs
                    })
                    that.RefreshCust()
                },
                onError: function (err) {

                }
            })
        },
        takeorder(e) {
            var that = this
            var i = e.currentTarget.dataset.item;

            this.setData({
                Rinfoall: false,
                totalMoney: 0,
                totalNum: 0,
                orderDetail: [],
                referTable: i
            })


            const db = wx.cloud.database()
            const _ = db.command
            const $ = db.command.aggregate
            //云函数获取数据
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
                .catch(res => { })
        },
        async showDetail(e) {
            var that = this
            if (this.data.flag == true) {
                var i = e.currentTarget.dataset.item;

                this.setData({
                    cardID: this.data.menuDetail[i].ID
                });
                var o = this.selectComponent("#dishcard")
                await o.getDate();
                setTimeout(function () {
                    that.setData({
                        showDishCard: true,
                    })
                }, 450)
            }
            that.setData({
                flag: true
            })


        },

        showExplicit(e) {
            var i = e.currentTarget.dataset.name;
            if (i == '全部菜品') {
                this.setData({
                    temp1: false,
                    curindex: 0
                })
            } else {
                this.setData({
                    temp1: true,
                    curnav: i,
                    curindex: 1
                })
            }
        },
        AddorMinus() {
            this.setData({
                flag: false
            })
        },
        async outcha(e) {
            var that = this
            var i = e.currentTarget.dataset.item;
            await this.setData({

                Rinfoall: true
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
            }
        },

        showCart() {
            if (this.data.totalMoney > 0) {
                this.setData({
                    showCart: true
                })
            }
        },

        hideCart() {
            this.setData({
                showCart: false
            })
        },




        async WatchOrder() {
            var that = this
            const db = wx.cloud.database()
            const temp = await db.collection('orderItem').where({
                state: '4'
            }).watch({
                onChange: snapshot => {
                    that.setData({
                        temp: snapshot.docs
                    })
                    that.RefreshOrder()
                },
                onError: function (err) {

                }
            })
        },
        async submitOrder() {
            wx.showLoading({
                title: '生成中...'
            })
            var util = require('../../utils/util.js')
            var today = util.formatTime(new Date())
            var that = this
            await wx.cloud.callFunction({
                name: 'GetTable',
            }).then(res => {
                that.setData({
                    referCustomer: that.data.referCustomer + String(that.data.referTable),
                    referTable: res.result.data[that.data.referTable]._id
                })
            })
            if (that.data.totalMoney != 0) {
                //创建订单放入数据库，并返回获取订单id         
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
                        wx.hideLoading()
                        //清空购物车
                        let newArr = that.data.menuDetail;
                        for (var j = 0; j < that.data.orderDetail.length; j++) {
                            newArr = newArr.map(item => {
                                if (item.ID == that.data.orderDetail[j].ID) {
                                    item.num = 0;
                                }
                                return item;
                            });
                        };
                        that.setData({
                            totalMoney: 0,
                            totalNum: 0,
                            orderDetail: [],
                            menuDetail: newArr
                        })
                        //显示提交成功
                        wx.showToast({
                            title: '提交订单成功',
                            icon: 'success',
                            duration: 1500
                        });
                    },
                    fail: function (res) {
                        wx.showToast({
                            title: "请重试!",
                            icon: 'none',
                            duration: 1500
                        })
                    },
                })
            }
        },
        clearOrder() {
            var that = this
            wx.showModal({
                title: '清空菜单',
                content: '确定清空所有选择的菜品？',
                showCancel: true,//是否显示取消按钮      
                cancelText: "取消",//默认是“取消”      
                cancelColor: '#DEB887',//取消文字的颜色      
                confirmText: "确定",//默认是“确定”      
                confirmColor: '#DEB887',//确定文字的颜色      
                success: function (res) {
                    if (res.cancel) {
                        //点击取消,默认隐藏弹框        
                    } else {
                        let newArr = that.data.menuDetail;
                        for (var j = 0; j < that.data.orderDetail.length; j++) {
                            newArr = newArr.map(item => {
                                if (item.ID == that.data.orderDetail[j].ID) {
                                    item.num = 0;
                                }
                                return item;
                            });
                        };
                        that.setData({
                            totalMoney: 0,
                            totalNum: 0,
                            orderDetail: [],
                            menuDetail: newArr
                        })

                    }
                },
                fail: function (res) {
                    wx.showToast({
                        title: "请重试!",
                        icon: 'none',
                        duration: 1500
                    })
                },//接口调用失败的回调函数      
                complete: function (res) {
                },//接口调用结束的回调函数（调用成功、失败都会执行）   
            })


        },

        async RefreshCust() {
            var that = this
            var CustNum = 0
            var l = 0;
            run()
            async function run() {
                if (l < that.data.temp1.length) {
                    var i = that.data.temp1[l].ID
                    that.data.info[parseInt(i)].cust_hide = false
                    l++;
                    run()
                }
                else {
                    for (var j in that.data.info) {
                        if (that.data.info[j].cust_hide == false)
                            CustNum++;
                    }
                    that.setData(
                        {
                            info: that.data.info,
                            CustNum: CustNum
                        }
                    )

                }
            }

        },

        async RefreshOrder() {
            var that = this
            var CookNum = 0
            var l = 0;
            run1()
            async function run1() {
                if (l < that.data.temp.length) {

                    var i = that.data.temp[l].referOrder
                    await wx.cloud.callFunction({
                        name: 'WatchTable',
                        data: {
                            id: i,
                        }
                    }).then(res => {
                        that.data.info[parseInt(res.result.list[0].ID)].cook_hide = false
                    })
                    l++;
                    run1()
                }
                else {

                    for (var j in that.data.info) {
                        that.data.info[j].rinfo = true

                        if (that.data.info[j].cook_hide == false)
                            CookNum++;
                    }
                    await that.setData(
                        {

                            info: that.data.info,
                            CookNum: CookNum
                        }
                    )
                }
            }

            that.setData(
                {

                    info: that.data.info,
                    CookNum: CookNum
                }

            )
        },

        //监听table变化
        async WatchTable() {
            var that = this
            const db = wx.cloud.database()
            const temp = db.collection('table').watch({
                onChange: snapshot => {

                    that.setData({
                        mysql: snapshot.docs,
                    })
                    that.refresh_right()
                },
                onError: function (err) {

                }
            })
        },
        //更新
        refresh_right: function () {
            var len = this.data.mysql.length

            var that = this
            for (var o in this.data.mysql) {
                if (that.data.mysql[o].state == '')
                    continue;
                var id = parseInt(that.data.mysql[o].ID)
                if (that.data.mysql[o].state == "2") {
                    that.data.info[id].show_condition = false;
                    that.data.info[id].available = false;
                }
                else {
                    that.data.info[id].show_condition = false;
                    that.data.info[id].available = true;
                }
            }
            this.setData(
                {
                    info: that.data.info,
                    length: len
                }
            )
        },

        async custMesgHidden(e) {
            var that = this
            var dataid = e.currentTarget.dataset.item;

            var that = this
            const db = wx.cloud.database()
            that.data.info[dataid].cust_hide = true;
            await this.setData(
                {
                    info: that.data.info,
                    CustNum: that.data.CustNum - 1,
                }
            )
            var title = '请尽快给' + dataid + '号桌服务!'
            wx.showToast({
                title: title,
                icon: 'none',
                duration: 1800
            })
            await wx.cloud.callFunction({
                name: 'UpdateTable',
                data: {
                    id: dataid,
                    waitercall: "0",
                }
            }).then(res => {
            })
                .catch(res => {
                })

        },
        async cookMesgHidden(e) {

            var that = this
            var dataid = e.currentTarget.dataset.item;

            var that = this
            const db = wx.cloud.database()

            that.data.info[dataid].cook_hide = true;
            await this.setData(
                {
                    info: that.data.info,
                    CookNum: that.data.CookNum - 1,
                }
            )
            var title = '请尽快给' + dataid + '号桌上菜!'
            wx.showToast({
                title: title,
                icon: 'none',
                duration: 1800
            })

            var temp = await db.collection('table').where({
                ID: dataid
            }).get()

            await wx.cloud.callFunction({
                name: 'SetOrder',
                data: {
                    id: temp.data[0]._id,
                }
            }).then(async res => {
                var order = res.result.list[0].referOrder
                await wx.cloud.callFunction({
                    name: 'UpdateOrderItem',
                    data: {
                        referorder: order,
                    }
                }).then(res => {
                    that.onLoad()

                })
                    .catch(res => {
                    })



            })
                .catch(res => {
                })




        },
        onChangeShowState: function (e) {
            var dataid = e.currentTarget.dataset.item;
            var that = this;
            that.data.info[dataid].show_condition = !that.data.info[dataid].show_condition;
            this.setData(
                {
                    id: dataid,
                    info: that.data.info
                }
            )

        },
        deletDishIn(e) {
            var i = e.currentTarget.dataset.index;
            var ID = this.data.orderDetail[i].ID;
            var dishNum;
            var temp
            let order = this.data.orderDetail.map(item => {
                if (item.ID == ID) {
                    temp = item.num;
                    item.num = 0;
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
                totalNum: this.data.totalNum -= temp,
                totalMoney: this.data.totalMoney -= (Number)(this.data.orderDetail[i].price) * parseInt(temp),
                orderDetail: order
            });
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
                totalMoney: this.data.totalMoney += (Number)(this.data.orderDetail[i].price),
                orderDetail: order
            });
        },

        onChangeAvailable: function (e) {

            var temp = this.data.id;
            var that = this;
            // var up = "info[" + temp + "].judge";
            var dataid = e.currentTarget.dataset.item;
            var title = "";
            if (dataid == '1') {
                dataid = '2'
                title = "绑定成功!"
                wx.showLoading({
                    title: '绑定中...'
                })
            }


            else if (dataid == '2') {
                dataid = '3'
                title = "解绑成功!"
                wx.showLoading({
                    title: '解绑中...'
                })
            }

            wx.cloud.callFunction({
                name: 'SetTable',
                data: {
                    id: temp,
                    state: dataid
                }
            }).then(res => {
                wx.hideLoading();
                wx.showToast({
                    title: title,
                    icon: 'success',
                    duration: 1500
                })
            })
                .catch(res => {
                })
            //数据库获取数据
            that.data.info[temp].show_condition = !that.data.info[temp].show_condition;
            that.data.info[temp].available = !that.data.info[temp].available;
            this.setData(
                {
                    info: that.data.info
                }
            )

        },
    })
