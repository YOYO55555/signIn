// pages/sign-in/status/status.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'https://yoyolove.xyz/signIn/queryAllUser',
      success:res=>{
        console.log(res.data.extend.allUser)
        var list=new Array()
        var Status
        var date
        var totalTime
        // console.log(date.getHours()+"时"+date.getMinutes()+"分"+date.getSeconds()+"秒")
        for(var i=0;i<res.data.extend.allUser.length;i++){
          if(res.data.extend.allUser[i].status!="1"){
            Status="离线"
          }
          if(res.data.extend.allUser[i].status=="1"){
            Status="在线"
          }
          if(res.data.extend.allUser[i].totalTime==null){
            totalTime=null
          }else{
            date=new Date(parseInt(res.data.extend.allUser[i].totalTime))
            totalTime=(date.getHours()-8)+"时"+date.getMinutes()+"分"+date.getSeconds()+"秒"
          }
          list.push(
            {
              name:res.data.extend.allUser[i].sname,
              totalTime:totalTime,
              status:Status
            }
          )
        }
        this.setData({
          number:list
        })
      },
      fail:res=>{
        console.log("接口调用失败")
      }
    })
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