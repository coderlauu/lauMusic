Component({
    options: {
        // 小程序中若使用多个插槽，要开启这个选项
        multipleSlots: true
    },
    properties: {
        title: { //接收外部的标题文本，
            type: String,
            value: "默认标题"
        }
    },
    data: {
        // 获取APP.js的设备状态栏高度--动态获取
        statusBarHeight: getApp().globalData.statusBarHeight,
        navBarHeight: getApp().globalData.navBarHeight
    },

    methods: {
        handleBackLast() {
            // 返回上一层的功能不止在这里使用，外部用到这个事件的地方绑定这个自定义事件bind:click
            this.triggerEvent('click')
        }
    }


})