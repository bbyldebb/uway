 Page({
   data: {
     menuClass: [],
     menuDetail: [],
     curnav: '全部菜品',
     cuvindex: 0,
     showDishCard: false,
     cardID: 233,
     flag: true,
     totalMoney: 0,
     totalNum: 0,
     orderDetail: [],
     showCart: true
   },
   onLoad() {
     var that = this
     const db = wx.cloud.database()
     const _ = db.command
     const $ = db.command.aggregate
     //云函数获取数据
     wx.cloud.callFunction({
         name: 'getdish',
       }).then(res => {
         let newArr = res.result.data.map(item => {
           item.num = 0;
           return item;
         });
         this.setData({
           menuDetail: newArr,
           curindex: 0,
           curnav: "全部菜品"
         })
         let dishclass = new Set();
         dishclass.add("全部菜品")
         for (var i = 0; i < res.result.data.length; i++) {
           dishclass.add(that.data.menuDetail[i].class)
         }

         dishclass = Array.from(dishclass)
         dishclass = {
           ...dishclass
         }
         this.setData({
           menuClass: dishclass,
         })

       })
       .catch(res => {})
     // //获取订单购物车缓存数据
     // let temp = wx.getStorageSync('cart')
     // this.setData({
     //   orderDetail: temp
     // })
   },
   showExplicit(e) {
     var i = e.currentTarget.dataset.name;
     if (i == '全部菜品') {
       this.setData({
         curindex: 0
       })
     } else {
       this.setData({
         curnav: i,
         curindex: 1
       })
     }
   },
   showDetail(e) {
     if (this.data.flag == true) {
       var i = e.currentTarget.dataset.index;
       this.setData({
         showDishCard: true,
         cardID: this.data.menuDetail[i].ID
       });
     }
     this.setData({
       flag: true
     })
     //console.log(this.data.menuDetail[i].ID)
     //console.log(this.data.cardID)
   },
   AddorMinus() {
     this.setData({
       flag: false
     })
   },
   addDish(e) {
     var i = e.currentTarget.dataset.index;
     var ID = this.data.menuDetail[i].ID;
     let order = this.data.orderDetail;
     let newArr = this.data.menuDetail.map(item => {
       if (item.ID == ID) {
         item.num += 1;
         //判断是否已经在订单中存在
         for (var j = 0; j < order.length; j++) {
           if (order[j].ID == ID) {
             order[j].num = item.num
             return item;
           }
         }
         order.push(item);
       }
       return item;
     });
     this.setData({
       menuDetail: newArr,
       totalNum: this.data.totalNum += 1,
       totalMoney: this.data.totalMoney += (Number)(this.data.menuDetail[i].price),
       orderDetail: order
     });
     //wx.setStorageSync('cart', order);
   },
   minusDish(e) {
     var i = e.currentTarget.dataset.index;
     var ID = this.data.menuDetail[i].ID;
     if (this.data.menuDetail[i].num >= 1) {
       let order = this.data.orderDetail;
       let newArr = this.data.menuDetail.map(item => {
         if (item.ID == ID) {
           item.num = item.num - 1;
           for (var j = 0; j < order.length; j++) {
             if (order[j].ID == ID) {
               order[j].num = item.num
               if (order[j].num == 0) {
                 order = order.filter(function (orderItem) {
                   return orderItem.ID != ID;
                 })
               }
               return item;
             }
           }
         }
         return item;
       });
       this.setData({
         menuDetail: newArr,
         totalNum: this.data.totalNum -= 1,
         totalMoney: this.data.totalMoney -= (Number)(this.data.menuDetail[i].price),
         orderDetail: order
       });
       //wx.setStorageSync('cart', order);
     }
   },
   callWaiter() {
     var that = this
     const db = wx.cloud.database()
     const _ = db.command
     const $ = db.command.aggregate
     wx.showModal({
       title: '顾客您好',
       content: '是否需要呼叫服务员',
       success(res) {
         if (res.confirm) {
           wx.cloud.callFunction({
             name: 'callWaiter',
             data: {
               tableid: 1,
               callWaiter: '1'
             }
           }).then(res => {
             console.log('云函数更新table数据成功', res)
           }).catch(res => {
             console.log('云函数更新table数据失败', res)
           })
         } else if (res.cancel) {
           console.log('用户点击取消')
         }
       }
     })
   },
   showCart() {
     this.setData({
       showCart: true
     })
   },
   hideCart() {
     this.setData({
       showCart: false
     })
   },
 })