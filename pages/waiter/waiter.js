
Page(
    {
        data: {
            //顾客呼叫信息
            cust_mess: [
                {
                    id: 1
                },
                {
                    id: 2
                },
                {
                    id: 3
                },
                {
                    id: 4
                },
                {
                    id: 5
                },
                {
                    id: 6
                },
                {
                    id: 7
                },
                {
                    id: 8
                },
                {

                    id: 9
                },

            ],
            info: [
                {
                    // id: 0,

                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: true,
                },
                {
                    // id: 0,

                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: true,
                }, {
                    // id: 0,

                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: true,
                }
            ],


            CustNum: 0,
            CookNum: 0,
            id: 0,

        },

        async onLoad() {
            this.WatchTable()
        },
        onShow() {

            this.WatchOrder()

        },

        async WatchOrder() {
            var that = this
            const db = wx.cloud.database()
            const temp = await db.collection('orderItem').where({
                state: '4'
            }).watch({
                onChange: snapshot => {
                    console.log(snapshot.docs)
                    that.setData({
                        temp: snapshot.docs
                    })
                    console.log(that.data.temp)
                    that.RefreshOrder()
                },
                onError: function (err) {
                    console.error("监听失败", err)
                }
            })
        },

        async RefreshOrder() {
            var that = this
            var CookNum = 0
            var l = 0;
            // console.log(that.data.temp.length)
            run()
            async function run() {
                if (l < that.data.temp.length) {

                    var i = that.data.temp[l].referOrder
                    console.log(i)
                    await wx.cloud.callFunction({
                        name: 'WatchTable',
                        data: {
                            id: i,
                        }
                    }).then(res => {
                        console.log('云函数读取orderItem数据成功', res.result.list[0])
                        that.data.info[parseInt(res.result.list[0].ID)].cook_hide = false
                    })
                        .catch(res => {
                            console.log('云函数获取orderItem数据失败', res)
                        })

                    l++;
                    run()
                }
                else {
                    for (var j in that.data.info) {
                        if (that.data.info[j].cook_hide == false)
                            CookNum++;
                    }
                    that.setData(
                        {

                            info: that.data.info,
                            CookNum: CookNum
                        }
                    )

                }
            }

        },

        //监听table变化
        async WatchTable() {
            var that = this
            const db = wx.cloud.database()
            const temp = db.collection('table').watch({
                onChange: snapshot => {
                    // console.log(snapshot.docs)
                    that.setData({
                        mysql: snapshot.docs,
                    })
                    that.refresh_right()//初始化info数组

                    // console.log(that.data.mysql)
                },
                onError: function (err) {
                    console.error("监听失败", err)
                }
            })
            // console.log("如那件", that.data.mysql)
        },
        //更新
        refresh_right: function () {
            var len = this.data.mysql.length
            // console.log(len)
            var that = this
            for (var o in this.data.mysql) {
                if (that.data.mysql[o].state == '')
                    continue;
                // console.log("id+state", that.data.mysql[o].ID, that.data.mysql[o].state)
                var id = parseInt(that.data.mysql[o].ID)
                if (that.data.mysql[o].state == "2") {
                    that.data.info[id].show_condition = false;
                    that.data.info[id].available = false;
                }
                else {
                    that.data.info[id].show_condition = false;
                    that.data.info[id].available = true;
                }
                // console.log(that.data.mysql[o].ID,that.data.mysql[o].state)
            }
            this.setData(
                {
                    info: that.data.info,
                    length: len
                }
            )
        },

        custMesgHidden: function (e) {
            var dataid = e.currentTarget.dataset.item;
            // console.log(dataid);
            var that = this;
            // that.data.info[dataid].cust_hide = !that.data.info[dataid].cust_hide;
            that.data.info[dataid].cust_hide = true;
            this.setData(
                {
                    info: that.data.info,
                    CustNum: that.data.CustNum - 1
                }
            )




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
            console.log(temp.data[0]._id)

            await wx.cloud.callFunction({
                name: 'SetOrder',
                data: {
                    id: temp.data[0]._id,
                }
            }).then(async res => {
                console.log('云函数读取orderItem数据成功', res.result.list)

                // for (var i in res.result.list) {
                    var order = res.result.list[0].referOrder
                    console.log(order)
                    await wx.cloud.callFunction({
                        name: 'UpdateOrderItem',
                        data: {
                            referorder: order,
                        }
                    }).then(res => {
                        console.log('云函数更新数据成功', res.result.data)
                    })
                        .catch(res => {
                            console.log('云函数更新数据失败', res)
                        })

                // }
                

            })
                .catch(res => {
                    console.log('云函数获取orderItem数据失败', res)
                })



        },
        onChangeShowState: function (e) {
            var dataid = e.currentTarget.dataset.item;
            // var up = "info[" + dataid + "].show_condition";
            var that = this;


            that.data.info[dataid].show_condition = !that.data.info[dataid].show_condition;
            // console.log(that.data.info[9].show_condition);
            this.setData(
                {
                    id: dataid,
                    info: that.data.info
                }
            )

        },

        onChangeAvailable: function (e) {
            wx.showLoading({
                title: '加载中...'
            })
            var temp = this.data.id;
            var that = this;
            // var up = "info[" + temp + "].judge";
            var dataid = e.currentTarget.dataset.item;
            var title = "";
            console.log(dataid)
            if (dataid == '1') {
                dataid = '2'
                title = "绑定成功!"
            }


            else if (dataid == '2') {
                dataid = '3'
                title = "解绑成功!"
            }

            wx.cloud.callFunction({
                name: 'SetTable',
                data: {
                    id: temp,
                    state: dataid
                }
            }).then(res => {
                wx.hideLoading();
                console.log('云函数更新数据成功', res.result.data)
                wx.showToast({
                    title: title,
                    icon: 'success',
                    duration: 1500
                })
            })
                .catch(res => {
                    console.log('云函数更新数据失败', res)
                })
            //数据库获取数据



            that.data.info[temp].show_condition = !that.data.info[temp].show_condition;
            that.data.info[temp].available = !that.data.info[temp].available;
            // that.data.info[temp].judge = !that.data.info[temp].judge;
            this.setData(
                {
                    // show_condition: (!that.data.show_condition),
                    // available: (!that.data.available),
                    info: that.data.info
                    // available_color: "#C25939" 棕色
                }
            )

        },
        SetTable: function (e) {
            var that = this
            wx.showModal({
                title: '添加桌子',
                content: '确定增加一张桌子？',
                showCancel: true,//是否显示取消按钮      
                cancelText: "取消",//默认是“取消”      
                cancelColor: '#DEB887',//取消文字的颜色      
                confirmText: "确定",//默认是“确定”      
                confirmColor: '#DEB887',//确定文字的颜色      
                success: function (res) {
                    if (res.cancel) {
                        //点击取消,默认隐藏弹框        
                    } else {
                        wx.showLoading({
                            title: '添加中...'
                        })
                        //点击确定          
                        wx.cloud.callFunction({
                            name: 'AddTable',
                            data: {
                                id: that.data.length,
                            }
                        }).then(res => {
                            wx.hideLoading();
                            wx.showToast({
                                title: "添加成功!",
                                icon: 'success',
                                duration: 1500
                            })
                            console.log("成功")
                        })
                            .catch(res => {
                                console.log('云函数更新数据失败', res)
                            })

                    }
                },
                fail: function (res) { },//接口调用失败的回调函数      
                complete: function (res) {
                    wx.showToast({
                        title: "请重试!",
                        icon: 'none',
                        duration: 1500
                    })

                },//接口调用结束的回调函数（调用成功、失败都会执行）   
            })
        }
    })
