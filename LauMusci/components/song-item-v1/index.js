import {playerStore} from '../../store/player-store'

Component({
    // 存放外部传递过来的数据
    properties: {
        // 接收home-music里html里recommendSongs里的item
        item:{
            type:Object,
            value:{}
        }
    },

    methods:{
        handleClickItemSong(event){
            // 区分点击的是哪首歌曲
            // 获取某一首歌曲的id -> 方式一： const id = this.properties.item.id
            // 方式二：
            const id = event.currentTarget.dataset.id
            // 1.页面跳转
            wx.navigateTo({
                // url?后面的值对应onload里的options
              url: '/pages/music_player/index?id=' + id,
            }),
            // 2.根据歌曲id向store发送请求播放
            playerStore.dispatch("playMusicWithSongIdAction",{id})
        }
    }
})