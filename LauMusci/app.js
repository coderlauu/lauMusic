// app.js
App({
    // 生命周期--当程序启动的时候
    onLaunch(){
        // 获取不同设备的屏幕信息
        const info = wx.getSystemInfoSync()
        // 获取屏幕宽高
        this.globalData.screenHeight= info.screenHeight
        this.globalData.screenWidth= info.screenWidth
        // 获取设备状态栏高度
        this.globalData.statusBarHeight = info.statusBarHeight
        // 计算设备高宽比
        this.globalData.deviceRadio = info.screenHeight / info.screenWidth
    },
    globalData:{
        // 获取手机屏幕的宽高
        screenWidth:0,
        screenHeight:0,
        statusBarHeight:0,
        // 初始化导航栏高度
        navBarHeight:44,
        deviceRadio:0
    }
})
