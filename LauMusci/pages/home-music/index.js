// 有export default ...时，import时不需要{ }；而没有defaul时，import需带大括号{ }
import {
    rankingStore,
    rankingMap
} from '../../store/ranking-store'

import {
    getBanners,
    getSongMenu,
} from '../../service/api_music' //引入完再到onload获取对应的数据
import queryRect from '../../service/query-rect'
import throttle from '../../throttle'
import {
    playerStore
} from '../../store/player-store'

// 性能优化-使用节流
const throttlequeryRect = throttle(queryRect, 1000)

Page({
    data: {
        banners: [], //在这里定义一个空数组，方便在封装函数里拿到对应数据
        swiperHeight: 0,
        // 热门歌单
        hotSongMenu: [],
        // 推荐歌单
        recommendSongMenu: [],
        //推荐歌曲
        recommendSongs: [],
        rankings: {
            0: {},
            2: {},
            3: {}
        },
        currentSong: {},
        isPlaying: false,
        playAnimState: "paused"
    },

    handleSwiperImageLoaded() {
        // 如何获取某一个组件的高度->API
        throttlequeryRect('.swiper-image').then(res => {
            const rect = res[0]
            this.setData({
                swiperHeight: rect.height
            })
        })
    },

    onLoad(options) {
        // 页面加载默认播放歌曲
        playerStore.dispatch("playMusicWithSongIdAction", {
            id: 1842025914
        })

        // 发情页面的请求
        this.getPageData()

        // 发起共享数据的请求
        rankingStore.dispatch('getRankingDataAction')

        // 从store中获取共享的数据
        this.setupPlayStoreListener()

        /**
         * 当ranking-store里的值发生改变时，
         * ranKingStore.onState这段代码会自动执行并获取到最新的数据，
         * 然后this,setData将页面数据发生响应式的变化
         */
    },

    //获取从api请求过来的数据--一些逻辑代码尽量写在封装函数里，然后onload里直接调用此函数
    getPageData() {
        // 获取数据
        getBanners().then(res => {
                // 这里的res是指整个数据库 -> res.banners是下级的bannert数组
                this.setData({ //setData指调试器里的APPData -> 获取到数组就会在里面展示出来
                    banners: res.banners
                })
            }),
            getSongMenu().then(res => {
                // console.log(res);//playlists
                this.setData({
                    hotSongMenu: res.playlists
                })
            }),
            getSongMenu("华语").then(res => {
                this.setData({
                    recommendSongMenu: res.playlists
                })
            })
    },

    //事件处理
    handleSearchClick() {
        // 跳转页面
        wx.navigateTo({
            url: '../detail-search/index',
        })
    },

    getRankingHandler(idx) {
        return (res) => {
            if (!res.tracks) return
            const name = res.name
            const coverImgUrl = res.coverImgUrl
            const songList = res.tracks.slice(0, 3)
            const playCount = res.playCount
            const rankingObj = {
                name,
                coverImgUrl,
                playCount,
                songList
            }
            /**
             * 对象的扩展运算符{...}用于取出参数对象的所有可遍历属性，浅拷贝到当前对象之中，浅拷贝会覆盖数据
             * ...this.data.rankings(扩展运算符) <==> 0:{},2:{},3:{}
             * [idx]:rankingObj <==> 0:{name,coverImgUrl,songList} -->idx为0时
             * 此时的newRankings <==> { 0:{...这里是有数据的},2:{空的},3:{空的} }
             *  ...
             * 同理，经过三次idx不同值的调用，最后newRankings里每个对象都有数据，
             * 最后，this.setData({rankings:newRankings}) --> rankings是有三组数据的
             */
            const newRankings = {
                ...this.data.rankings,
                [idx]: rankingObj
            }
            this.setData({
                rankings: newRankings
            })
        }
    },

    // 点击"更多"->触发事件
    handleMoreClick() {
        this.navigateToDetailSongsPage("hotRanking")
    },

    // 如何区分具体点击了哪一个榜单？参数event可以根据id进行辨别
    handleClickRankingItem(event) {
        const idx = event.currentTarget.dataset.idx
        const rankingItemName = rankingMap[idx]
        // console.log(rankingName);
        this.navigateToDetailSongsPage(rankingItemName)
    },

    // 因为跳转页面的函数有多个,可以对其点击事件进行封装
    navigateToDetailSongsPage(rankingName) {
        // 1.跳转页面
        wx.navigateTo({
            // 指定页面中的js文件中是可以直接引用这个ranking的 -> 回到detail-songs/index.js
            url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`
        })
    },

    // 单击歌曲组件发送歌曲数据请求
    handleSongItemClick(event) {
        // 记录点击的歌曲索引
        const index = event.currentTarget.dataset.index
        // 将当前歌曲所对应的列表放入store里、当前索引值也放入store里 ->回到store里封装上一首、下一首的函数
        playerStore.setState("playListSongs", this.data.recommendSongs)
        playerStore.setState("playListIndex", index)
    },

    // 封装-从Store中获取歌曲数据
    setupPlayStoreListener() {
        // 监听排行榜的歌单
        rankingStore.onState("hotRanking", (res) => {
            // res的第一次输出是空对象,所以先进行一个判断
            if (!res.tracks) return
            const recommendSongs = res.tracks.slice(0, 6) //截取前6条歌曲数据
            this.setData({
                recommendSongs
            })
        })
        rankingStore.onState("newRanking", this.getRankingHandler(0))
        rankingStore.onState("originRanking", this.getRankingHandler(2))
        rankingStore.onState("upRanking", this.getRankingHandler(3))

        // 监听播放器
        playerStore.onStates(["currentSong", "isPlaying"], ({
            // 这里可以根据Store里的isPlaying值来判断歌曲是否在播放，然后将监听到的isPlaying设置为这里的isPlaying
            currentSong,
            isPlaying
        }) => {
            if (currentSong) this.setData({
                currentSong
            })
            if (isPlaying !== undefined) { //从对象里解构取值，若解构不出来就是undefined
                this.setData({
                    isPlaying,
                    playAnimState: isPlaying ? "running" : "paused"
                })
            }
        })
    },

    // 播放工具栏的播放按钮
    handlePlayBtnClick() {
        // 监听(clone)Store里的播放按钮方法
        playerStore.dispatch("changeMusicPlayStateAction", !this.data.isPlaying)
    },

    handleClickSongDetail(event) {
        const idx = event.currentTarget.dataset.id
        wx.navigateTo({
            // url?后面的值对应onload里的options
            url: '/pages/music_player/index?id=' + idx,
        })
    }
})