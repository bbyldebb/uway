
var plugin = requirePlugin("WechatSI")
const app = getApp()
const db = wx.cloud.database();
var util = require('../../utils/util.js')
var utils = require('../../utils/dateUtil.js')
var wxCharts = require("../../utils/wxcharts.js")//相对路径
Page({
    data: {
        nbFrontColor: '#BAC6AC',
        nbBackgroundColor: '#BAC6AC',
        audiosrc: '',
        sold_message: [],
        order_message: [],
        categories: [],
        incomeList: [],
        showModalStatus: false,
        imageWidth: 0,

        order_count: 0,

        day_num: 7,
        sum_7: 0
    },

    get_num: function (e) {

        var su = 0
        var sum = 0
        var inList = []
        for (let i = this.data.day_num; i > 0; i -= 1) {
            var t = utils.mathChangeDate(util.formatTime(new Date()), '-', i, true)
            for (let j = 0; j < this.data.order_count; j += 1) {
                if ((utils.mathChangeDate(this.data.order_message[j].orderTime, '-', 0, true)) == t) {

                    su += Number(this.data.order_message[j].orderPrice)

                }
            }
            inList = inList.concat(su)
            sum += su
            su = 0
        }
        this.setData({
            sum_7: sum,
            incomeList: inList
        })
    },
    async onLoad() {
        this.setData({
            nbTitle: '查看流水',
            nbFrontColor: '#000000',
            nbBackgroundColor: '#BAC6AE',
        })

        //数据库获取数据
        var that = this;

        db.collection('dish').orderBy('soldNum', 'desc')
            .get()
            .then(res => {
                this.setData(
                    {
                        sold_message: res.data
                    }
                )
            })
            .catch(err => {
                console.log("fail!!!")
            })


        let count = await db.collection('order').count()
        let all = []
        count = count.total
        for (let i = 0; i < count; i += 20) {
            let list = await db.collection('order').skip(i).get()
            all = all.concat(list.data)
        }
        this.setData(
            {
                order_message: all,
                order_count: count
            }
        )

        this.get_num()
        this.showAnalysis()

    },

    showAnalysis: function (e) {
        var that = this
        var cat = []
        for (let i = that.data.day_num; i > 0; i -= 1) {
            var t = utils.mathChangeDate(util.formatTime(new Date()), '-', i, true)

            cat = cat.concat(t)
        }

        this.setData({
            categories: cat
        })

        new wxCharts({
            canvasId: 'columnCanvas',
            type: 'column',
            categories: this.data.categories,
            series: [{
                name: '近7日流水',
                data: this.data.incomeList
            }],
            yAxis: {
                format: function (val) {
                    return val + '元';
                },
            },
            width: 330,
            height: 200
        });


    }


})