var startPoint;
Page(
    {
        data: {
            // 1=修改；2=增加、确认
            index: 1,
            temp: 1,
            completed: false,  // 弹窗控制
            deposit: 0,
            windowHeight: '',
            windowWidth: '',
            mysql1: [],
            lastesttable: 0
        },
        Change: function (e) {
            wx.showToast({
                title: "拖动桌子进行布局",
                icon: 'none',
                duration: 1800
            })
            this.setData({
                index: 2
            })

        },
        // 取消按钮触发事件
        cancelSelected(e) {
            this.setData({
                completed: false
            })

        },
        //确定
        Confirm: function (e) {
            var that = this
            wx.showModal({
                title: '改变布局',
                content: '确定保存改变的布局？',
                showCancel: true,//是否显示取消按钮      
                cancelText: "取消",//默认是“取消”      
                cancelColor: '#DEB887',//取消文字的颜色      
                confirmText: "确定",//默认是“确定”      
                confirmColor: '#DEB887',//确定文字的颜色      
                success: function (res) {
                    if (res.cancel) {
                        //点击取消,默认隐藏弹框        
                    } else {

                        //找到一个不一样的就改变数据库
                        var i = 1
                        wx.showLoading({
                            title: '布局中...',
                            mask: true
                        })

                        run()
                        async function run() {
                            if (i < that.data.mysql1.length) {
                                console.log("sdada", that.data.mysql1[i].ID)
                                await wx.cloud.callFunction({
                                    name: 'AddTablePosition',
                                    data: {
                                        id: that.data.mysql1[i].ID,
                                        x: that.data.mysql1[i].PositionX,
                                        y: that.data.mysql1[i].PositionY,
                                    }
                                }).then(res => {

                                    console.log('云函数更新数据成功', res)

                                })
                                    .catch(res => {
                                        console.log('云函数更新数据失败', res)
                                    })

                                // }

                                i++;
                                run()
                            }
                            else {

                                that.setData({
                                    index: 1,
                                    mysql1: that.data.mysql
                                })
                                wx.hideLoading()

                                wx.showToast({
                                    title: "布局成功!",
                                    icon: 'success',
                                    duration: 1500
                                })
                            }
                        }

                    }
                },
                fail: function (res) {
                    wx.showToast({
                        title: "请重试!",
                        icon: 'none',
                        duration: 1500
                    })
                },//接口调用失败的回调函数      
                complete: function (res) {
                },//接口调用结束的回调函数（调用成功、失败都会执行）   
            })
        },

        SetLastest() {
            var that = this
            var last = this.data.mysql.length
            var max = 0
            for (var i = 1; i < last; i++) {
                if (that.data.mysql[i].ID > max) {
                    max = that.data.mysql[i].ID
                }
            }
            max = parseInt(max) + 1

            var i = 0
            var m = 0
            for (i = 1; i <= max; i++) {

                var temp = false
                for (m = 1; m < last; m++) {
                    // console.log(that.data.mysql[m].ID)
                    if (parseInt(that.data.mysql[m].ID) == i) {
                        temp = true
                        break
                    }

                }
                if (!temp) {
                    last = i
                    break
                }

            }
            // console.log(last)
            this.setData({
                lastesttable: last
            })


        },
        Cancel() {
            this.onLoad()
            wx.showToast({
                title: "取消前一次的布局操作!",
                icon: 'none',
                duration: 1500
            })

        },
        //得到用户输入
        getUserInput(event) {
            const num = event.detail.value || event.detail.text
            console.log(num)
            this.setData({ deposit: num })
        },

        // 确定按钮触发事件
        successSelected(event) {
            var that = this
            if (!(/(^[0-9]*$)/.test(this.data.deposit))) {
                wx.showToast({
                    title: '只能输入纯数字!',
                    icon: 'none',
                    duration: 2000
                })
            } else {
                var temp = false
                for (var i in that.data.mysql1) {
                    if (that.data.mysql1[i].ID == that.data.deposit) {
                        temp = true
                    }
                }
                if (temp) {
                    wx.showToast({
                        title: '已有该桌子，请输入正确的桌号!',
                        icon: 'none',
                        duration: 2000
                    })
                }
                else {

                    console.log("成功")
                    wx.showLoading({
                        title: '添加中...'
                    })
                    wx.cloud.callFunction({
                        name: 'AddTable',
                        data: {
                            id: that.data.deposit,
                            x: 0,
                            y: 0
                        }
                    }).then(res => {
                        that.setData({
                            mysql1: that.data.mysql,
                            completed: false
                        })

                        wx.hideLoading();
                        wx.showToast({
                            title: "添加成功!",
                            icon: 'success',
                            duration: 1500
                        })
                        // console.log("成功")
                    })
                        .catch(res => {
                            console.log('云函数更新数据失败', res)
                        })
                }
            }
        },
        SetTable: function (e) {
            this.setData({
                completed: true
            })
        },

        async onLoad() {
            var that = this;
            wx.getSystemInfo({
                success: function (res) {
                    // console.log(res);

                    // // 屏幕宽度、高度
                    // console.log('height=' + res.screenHeight);
                    // console.log('width=' + res.screenWidth);
                    let pr=res.pixelRatio
                    console.log(pr)
                    // 高度,宽度 单位为px
                    that.setData({
                        windowHeight: res.windowHeight,
                        windowWidth: res.windowWidth,
                        buttonLeft: (res.windowWidth) * 0.13,
                        buttonTop: (res.windowHeight) * 0.055,
                        temp: 1
                    })
                }
            })

            await wx.cloud.callFunction({
                name: 'GetTable',
            }).then(res => {
                console.log('云函数读取orderItem数据成功', res.result.data)
                this.setData({
                    mysql1: res.result.data
                })

            })
                .catch(res => {
                    console.log('云函数获取orderItem数据失败', res)
                })

            this.WatchTable()


        },
        //监听table变化
        async WatchTable() {
            // if (this.data.index != 1) {
            var that = this
            const db = wx.cloud.database()
            await db.collection('table').watch({
                onChange: snapshot => {
                    console.log(snapshot.docs)
                    that.setData({
                        mysql: snapshot.docs,
                    })
                    console.log(that.data.mysql)
                    that.SetLastest()


                },
                onError: function (err) {
                    console.error("监听失败", err)
                }
            })

            // }
        },

        buttonStart: function (e) {
            startPoint = e.touches[0]
        },
        async buttonMove(e) {
            var that = this
            // console.log(9,that.data.mysql[7].PositionX,that.data.mysql1[7].PositionX)
            // console.log(9,that.data.mysql[7].PositionY,that.data.mysql1[7].PositionY)
            var i = 0
            var dataid = e.currentTarget.dataset.item;
            for (i = 0; i < this.data.mysql.length; i++) {
                if (this.data.mysql[i].ID == dataid) {
                    break
                }
            }
            // console.log(i+1)
            if (this.data.index != 1) {
                // console.log(dataid)
                var endPoint = e.touches[e.touches.length - 1]
                var translateX = endPoint.clientX - startPoint.clientX
                var translateY = endPoint.clientY - startPoint.clientY
                startPoint = endPoint
                var buttonTop = this.data.mysql1[i].PositionY + translateY
                var buttonLeft = this.data.mysql1[i].PositionX + translateX
                //判断是移动否超出屏幕
                if (buttonLeft +200>= that.data.windowWidth-that.data.buttonLeft*2) {
                    buttonLeft = that.data.windowWidth-200-that.data.buttonLeft*2;
                }
                if (buttonLeft <= 0) {
                    buttonLeft = 0;
                }
                if (buttonTop <= 10) {
                    buttonTop = 10
                }
                if (buttonTop + 150 >= this.data.windowHeight * 0.94) {
                    buttonTop = this.data.windowHeight * 0.94 - 150;
                }
                // console.log(this.data.buttonTop,this.data.buttonLeft)
                this.data.mysql1[i].PositionY = buttonTop
                this.data.mysql1[i].PositionX = buttonLeft
                this.setData({
                    mysql1: this.data.mysql1
                })
                // console.log(dataid)
            }
        },
        buttonEnd: function (e) {


        },
        Refer(e) {
            var dataid = e.currentTarget.dataset.item;
            var that = this
            var length = this.data.mysql1.length
            wx.showModal({
                title: '初始化界面',
                content: '确定初始化布局？',
                showCancel: true,//是否显示取消按钮      
                cancelText: "取消",//默认是“取消”      
                cancelColor: '#DEB887',//取消文字的颜色      
                confirmText: "确定",//默认是“确定”      
                confirmColor: '#DEB887',//确定文字的颜色  
                success: function (res) {
                    if (res.cancel) {
                        //点击取消,默认隐藏弹框        
                    } else {
                        var i = 1
                        wx.showLoading({
                            title: '初始化中...'
                        })
                        run()
                        async function run() {
                            if (i < that.data.mysql1.length) {
                                var x = parseInt((i - 1) % 4)
                                var y = parseInt((i - 1) / 4)
                                await wx.cloud.callFunction({
                                    name: 'AddTablePosition',
                                    data: {
                                        id: that.data.mysql1[i].ID,
                                        x: x * 200 + 10,
                                        y: y * 200 +10
                                    }
                                }).then(res => {

                                    console.log('云函数更新数据成功', res)

                                })
                                    .catch(res => {
                                        console.log('云函数更新数据失败', res)
                                    })
                                i++;
                                run()
                            }
                            else {

                                that.setData({
                                    index: 1,
                                    mysql1: that.data.mysql
                                })

                                wx.hideLoading();

                                wx.showToast({
                                    title: "初始化成功!",
                                    icon: 'success',
                                    duration: 1500
                                })


                            }
                        }

                    }
                },
                fail: function (res) {
                    wx.showToast({
                        title: "请重试!",
                        icon: 'none',
                        duration: 1500
                    })
                },//接口调用失败的回调函数      
                complete: function (res) {
                },//接口调用结束的回调函数（调用成功、失败都会执行）   
            })

        },
        clicks(e) {
            var id = ""
            var dataid = e.currentTarget.dataset.item;
            for (var i in this.data.mysql) {
                if (this.data.mysql[i].ID == dataid) {
                    id = this.data.mysql[i]._id
                    break
                }
            }
            if (this.data.temp == 2 && this.data.index == 1) {
                var that = this
                var length = this.data.mysql1.length
                wx.showModal({
                    title: '删除后无法恢复哦!',
                    content: '确定删除第' + dataid + '桌？',
                    showCancel: true,//是否显示取消按钮      
                    cancelText: "取消",//默认是“取消”      
                    cancelColor: '#DEB887',//取消文字的颜色      
                    confirmText: "确定",//默认是“确定”      
                    confirmColor: '#DEB887',//确定文字的颜色      
                    success: function (res) {
                        if (res.cancel) {
                            //点击取消,默认隐藏弹框        
                        } else {
                            wx.showLoading({
                                title: '删除中...'
                            })

                            wx.cloud.callFunction({
                                name: 'DeleteTable',
                                data: {
                                    _id: id
                                }
                            }).then(res => {
                                that.setData({
                                    mysql1: that.data.mysql,
                                    temp: 1
                                })
                                wx.hideLoading();
                                wx.showToast({
                                    title: "删除成功!",
                                    icon: 'success',
                                    duration: 1500
                                })
                                // console.log("成功")
                            })
                                .catch(res => {
                                    console.log('云函数删除数据失败', res)
                                })

                        }
                    },
                    fail: function (res) {
                        wx.showToast({
                            title: "请重试!",
                            icon: 'none',
                            duration: 1500
                        })
                    },//接口调用失败的回调函数      
                    complete: function (res) {
                    },//接口调用结束的回调函数（调用成功、失败都会执行）   
                })



            }
        },
        Delete() {
            wx.showToast({
                title: "请点击桌子进行删除!",
                icon: 'none',
                duration: 1500
            })
            this.setData({
                temp: 2
            })
        }





    }
)
