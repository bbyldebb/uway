
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

            // for (var o in this.data.temp) {
            //     console.log('qweqewq')
            //     var i = this.data.temp[o].referOrder
            //     console.log(i)

            //     // console.log(this.data.table_id)
            // }


        },

        //监听table变化
        async WatchTable() {
            var that = this
            const db = wx.cloud.database()
            const temp = db.collection('table').watch({
                onChange: snapshot => {
                    // console.log(snapshot.docs)
                    that.setData({
                        mysql: snapshot.docs
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

                // for(var i in res.result.list){
                // var order = res.result.list[i].referOrder
                // console.log(order)
                // wx.cloud.callFunction({
                //     name: 'UpdateOrderItem',
                //     data: {
                //         referorder: order,
                //     }
                // }).then(res => {
                //     console.log('云函数更新数据成功', res.result.data)
                // })
                //     .catch(res => {
                //         console.log('云函数更新数据失败', res)
                //     })

                //  }
                for (var i in res.result.list) {
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

                }

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
            var temp = this.data.id;
            var that = this;
            // var up = "info[" + temp + "].judge";
            var dataid = e.currentTarget.dataset.item;
            console.log(dataid)
            if (dataid == '1')
                dataid = '2'
            else if (dataid == '2')
                dataid = '3'
            wx.cloud.callFunction({
                name: 'SetTable',
                data: {
                    id: temp,
                    state: dataid
                }
            }).then(res => {
                console.log('云函数更新数据成功', res.result.data)
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

    })
