
Page({
    data: {
        //顾客呼叫信息
        cust_mess: [
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
                id: 0,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
            },
            {
                id: 1,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
            },
            {
                id: 2,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
            },
            {
                id: 3,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
            },
            {
                id: 4,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
            },
            {
                id: 5,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
            },
            {
                id: 6,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
            },
            {
                id: 7,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
            },
            {
                id: 8,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
            },
            {
                id: 9,
                judge: false,
                show_condition: false,
                available: true,
                cust_hide: false,
                cook_hide: false,
            },


        ],

        CustNum: 9,
        CookNum: 9,
        id: 0,
    },
    custMesgHidden: function (e) {
        var dataid = e.currentTarget.dataset.item;
        console.log(dataid);
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
        console.log(dataid);
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
        console.log(dataid);
        console.log(that.data.info[9].show_condition);
        that.data.info[dataid].show_condition = !that.data.info[dataid].show_condition;
        console.log(that.data.info[9].show_condition);
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
        var up = "info[" + temp + "].judge";
        that.data.info[temp].show_condition = !that.data.info[temp].show_condition;
        that.data.info[temp].available = !that.data.info[temp].available;
        that.data.info[temp].judge = !that.data.info[temp].judge;
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