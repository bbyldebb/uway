

Page({
    data: {
        info: [
            {
                id: 0,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
                bkcolor: "background-color:#C25939",//#CF9B69
            },
            {
                id: 1,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
                bkcolor: "background-color:#C25939" //#CF9B69
            },
            {
                id: 2,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
                bkcolor: "background-color:#C25939" //#CF9B69
            },
            {
                id: 3,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
                bkcolor: "background-color:#C25939" //#CF9B69
            },
            {
                id: 4,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
                bkcolor: "background-color:#C25939" //#CF9B69
            },
            {
                id: 5,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
                bkcolor: "background-color:#C25939"//#CF9B69
            },
            {
                id: 6,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
                bkcolor: "background-color:#C25939" //#CF9B69
            },
            {
                id: 7,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
                bkcolor: "background-color:#C25939" //#CF9B69
            },
            {
                id: 8,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
                bkcolor: "background-color:#C25939" //#CF9B69
            },
            {
                id: 9,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
                bkcolor: "background-color:#C25939" //#CF9B69
            },

        ],

        CustNum: 9,
        CookNum: 9,
        id: 0,
    },

    onChangeShowState: function (e) {
        var dataid = e.currentTarget.dataset.item;
        var that = this;
        const db = wx.cloud.database();
        var temp = Number(dataid)
        var aa;
        var bb;
        db.collection('table').where({ "ID": temp })
            .get()
            .then(res => {
                aa = res.data[0].state//.state
                console.log("aa:", aa)
                if (aa > 2) {
                    console.log(dataid);
                    console.log(that.data.info[9].show_condition);
                    that.data.info[dataid].show_condition = !that.data.info[dataid].show_condition;
                    console.log(that.data.info[9].show_condition);
                    if (aa == 3) {
                        that.data.info[temp].available = true
                    }
                    else {
                        that.data.info[temp].available = false
                    }
                    this.setData(
                        {
                            id: dataid,
                            info: that.data.info
                        }
                    )
                }


            })
            .catch(err => {

                console.log("fail!!!", dataid)
            })

    },

    onChangeAvailable: function (e) {

        var temp = this.data.id;
        var that = this;
        var up = "info[" + temp + "].judge";
        that.data.info[temp].show_condition = !that.data.info[temp].show_condition;
        that.data.info[temp].available = !that.data.info[temp].available;
        that.data.info[temp].judge = !that.data.info[temp].judge;
        var aa;
        const db = wx.cloud.database()

        db.collection('table').where({ "ID": temp })
            .get()
            .then(res => {
                aa = res.data[0].state
                console.log("aa:", aa)
                if (aa == 3) {

                    db.collection('table').where({ "ID": temp })
                        .update({
                            data: {
                                state: "4"
                            }
                        })
                        .then(res => {
                            console.log("更新成功1" + temp)

                        })
                        .catch(err => {
                            console.log("更新失败")
                        })
                    that.data.info[temp].bkcolor = "background-color:#FEEEBD";
                }
                else {

                    db.collection('table').where({ "ID": temp })
                        .update({
                            data: {
                                state: "1"
                            }

                        })
                        .then(res => {
                            console.log("更新成功2" + temp)
                        })
                        .catch(err => {
                            console.log("更新失败")
                        })
                    that.data.info[temp].bkcolor = "background-color:#CF9B69";
                }
                this.setData(
                    {
                        info: that.data.info

                    }
                )
            })
            .catch(err => {

                console.log("fail!!!")
            })
    },

    refresh: function (j) {
        const db = wx.cloud.database()
        db.collection('table').where({ "ID": j })
            .get()
            .then(res => {
                var that = this;
                console.log("成功111", res.data[0].ID, ":", res.data[0].state)
                if (res.data[0].state == "1") {
                    var that = this;
                    this.data.info[j].judge = false;

                    this.data.info[j].bkcolor = "background-color:#CF9B69";
                    console.log("!!", this.data.info[j])
                    this.setData(
                        {
                            info: that.data.info
                        }
                    )
                }
                else if (res.data[0].state == "2") {
                    this.data.info[j].judge = true;
                    this.data.info[j].bkcolor = "background-color:#784D23";
                    console.log("!!", this.data.info[j].judge)
                    this.setData(
                        {
                            info: that.data.info

                        }
                    )
                }
                else if (res.data[0].state == "3") {
                    this.data.info[j].judge = true;
                    this.data.info[j].bkcolor = "background-color:#C25939";
                    console.log("!!", this.data.info[j].judge)
                    this.setData(
                        {
                            info: that.data.info
                        }
                    )
                }
                else if (res.data[0].state == "4") {
                    this.data.info[j].judge = true;
                    this.data.info[j].bkcolor = "background-color:#FEEEBD";
                    console.log("!!", this.data.info[j].judge)
                    this.setData(
                        {
                            info: that.data.info
                        }
                    )
                }
            })
            .catch(err => {
                console.log("失败")
            })
    },
    myUpdate() {
        setTimeout(this.myUpdate, 2000)
        this.refresh(1)
        this.refresh(2)
        this.refresh(3)
        this.refresh(4)
        this.refresh(5)
        this.refresh(6)
        this.refresh(7)
        this.refresh(8)
        this.refresh(9)
        console.log('轮询中...')
    },
    startWaiting() {
        setTimeout(this.myUpdate, 2000)
    },
    onLoad: function () {

        this.startWaiting()

    },



})