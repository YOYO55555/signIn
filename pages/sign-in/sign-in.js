// pages/sign-in/sign-in.js
const { $Message } = require('./dist/base/index');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLeft1:false,
    studentId:"",
    studentName:"",
    openid:"",
    display:"none",
    signInSuccess:0,
    signOutSuccess:1,
    //登陆时间
    date:""
  },
  // 签到
  sign_In () {
    if(this.signInSuccess==1){
      $Message({
          content: '您已成功签到，请勿重复',
          type: 'warning',
          duration:5
      });
    }else{
      wx.request({
        url: 'https://yoyolove.xyz/signIn/login?sid='+wx.getStorageSync(this.openid)+"&sname="+wx.getStorageSync(this.openid+"_Name"),
        success:res=>{
          console.log(res)
          if(res.data.code==200){
            // 签到成功提醒
            $Message({
              content: '签到成功',
              type: 'success'
            });
            this.signInSuccess=1
            this.signOutSuccess=0
          }else{
            $Message({
              content: '签到失败',
              type: 'error'
          });
          }
        },
        fail:res=>{
          console.log("接口调用失败")
        }
      })
    }
    
},
// 学号变化
studentIdChange:function(event){
  this.studentId=event.detail.detail.value
},
// 姓名变化
studentNameChange:function(event){
  this.studentName=event.detail.detail.value
},

//签退
sign_out () {
  if(this.signOutSuccess==1){
    $Message({
        content: '请点击签到',
        type: 'warning',
        duration:3
    });
  }else{
    wx.request({
      url: 'https://yoyolove.xyz/signIn/logout?sid='+wx.getStorageSync(this.openid)+"&sname="+wx.getStorageSync(this.openid+"_Name"),
      success:res=>{
        if(res.data.code==200){
          console.log(res)
          $Message({
            content: '签退成功',
            type: 'success'
          });
          this.signOutSuccess=1
          this.signInSuccess=0
        }else{
          $Message({
            content: '签退失败',
            type:'error'
          });
        }
      },
      fail:res=>{
        console.log("接口调用失败")
      }
    })
  }
},

// 清空登陆信息
cancle:function(){
  var that=this
  this.studentId=""
  this.studentName=""
  that.setData({
    studentId:this.studentId,
    studentName:this.studentName
  })
},

// 登陆
Login:function(){
  var that=this
  if(this.studentId==undefined||this.studentName==undefined){
    this.studentId=""
    this.studentName=""
  }
  if(this.studentId.length!=0&&this.studentName.length!=0){
    wx.request({
      url: 'https://yoyolove.xyz/signIn/login?sid='+this.studentId+"&sname="+this.studentName,
      method:"POST",
      success:res=>{
        // console.log(res)
        var date=new Date()
        date=date.getFullYear()+"年"+(date.getMonth()+1)+"月"+date.getDate()+"日"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
        this.date=date
        // 将信息存入本地仓库，下次进入小程序，信息从storage中获取 (key:value)
        wx.setStorageSync(this.openid, this.studentId)
        wx.setStorageSync(this.openid+"_Name", this.studentName)

        if(res.data.code==200){
          wx.request({
            url: 'https://yoyolove.xyz/getOpenId/openId?sid='+this.studentId+"&sname="+this.studentName+"&openId="+this.openid+"&func=login",
            method:"POST",
            dataType:"json",
            success:res=>{
              console.log(res.data)
              this.setData({
                sid:this.studentId,
                sname:this.studentName,
                display:"none"
              })
            }
          })
        }
      },
      fail:res=>{
        console.log("获取数据失败")
      }
    })
  }else{
    wx.showToast({
      title: '请输入完整信息',
      icon:"error",
      duration:1500
    })
  }
},
// 判断是否不是初次登陆
getOpenId:function(){
  wx.request({
    url: 'https://yoyolove.xyz/getOpenId/openId?openId='+this.openid+"&func=isFirst",
    method:"POST",
    dataType:"json",
    success:res=>{
      console.log(res.data)
      //202表示第一次登录
      if(res.data.status=="202"){
        this.setData({
          display:"block"
        })
      }else{
        wx.setStorageSync(this.openid, res.data.sid)
        wx.setStorageSync(this.openid+"_Name", res.data.sname)
        this.setData({
          sid:res.data.sid,
          sname:res.data.sname,
          display:"none"
        })
      }
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.login({
      success:res=>{
        wx.request({//'https://yoyolove.xyz/getOpenId/openId?appid=wx4504356d85bfe9bc&secret=8615e69d3246d87b33c1033597a3dbe5&js_code='+res.code,
          url:'https://yoyolove.xyz/getOpenId/openId?appid=wx4504356d85bfe9bc&secret=8615e69d3246d87b33c1033597a3dbe5&js_code='+res.code+"&func=getOpenId",
          method:"GET",
          dataType:"json",
          success:res=>{
            console.log(res.data)
            this.openid=res.data.data.openid
            this.getOpenId()
          }
        })
      }
    })
    this.signInSuccess=0
    this.signOutSuccess=1
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