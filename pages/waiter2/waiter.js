
Page({
    data: {
        info: [
            {
                judge: false,
                show_condition: false,
                available: true,
            },
            {
                judge: false,
                show_condition: false,
                available: true,
            },
            {
                judge: false,
                show_condition: false,
                available: true,
            },
            {
                judge: false,
                show_condition: false,
                available: true,
            },
            {
                judge: false,
                show_condition: false,
                available: true,
            },
            {
                judge: false,
                show_condition: false,
                available: true,
            },
            {
                judge: false,
                show_condition: false,
                available: true,
            },
            {
                judge: false,
                show_condition: false,
                available: true,
            },
            {
                judge: false,
                show_condition: false,
                available: true,
            },


        ],


        id: 0,
    },
    onChangeShowState: function (e) {
        var dataid = e.currentTarget.dataset.item;
        // var up = "info[" + dataid + "].show_condition";
        var that = this;

        that.data.info[dataid].show_condition = !that.data.info[dataid].show_condition;
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