// pages/sign-in/record/record.js
const {$Toast} = require('../dist/base/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'yesterday',
    current_scroll: 'yesterday'
  },
  handleChange ({ detail }) {
    this.setData({
        current: detail.key
    });
    //昨天
    if(detail.key=="yesterday"){
      this.defaultTime()
    }
    //今天
    if(detail.key=="today"){
      wx.request({
        url: 'https://yoyolove.xyz/signIn/queryHistory',
        success:res=>{
          var list=new Array()
          var loginTime,logoutTime;
          if(res.data.code==200){
            console.log(res.data.extend.allHistory)
            //当前时间
            var nowadayT=new Date()
            //当前时间的 0 点时候的时间
            nowadayT=nowadayT.getFullYear()+"-"+(nowadayT.getMonth()+1)+"-"+nowadayT.getDate()+" "+"0:0:0"
            var nowaday=new Date(parseInt(nowadayT))//获得 0 点时候的时间戳
            for(var i=0;i<res.data.extend.allHistory.length;i++){
              if(nowaday.getTime()<=res.data.extend.allHistory[i].loginTime<=nowaday.getTime()+86400000){
                //new Date()解析时间戳，转化为时间格式 parseInt将字符串转化为整数
                loginTime=new Date(parseInt(res.data.extend.allHistory[i].loginTime));//签到时间
                logoutTime=new Date(parseInt(res.data.extend.allHistory[i].logoutTime));//签退时间

                loginTime=loginTime.getFullYear()+"年"+(loginTime.getMonth()+1)+"月"+loginTime.getDate()+"日"+" "
                +loginTime.getHours()+"时"+loginTime.getMinutes()+"分"+loginTime.getSeconds()+"秒"
                logoutTime=logoutTime.getFullYear()+"年"+(logoutTime.getMonth()+1)+"月"+logoutTime.getDate()+"日"+" "
                +logoutTime.getHours()+"时"+logoutTime.getMinutes()+"分"+logoutTime.getSeconds()+"秒"

                list.push({
                  sid:res.data.extend.allHistory[i].sid,
                  sname:res.data.extend.allHistory[i].sname,
                  loginTime:loginTime,
                  logoutTime:logoutTime
                })
              }
            }
            this.setData({
              recordList:list
            })
          }else{
            $Toast({
              content: '获取数据失败',
              type: 'error'
           });
          }
        }
      })
    }
    //全部
    if(detail.key=="all"){//604800000
      //当前日（星期几）
      var Day=new Date()
      wx.request({
        url: 'https://yoyolove.xyz/signIn/queryHistory',
        success:res=>{
          if(res.data.code==200){
            console.log(res.data.extend.allHistory)
            var list=new Array()
            // var day=Day.getDay()
            var loginTime,logoutTime
            for(var i=0;i<res.data.extend.allHistory.length;i++){
              loginTime=new Date(parseInt(res.data.extend.allHistory[i].loginTime))
              logoutTime=new Date(parseInt(res.data.extend.allHistory[i].logoutTime))

              loginTime=loginTime.getFullYear()+"年"+(loginTime.getMonth()+1)+"月"+loginTime.getDate()+"日"+" "
              +loginTime.getHours()+"时"+loginTime.getMinutes()+"分"+loginTime.getSeconds()+"秒"

              logoutTime=logoutTime.getFullYear()+"年"+(logoutTime.getMonth()+1)+"月"+logoutTime.getDate()+"日"+" "
              +logoutTime.getHours()+"时"+logoutTime.getMinutes()+"分"+logoutTime.getSeconds()+"秒"
              list.push({
                sid:res.data.extend.allHistory[i].sid,
                sname:res.data.extend.allHistory[i].sname,
                loginTime:loginTime,
                logoutTime:logoutTime
              })
            }
            this.setData({
              recordList:list
            })            
          }
        }
      })
    }
},
handleChangeScroll ({ detail }) {
  this.setData({
      current_scroll: detail.key
  });
},
//默认时间(昨天)
defaultTime:function(){
  wx.request({
    url: 'https://yoyolove.xyz/signIn/queryHistory',
    success:res=>{
      if(res.data.code=200){
        console.log(res.data.extend.allHistory)
        var list=new Array()
        var loginT,logoutT//签到时间，签退时间
        var loginTime,logoutTime
        var nowTime=new Date()
        var yesterdayT,yesT//昨天时间，昨天
        //今天时间 (时间戳)
        nowTime=nowTime.getTime()
        //昨天时间
        yesterdayT=new Date(parseInt(nowTime-86400000))
        yesterdayT=yesterdayT.getFullYear()+"年"+(yesterdayT.getMonth()+1)+"月"+yesterdayT.getDate()+"日"
        
        for(var i=0;i<res.data.extend.allHistory.length;i++){
          //昨天(通过登录时间判断)
          yesT=new Date(parseInt(res.data.extend.allHistory[i].loginTime))
          yesT=yesT.getFullYear()+"年"+(yesT.getMonth()+1)+"月"+yesT.getDate()+"日"
          // console.log(yesT)
          if(yesterdayT==yesT){
            //昨天的签到时间
            loginTime=res.data.extend.allHistory[0].loginTime
            loginT=new Date(parseInt(loginTime))
            loginT=loginT.getFullYear()+"年"+(loginT.getMonth()+1)+"月"+loginT.getDate()+"日"+" "
              +loginT.getHours()+"时"+loginT.getMinutes()+"分"+loginT.getSeconds()+"秒"
              
            //昨天的签退时间
            logoutTime=res.data.extend.allHistory[i].logoutTime
            logoutT=new Date(parseInt(logoutTime))
            logoutT=logoutT.getFullYear()+"年"+(logoutT.getMonth()+1)+"月"+logoutT.getDate()+"日"+" "
              +logoutT.getHours()+"时"+logoutT.getMinutes()+"分"+logoutT.getSeconds()+"秒"
            list.push({
              sid:res.data.extend.allHistory[i].sid,
              sname:res.data.extend.allHistory[i].sname,
              loginTime:loginT,
              logoutTime:logoutT
             })
           }
          }
          this.setData({
            recordList:list
          })
      }else{
          $Toast({
              content: '获取数据失败',
              type: 'error'
          });
      }
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.defaultTime()//默认时间
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