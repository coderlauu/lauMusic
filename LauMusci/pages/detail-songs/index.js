// 引入store
import {
    rankingStore
} from '../../store/ranking-store'
import {
    getSongMenuDetail
} from '../../service/api_music'
import {
    playerStore
} from '../../store/player-store'

Page({
    data: {
        rankingInfo: {},
        songMenuInfo: {}
    },

    onLoad: function (options) {
        const type = options.type
        if (type === 'menu') {
            const id = options.id
            // 从服务器获取歌单详情数据
            getSongMenuDetail(id).then(res => {
                this.setData({
                    songMenuInfo: res.playlist
                })

            })
        } else if (type === 'rank') {
            const ranking = options.ranking
            // 从store获取歌曲数据
            rankingStore.onState(ranking, (res) => {
                this.setData({
                    rankingInfo: res
                })
            })
        }
    },

    // 单击歌曲组件发送歌曲数据请求
    handleSongItemClick(event){
        // 记录点击的歌曲索引
        const index =  event.currentTarget.dataset.index
        // 将当前歌曲所对应的列表放入store里、当前索引值也放入store里 ->回到store里封装上一首、下一首的函数
        playerStore.setState("playListSongs",this.data.rankingInfo.tracks)
        playerStore.setState("playListIndex",index)
    }
})