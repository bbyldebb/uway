// pages/cook/cook.js
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
const app = getApp()
Page({
    data: {
        audiosrc: '',
        dish_message: []

    },
    /**
     * 页面的初始数据
     */
    //  data: {
    //   dish_message:[]
    //      {
    //          _id:"",
    //          description:"",
    //          number:"",
    //          referDish:"",
    //          rederOrder:"",
    //          status:"",
    //      }


    // dish_message: [{
    //         id: 0,
    //         name: "提拉米苏",
    //         ps: "加香菜",
    //         time: "10:30",
    //         state:2
    //     },
    //     {
    //         id: 1,
    //         name: "番茄炒蛋",
    //         ps: "蛋放多一点",
    //         time: "10:25",
    //         state:2
    //     },
    //     {
    //         id: 2,
    //         name: "卤鸡腿",
    //         ps: "要卤的不要炸的",
    //         time: "10:20",
    //         state:2
    //     },
    //     {
    //         id: 3,
    //         name: "干煸四季豆",
    //         ps: "不要放辣椒",
    //         time: "10:18",
    //         state:2
    //     },
    //     {
    //         id: 4,
    //         name: "宫爆鸡丁",
    //         ps: "多放点糖",
    //         time: "10:15",
    //         state:2
    //     },
    // ]
    //  },



    takeit: function (e) {
        var that = this
        var index = e.currentTarget.dataset.index
        var _id = e.currentTarget.dataset.id
        console.log(index)
        console.log(_id)
        that.setData({
            [`dish_message[${index}].state`]: '3'
        })
        console.log(that.data.dish_message[index].state)
        wx.cloud.callFunction({
            name: 'setorderItem',
            data: {
                _id: _id,
                state: '3'
            }
        }).then(res => {
            console.log('云函数更新orderItem数据成功', res)
        }).catch(res => {
            console.log('云函数更新orderItem数据失败', res)
        })
        // console.log(this.data.dish_message[index].status)
        // const db = wx.cloud.database()
        // const _ =db.command 
        // var id = parseInt(e.currentTarget.dataset.index);
        // console.log(String(e.currentTarget.dataset.index))
        // wx.cloud.callFunction({
        //     name:'setorderItem',
        //     data:{
        //         _id:e.currentTarget.dataset.index,
        //         state:"3"
        //     }
        // }).then(res=>{
        //     console.log('云函数更新orderItem数据成功', res)
        // }).catch(res=>{
        //     console.log('云函数更新orderItem数据失败', res)
        // })

        // wx.cloud.database().collection('orderItem').where({
        //     state:_.neq('4')
        // }).watch({
        //     onChange:function(snapshot){
        //         if(snapshot!=null){
        //             for(var i = 0;i<snapshot.docChanges.length;i++){
        //                 if(snapshot.docChanges[i].dataType=='update'){
        //                     console.log((snapshot.docChanges[i].docId));
        //                     var statusstring = `dish_mesuuusage[`+snapshot.docChanges[i].docId+`].status`
        //                     console.log(typeof(statusstring))
        //                     console.log(statusstring)
        //                     that.setData({
        //                         [statusstring]: '3'
        //                     })
        //         }
        //         }
        //         }
        //     },
        //     onError:(err) => {
        //         console.error(err)
        //       }

        // })
    },
    doneit: function (e) {
        var that = this
        var index = e.currentTarget.dataset.index
        var _id = e.currentTarget.dataset.id
        console.log(index)
        console.log(_id)
        that.setData({
            [`dish_message[${index}].state`]: '4'
        })
        console.log(that.data.dish_message[index].state)
        wx.cloud.callFunction({
            name: 'setorderItem',
            data: {
                _id: _id,
                state: '4'
            }
        }).then(res => {
            console.log('云函数更新orderItem数据成功', res)
        }).catch(res => {
            console.log('云函数更新orderItem数据失败', res)
        })
        // this.setData({
        //     [`dish_message[${index}].status`]: 4
        // })
        // console.log(this.data.dish_message[index].status)
    },
    getorderItem() {
        //云函数获取数据
        wx.cloud.callFunction({
            name: 'getorderItem',
        }).then(res => {
            console.log('云函数获取orderItem数据成功', res.result)
            this.setData({
                dish_message: res.result.list
            })
        })
            .catch(res => {
                console.log('云函数获取orderItem数据成功', res)
            })
    },
    onLoad() {
        var that = this
        const db = wx.cloud.database()
        const _ = db.command
        const $ = db.command.aggregate
        //云函数获取数据
        wx.cloud.callFunction({
            name: 'getorderItem',
        }).then(res => {
            console.log('云函数获取orderItem数据成功', res.result)
            this.setData({
                dish_message: res.result.list
            })
        })
            .catch(res => {
                console.log('云函数获取orderItem数据成功', res)
            })
        db.collection('orderItem').watch({
            onChange: snapshot => {
                console.log(snapshot.docChanges)
                console.log(snapshot.docChanges.length)
                for (var i = 0; i < snapshot.docChanges.length; i++) {
                    if (snapshot.docChanges[i].dataType == 'init') {
                        that.data.dish_message.push(snapshot.docChanges[i].doc)
                    }
                }
            },
            onError: function (err) {
                console.error('the watch closed because of error', err)
            }
        })

        //数据库获取数据
    },
    readText: function (e) {
        var name = e.currentTarget.dataset.name
        var desc = e.currentTarget.dataset.ds
        var that = this;
        console.log(name + ' ' + desc)
        this.innerAudioContext = wx.createInnerAudioContext();
        plugin.textToSpeech({
            lang: "zh_CN",
            tts: true,
            content: name + ' ' + desc,
            success: function (res) {
                console.log(res)
                that.setData({
                    audiosrc: res.filename
                })
                console.log(that.data.audiosrc)
                that.readStart();
            },
            fail: function (res) {
                wx.showToast({
                    title: '语音转换失败',
                })
            }
        })
    },
    readStart: function () {
        this.innerAudioContext.src = this.data.audiosrc
        this.innerAudioContext.play();
    }



})