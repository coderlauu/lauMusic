import {
    audioContext,
    playerStore
} from '../../store/player-store'

const playModeNames = ["order", "repeat", "random"]

Page({

    data: {
        id: 0,
        // 通过Store请求的过来的变量--当前歌曲、歌词信息、歌曲总时长
        currentSong: {},
        lyricInfos: [],
        durationsTime: 0,

        // 当前播放时间、当前播放的歌词、当前歌词的位置
        currentTime: 0,
        currentTimeLyric: "",
        currentLyricIndex: 0,

        contentHeight: 0,
        currentPage: 0,
        deviceRadio: true,
        sliderValue: 0,
        isSliderChanging: false,
        scrollTopHeight: 0,

        playModeIndex: 0,
        playModeName: 'order',

        isPlaying: false,
        isPlayingName: "pause",
    },
    onLoad: function (options) {
        // 获取传入的id
        const id = options.id
        this.setData({
            id
        })

        // 从playerStore里监听一些变化
        this.setPlayerStoreListener()

        // 动态计算内容高度->屏幕高度-动态状态栏高度-导航栏高度
        const screenHeight = getApp().globalData.screenHeight
        const statusBarHeight = getApp().globalData.statusBarHeight
        const navBarHeight = getApp().globalData.navBarHeight
        // 当前页面内容高度
        const contentHeight = screenHeight - statusBarHeight - navBarHeight
        this.setData({
            contentHeight
        })

        // 当设备屏幕高宽比小于2，第一页不显示歌词
        const deviceRadio = getApp().globalData.deviceRadio
        if (deviceRadio < 2) {
            this.setData({
                deviceRadio: false
            })
        }
    },

    // ===========================    本页面的事件请求    ==========================
    handleChangePage(event) { // 滑动页面-页数发生改变
        const currentPage = event.detail.current
        this.setData({
            currentPage
        })
    },

    handleSliderChange(event) { // 进度条点击事件--值(0-100区间),除以100化为百分数
        // 1.获取点击进度条处的值
        const value = event.detail.value

        // 2.当点击进度条的某个值时，用那个值*总时长/100 化为指定的时间作为当前时间
        const currentTime = value * this.data.durationsTime / 100

        // 3.设置audioContext播放currentTime的音乐 ---API:seek 单位 s
        audioContext.pause()
        audioContext.seek(currentTime / 1000)

        // 记录最新的进度条值
        this.setData({
            // sliderValue:value,
            currentTime,
            isSliderChanging: false,
            isPlayingName: this.data.isPlaying ? "pause" : "pause"
        })  
    },

    handleSliderChanging(event) { //拖拽进度条事件
        // 1.获取点击进度条处的值
        const value = event.detail.value

        // 2.当点击进度条的某个值时，用那个值*总时长/100 化为指定的时间作为当前时间
        const currentTime = value * this.data.durationsTime / 100
        this.setData({
            isSliderChanging: true,
            currentTime
        })
    },

    // 返回上一级功能
    handleBackBtn() {
        wx.navigateBack()
    },

    // 点击播放模式发生变化
    handlePlayMode() {
        // 记录最新的播放模式索引值
        let playModeIndex = this.data.playModeIndex + 1
        // 这里不能用const，因为const声明的是只读常量，而下面的if对这个变量进行了修改，因此用let
        if (playModeIndex === 3) playModeIndex = 0
        playerStore.setState("playModeIndex", playModeIndex)
    },

    // 点击播放按钮发生变化
    handleChangePlayer() {
        // 每点击一次按钮，其操作是相反的->当正在播放时点击就暂停(传false)
        playerStore.dispatch("changeMusicPlayStateAction", !this.data.isPlaying)
    },

    // 点击播放上一首 -> 回到store里上一首的函数
    handlePlayPrevMusic() {
        playerStore.dispatch("changeMusicPlayAction", false)
    },
    handlePlayNextMusic() {
        playerStore.dispatch("changeMusicPlayAction")
    },

    setPlayerStoreListener() {
        // 1.监听currentSong、lyricInfos、durationsTime
        playerStore.onStates(["currentSong", "lyricInfos", "durationsTime"], ({
            // 解构取值
            currentSong,
            lyricInfos,
            durationsTime
        }) => {
            if (currentSong) this.setData({
                currentSong
            })
            if (lyricInfos) this.setData({
                lyricInfos
            })
            if (durationsTime) this.setData({
                durationsTime
            })
        })

        // 2.监听currentTime、currentTimeLyric、currentLyricIndex
        playerStore.onStates(["currentTime", "currentLyricIndex", "currentTimeLyric"], ({
            // 解构取值
            currentTime,
            currentLyricIndex,
            currentTimeLyric
        }) => {
            // 时间变化
            if (currentTime && !this.data.isSliderChanging) {
                // 实现进度条随着当前时间变化 --> 当前时间除以总时长*100 = 当前播放时间的比例(value)
                const sliderValue = currentTime / this.data.durationsTime * 100
                this.setData({
                    currentTime,
                    sliderValue
                })
            }
            // 歌词变化
            if (currentLyricIndex) {
                this.setData({
                    currentLyricIndex,
                    scrollTopHeight: currentLyricIndex * 35
                })
            }
            if (currentTimeLyric) {
                this.setData({
                    currentTimeLyric
                })
            }
        })

        // 3.监听store里暂停、播放按钮的变化 -> 以切换icon图标
        playerStore.onStates(["playModeIndex", "isPlaying"], ({
            playModeIndex,
            isPlaying
        }) => {
            if (playModeIndex !== undefined) { //从对象里解构取值，若解构不出来就是undefined
                this.setData({
                    playModeIndex,
                    playModeName: playModeNames[playModeIndex]
                })
            }

            if (isPlaying !== undefined) { //从对象里解构取值，若解构不出来就是undefined
                this.setData({
                    isPlaying,
                    // 如果歌曲正在播放则显示暂停的图标；反之显示播放图标
                    isPlayingName: isPlaying ? "pause" : "resume"
                })
            }
        })
    },

})