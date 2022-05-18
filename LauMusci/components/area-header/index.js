// components/area-header/index.js
Component({
    properties: {
        title: {
            type: String,
            value: "默认歌单"
        },
        rightText: {
            type: String,
            value: "更多"
        },
        showRight: {
            type: Boolean,
            value: "true"
        }
    },

    data: {

    },

    onLoad: function (options) {

    },

    methods:{
        handleClickMore(){
            // 子组件的点击事件发送到外部，外部可以监听到这个事件并做出一些事情 -> home-music中的<area-header>组件中接收
            this.triggerEvent("click")
        }
    }
})