const app = getApp()

Component({
    properties:{
        title:{
            type:String,
            value:"默认歌单"
        },
        songMenu:{
            type:Array,
            value:[]
        }
    },
    data: {
        screenWidth : app.globalData.screenWidth
    },
    methods:{
        handleClickSongItem(event){
            const item = event.currentTarget.dataset.item;
            wx.navigateTo({
              url: `/pages/detail-songs/index?id=${item.id}&type=menu`, //多加一个type参数对不同跳转方式做区分
            })
        }
    }
})