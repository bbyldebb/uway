
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
const app = getApp()
const db = wx.cloud.database();
Page({
    data: {
        nbFrontColor: '#000000',
        nbBackgroundColor: '#ffffff',
        audiosrc: '',
        staff_message: [],
        showModalStatus: false,

        name_: "try",
        ID_: '',
        pwd_: '',
        type_: '',
        id_: '',
        temp_name: '',
        temp_position: '',
        temp_number: '',
        temp_password: '',
        temp_type: '',
    },


    formSubmit(e) {
        console.log(e.detail.value)
        console.log(e.detail.value.temp_name)
        var that = this;
        // const db = wx.cloud.database();
        db.collection('staff').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                name: e.detail.value.temp_name,
                ID: e.detail.value.temp_number,
                password: e.detail.value.temp_password,
                type: e.detail.value.temp_position
            }
        })
            .then(res => {
                this.onLoad({ type: e.detail.value.temp_position })
            })
            .catch(err => {
                console.log("插入staff失败")
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

    checkCook: function (e) {

        this.setData({
            temp_type: "cook"
        })
    },
    checkWaiter: function (e) {

        this.setData({
            temp_type: "waiter"
        })
    },
    checkBusboy: function (e) {

        this.setData({
            temp_type: "busboy"
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
        console.log("接受shoufengqin页面传递过来的参数：", options.type)
        this.setData({
            nbTitle: '员工管理',
            temp_type: options.type,
            type_: options.type,
            nbFrontColor: '#ffffff',
            nbBackgroundColor: '#000000',
        })

        //数据库获取数据
        var that = this;
        db.collection('staff').where({ "type": options.type })
            .get()
            .then(res => {
                this.setData(
                    {
                        staff_message: res.data
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
        console.log('成功弹出编辑对话框', e.target.dataset.id)
        db.collection('staff').doc(e.target.dataset.id)
            .get()
            .then(res => {
                console.log("res:", res.data)
                this.setData({
                    name_: res.data.name,
                    ID_: res.data.ID,
                    pwd_: res.data.password,
                    type_: res.data.type,
                    id_: e.target.dataset.id
                })
            })
            .catch(err => {
                console.log("fail!!!")
            })
    },
    formSubmit2(e) {
        console.log(e.detail.value)
        console.log(e.detail.value.temp_name)
        var that = this;
        db.collection('staff').doc(that.data.id_).update({
            data: {
                name: e.detail.value.temp_name,
                ID: e.detail.value.temp_number,
                password: e.detail.value.temp_password,
                type: e.detail.value.temp_position
            },
            success: function (res) {
                that.onLoad({ type: e.detail.value.temp_position })
            }

        })
    },
    deleteIt: function (e) {
        console.log("准备删除", e)
        console.log("准备删除", e.target.dataset.id)
        var t = ''
        var that = this
        db.collection('staff').doc(e.target.dataset.id)
            .get()
            .then(res => {
                console.log("res:", res.data.type)
                t = res.data.type
            })

        wx.showModal({
            title: '提示',
            content: '是否确定删除？',
            success(res) {
                if (res.confirm) {
                    db.collection('staff').doc(e.target.dataset.id)
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