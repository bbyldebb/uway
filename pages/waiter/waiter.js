
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
            //厨师上菜功能
            cook_mess: [
                {
                    id: 1
                }, {
                    id: 2
                }, {
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
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: false,
                },
                {
                    // id: 1,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: false,
                },
                {
                    // id: 2,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: false,
                },
                {
                    // id: 3,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: false,
                },
                {
                    // id: 4,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: false,
                },
                {
                    // id: 5,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: false,
                },
                {
                    // id: 6,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: false,
                },
                {
                    // id: 6,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: false,
                },
                {
                    // id: 6,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: false,
                },
                {
                    // id: 6,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: false,
                },
                {
                    // id: 6,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: false,
                },
                {
                    // id: 6,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: false,
                },
                {
                    // id: 6,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: false,
                    cook_hide: false,
                },
            ],


            CustNum: 9,
            CookNum: 9,
            id: 0,
            // interval: ""
        },

        async onLoad() {
            //云函数获取数据
            // this.setMysql();
            console.log("设置成功")

            await wx.cloud.callFunction({
                name: 'GetTable',
            }).then(res => {
                console.log('云函数获取orderItem数据成功', res.result.data)
                this.setData({
                    mysql: res.result.data,

                })
            })
                .catch(res => {
                    console.log('云函数获取orderItem数据失败', res)
                })
            //数据库获取数据

            this.refresh()

        },

        onShow() {

            this.startInto()
        },


        onHide() {
            clearInterval(this.data.interval)
        },
        onunload() {

            clearInterval(this.data.interval)
        },

        refresh: function () {
            var len = this.data.mysql.length
            var that = this
            for (var o in this.data.mysql) {
                if (that.data.mysql[o].state == '')
                    continue;
                console.log("id+state", that.data.mysql[o].ID, that.data.mysql[o].state)
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

        async startInto() {
            var that = this;
            this.data.interval = setInterval(async function () {
                // console.log("111111")
                // console.log(that.data.mysql)
                // this.refresh()
                await wx.cloud.callFunction({
                    name: 'GetTable',
                }).then(res => {
                    //                 console.log('云函数获取orderItem数据成功', res.result.data)
                    that.setData({
                        mysql: res.result.data,
                    })
                })
                    .catch(res => {
                        console.log('云函数获取orderItem数据失败', res)
                    })
                //数据库获取数据
                // that.refresh()
            }, 500);


        },

        setMysql: function (e) {
            console.log("设置成功")

            wx.cloud.callFunction({
                name: 'GetTable',
            }).then(res => {
                console.log('云函数获取orderItem数据成功', res.result.data)
                this.setData({
                    mysql: res.result.data,

                })

            })
                .catch(res => {
                    console.log('云函数获取orderItem数据失败', res)
                })
            //数据库获取数据
        },
        // setState: function (e) {

        // },




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
        cookMesgHidden: function (e) {
            var dataid = e.currentTarget.dataset.item;
            // console.log(dataid);
            var that = this;

            that.data.info[dataid].cook_hide = !that.data.info[dataid].cook_hide;

            this.setData(
                {
                    info: that.data.info,
                    CookNum: that.data.CookNum - 1,
                }
            )

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
                console.log('云函数更新orderItem数据成功', res.result.data)
            })
                .catch(res => {
                    console.log('云函数更新orderItem数据失败', res)
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
