// pages/cook/cook.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dish_message: [{
                id: 0,
                name: "提拉米苏",
                ps: "加香菜",
                time: "10:30",
                status: 0
            },
            {
                id: 1,
                name: "番茄炒蛋",
                ps: "蛋放多一点",
                time: "10:25",
                status: 0
            },
            {
                id: 2,
                name: "卤鸡腿",
                ps: "要卤的不要炸的",
                time: "10:20",
                status: 0
            },
            {
                id: 3,
                name: "干煸四季豆",
                ps: "不要放辣椒",
                time: "10:18",
                status: 0
            },
            {
                id: 4,
                name: "宫爆鸡丁",
                ps: "多放点糖",
                time: "10:15",
                status: 0
            },
        ]

    },

    takeit: function (e) {
        var index = parseInt(e.currentTarget.dataset.index);
        //console.log(index)
        this.setData({
            [`dish_message[${index}].status`]: 1
        })
        console.log(this.data.dish_message[index].status)
    },
    doneit: function (e) {
        var index = parseInt(e.currentTarget.dataset.index);
        console.log(index)
        this.setData({
            [`dish_message[${index}].status`]: 2
        })
        console.log(this.data.dish_message[index].status)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})