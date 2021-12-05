Page({
  data: {
    menuClass:[],
    /*
    menuClass: [
      {
        className: '全部菜品'
      },
      {
        className: '果木熏烤系列'
      },
      {
        className: '全家欢乐享套餐'
      },
      {
        className: '主食'
      },
      {
        className: '特色酱卤五花肉'
      },
      {
        className: '感恩回馈超值套餐'
      },
      {
        className: '加点汤'
      },
      {
        className: '秘制大骨系列'
      },
      {
        className: '暖冬热饮'
      }
    ],*/
    menuDetail:[],

/*
    menuDetail: [{
        dishName: '一斤酱骨头加配菜',
        dishPrice: '30',
        dishInfo: '这里是菜品描述菜品菜品...',
        dishImg: 'http://taohuazui.com.cn/wcs/Upload/201706/59424b6794e92.jpg'
      },
      {
        dishName: '烤鱼',
        dishPrice: '30',
        dishInfo: '这里是菜品描述菜品菜品...',
        
      },
      {
        dishName: '土豆鸡块',
        dishPrice: '30',
        dishInfo: '这里是菜品描述菜品菜品...',
        dishImg: 'http://5b0988e595225.cdn.sohucs.com/images/20171114/d76bfa75505c4ac08e395d44cec39f83.jpeg'
      },
      {
        dishName: '清蒸虾爬子',
        dishPrice: '30',
        dishInfo: '这里是菜品描述菜品菜品...',
        dishImg: 'https://gss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/aa64034f78f0f73670d872490755b319ebc41357.jpg'
      },
      {
        dishName: '红烧鸡',
        dishPrice: '30',
        dishInfo: '这里是菜品描述菜品菜品...',
        dishImg: 'https://img.zcool.cn/community/01f1825d317ba2a8012187f4df0324.jpg@1280w_1l_2o_100sh.jpg'
      },
      {
        dishName: '秋葵',
        dishPrice: '30',
        dishInfo: '这里是菜品描述菜品菜品...',
        dishImg: 'https://img.zcool.cn/community/01d0875cad95c9a801208f8bee9463.jpg@1280w_1l_2o_100sh.jpg'
      }
    ]*/
    curnav: '全部菜品',
    cuvindex: 0
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
        console.log('云函数获取dish数据成功', res.result)
        this.setData({
          menuDetail: res.result.data,
          curindex :0,
          curnav:"全部菜品"
      })
        let dishclass = new Set(); 
        dishclass.add("全部菜品")
        for(var i = 0;i<res.result.data.length;i++){
          console.log(that.data.menuDetail[i]);
           dishclass.add(that.data.menuDetail[i].class)
        }
       
        dishclass = Array.from(dishclass)
        dishclass = {...dishclass}
        this.setData({
          menuClass:dishclass,
      })
      console.log(that.data.menuClass)
        
    })
        .catch(res => {
            console.log('云函数获取orderItem数据成功', res)
        })
    
    },
    showExplicit(e){
      var i = e.currentTarget.dataset.name;
      if(i=='全部菜品'){
        this.setData({
          curindex: 0
       })
      }else{
      this.setData({
       curnav: i,
       curindex:1

    })
  }
      console.log(this.data.curnav)
    },
  showDetail(e) {
    var i = e.currentTarget.dataset.index;
    wx.showModal({
      title: this.data.menuDetail[i].name,
      content: this.data.menuDetail[i].description,
      //Image: this.data.menuDetail[i].dishImg,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
          else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
          console.log('用户点击确定')
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
  }
})