

Page(
    {

        data: {
            info: [
                {
                    // id: 0,

                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                },
                {
                    // id: 0,

                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                }, {
                    // id: 0,

                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                }, {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                },
                {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                },
                {
                    // id: 0,
                    // judge: false,
                    show_condition: "",
                    available: "",
                    cust_hide: true,
                    cook_hide: true,
                }
            ],


            CustNum: 0,
            CookNum: 0,
            id: 0,
            control: 0

        },

        async onLoad() {
            var that = this;
            wx.getSystemInfo({
                success: function (res) {
                    console.log(res);
                    // ?????????????????????
                    console.log('height=' + res.windowHeight);
                    console.log('width=' + res.windowWidth);
                    // ??????,?????? ?????????px
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

            this.WatchOrder()
            this.WatchCust()

        },


        //??????table??????
        async WatchTable() {
            var that = this
            const db = wx.cloud.database()
            const temp = db.collection('table').watch({
                onChange: snapshot => {
                    // console.log(snapshot.docs)
                    that.setData({
                        mysql: snapshot.docs,
                    })
                    that.refresh_right()//?????????info??????

                    // console.log(that.data.mysql)
                },
                onError: function (err) {
                    console.error("????????????", err)
                }
            })
            // console.log("?????????", that.data.mysql)
        },
        //??????
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
            var title = "";
            console.log(dataid)
            if (dataid == '3') {
                dataid = '4'
                title = "????????????!"
                wx.showLoading({
                    title: '?????????...'
                })
            }


            else if (dataid == '4') {
                dataid = '1'
                title = "????????????!"
                wx.showLoading({
                    title: '?????????...'
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
                console.log('???????????????????????????', res.result.data)
                wx.showToast({
                    title: title,
                    icon: 'success',
                    duration: 1500
                })
            })
                .catch(res => {
                    console.log('???????????????????????????', res)
                })
            //?????????????????????
            that.data.info[temp].show_condition = !that.data.info[temp].show_condition;
            that.data.info[temp].available = !that.data.info[temp].available;
            // that.data.info[temp].judge = !that.data.info[temp].judge;
            this.setData(
                {
                    // show_condition: (!that.data.show_condition),
                    // available: (!that.data.available),
                    info: that.data.info
                    // available_color: "#C25939" ??????
                }
            )

        },
    })