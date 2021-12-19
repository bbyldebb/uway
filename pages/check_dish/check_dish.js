
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
const app = getApp()
const db = wx.cloud.database();
Page({
    data: {
        nbFrontColor: '#000000',
        nbBackgroundColor: '#ffffff',
        audiosrc: '',
        dish_message: [],
        showModalStatus: false,

        name_: "try",
        ID_: '',
        price_: '',
        type_: '',
        desc_:'',
        pic_:'',
        id_: '',
        temp_name: '',
        temp_type: '',
        temp_ID: '',
        temp_price: '',
        temp_pic: '',
        temp_desc: '',
        no_pic:''
    },


    formSubmit(e) {
        var that = this;
        // const db = wx.cloud.database();
        db.collection('dish').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                name: e.detail.value.temp_name,
                ID: e.detail.value.temp_ID,
                description: e.detail.value.temp_desc,
                class: e.detail.value.temp_type,
                image:e.detail.value.temp_pic,
                price:e.detail.value.temp_price,
                soleNum:'0'
            }
        })
            .then(res => {
                this.onLoad({ type: e.detail.value.temp_type })
            })
            .catch(err => {
                console.log("插入dish失败")
            })
    },

    cancel: function (e) {
        this.setData({
            showModalStatus: false
        })
    },
    cancel2: function (e) {
        this.setData({
            showModalStatus2: false
        })
    },
    addit: function (e) {

        this.setData({
            showModalStatus: true
        })

    },

    checkDesert: function (e) {

        this.setData({
            temp_type: "甜品"
        })
    },
    checkFried: function (e) {

        this.setData({
            temp_type: "家常小炒"
        })
    },
    checkSoup: function (e) {

        this.setData({
            temp_type: "滋补靓汤"
        })
    },
    checkSnake: function (e) {

        this.setData({
            temp_type: "夜宵"
        })
    },
    checkSeafood: function (e) {

        this.setData({
            temp_type: "海鲜大餐"
        })
    },
    sub: function (e) {

        this.setData({
            showModalStatus: false
        })
    },
    sub2: function (e) {

        this.setData({
            showModalStatus2: false
        })
    },

    onLoad(options) {
        this.setData({
            nbTitle: '菜单管理',
            temp_type: options.type,
            type_: options.type,
            nbFrontColor: '#ffffff',
            nbBackgroundColor: '#000000',
        })

        //数据库获取数据
        var that = this;
        db.collection('dish').where({ "class": options.type })
            .get()
            .then(res => {
                this.setData(
                    {
                        dish_message: res.data
                    }
                )
            })
            .catch(err => {
                console.log("fail!!!")
            })
    },
    editIt: function (e) {
        this.setData({
            showModalStatus2: true
        })
        var that = this
        db.collection('dish').doc(e.target.dataset.id)
            .get()
            .then(res => {
                this.setData({
                    name_: res.data.name,
                    ID_: res.data.ID,
                    desc_: res.data.description,
                    type_: res.data.class,
                    price_:res.data.price,
                    pic_:res.data.image,
                    id_: e.target.dataset.id
                })
            })
            .catch(err => {
                console.log("fail!!!")
            })
    },
    formSubmit2(e) {

        var that = this;
        db.collection('dish').doc(that.data.id_).update({
            data: {
                name: e.detail.value.temp_name,
                ID: e.detail.value.temp_ID,
                description: e.detail.value.temp_desc,
                class: e.detail.value.temp_type,
                image:e.detail.value.temp_pic,
                price:e.detail.value.temp_price
            },
            success: function (res) {
                that.onLoad({ type: e.detail.value.temp_type })
            }

        })
    },
    deleteIt: function (e) {
        var t = ''
        var that = this
        db.collection('dish').doc(e.target.dataset.id)
            .get()
            .then(res => {
                console.log("res:", res.data.class)
                t = res.data.class
            })

        wx.showModal({
            title: '提示',
            content: '是否确定删除？',
            success(res) {
                if (res.confirm) {
                    db.collection('dish').doc(e.target.dataset.id)
                        .remove()
                        .then(res => {
                            that.onLoad({ type: t })
                        })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    }



})