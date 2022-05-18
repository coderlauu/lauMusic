import {
    HYEventStore
} from 'hy-event-store'
import {
    getSongDetail,
    getSongLyric
} from '../service/api_player'
import {
    parseLyric
} from '../parse_lyric'

const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
    state: {
        id: 0,
        currentSong: {},
        lyricInfos: [],
        durationsTime: 0,

        isFirstPlay: true,

        currentTime: 0,
        currentTimeLyric: "",
        currentLyricIndex: 0,

        playModeIndex: 0, //0:顺序播放  1：单曲循环  2：随机播放
        isPlaying: false,

        playListSongs: [],
        playListIndex: 0
    },
    actions: {
        // 从外部文件传入一个id，可以帮它请求数据并播放歌曲
        playMusicWithSongIdAction(ctx, {
            id,
            isRefresh = false
        }) { // ctx：取state的值，或为state某个变量赋值
            // 返回上一级再次回到原歌曲无需重新播放
            if (ctx.id === id && !isRefresh) {
                // true:再次点击原歌曲会自动接着播放;false:暂停播放
                this.dispatch("changeMusicPlayStateAction", true)
                return
            }
            ctx.id = id

            // 0.修改播放状态
            ctx.isPlaying = true
            // 点击新歌曲会显示上一首歌曲信息的残影，在请求新id之前先将数据置空
            ctx.currentSong = {}
            ctx.lyricInfos = []
            ctx.durationsTime = 0
            ctx.currentTime = 0
            ctx.currentTimeLyric = ""
            ctx.currentLyricIndex = 0

            // 1.根据id请求歌曲和歌词
            // 请求歌曲详情
            getSongDetail(id).then(res => {
                // 设置当前页数，当前歌曲总时长(毫秒)
                ctx.currentSong = res.songs[0],
                    ctx.durationsTime = res.songs[0].dt
            })
            // 请求歌词信息
            getSongLyric(id).then(res => {
                const lyricString = res.lrc.lyric
                const lyrics = parseLyric(lyricString)
                ctx.lyricInfos = lyrics
            })

            // 2.播放对应的歌曲
            audioContext.stop() //先停止上一首歌曲
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
            audioContext.autoplay = true

            // 3.audioContext的事件监听
            // 只有在第一次播放歌曲的时候才需要去申请监听
            if (ctx.isFirstPlay) {
                this.dispatch("setupAudioContextListenerAction")
                ctx.isFirstPlay = false
            }
        },

        setupAudioContextListenerAction(ctx) {
            // 1.监听歌曲可以播放
            audioContext.onCanplay(() => {
                audioContext.play()
            })

            // 2.监听时间改变
            audioContext.onTimeUpdate(() => { // 避免拖拽进度条事件与当前正在播放导致的时间点冲突，给当前播放时间添加条件(拖拽事件没触发时)
                // 1.获取当前歌曲播放时间
                const currentTime = audioContext.currentTime * 1000
                ctx.currentTime = currentTime

                // 3.根据当前时间查找正在播放的歌词
                /**
                 *  1.从每一行歌词中遍历
                 *  2.记录每一条遍历的歌词  
                 *  3.当前时间如果小于遍历时的歌词的时间，则显示上一条歌词；
                 *  4.将上一条歌词记录下来，并setData修改，然后展示
                 *  5.对于出现过的歌词会重复出现的问题->可以将每次遍历时的索引记录下来，当当前索引与下一次循环时的索引不相等时，才修改setData
                 */
                for (let i = 0; i < ctx.lyricInfos.length; i++) {
                    const lyricInfo = ctx.lyricInfos[i]
                    if (ctx.currentTime < lyricInfo.time) {
                        const currentIndex = i - 1
                        if (ctx.currentLyricIndex !== currentIndex) {
                            const currentTimeLyric = ctx.lyricInfos[currentIndex].lyricText
                            console.log(currentTimeLyric);
                            ctx.currentTimeLyric = currentTimeLyric
                            ctx.currentLyricIndex = currentIndex
                        }
                        break // 当匹配到了之后，跳出本次循环
                    }
                }
            })

            // 3.监听歌曲播放完成
            audioContext.onEnded(() => {
                this.dispatch("changeMusicPlayAction")
            })
        },

        // 切换暂停、播放按钮
        changeMusicPlayStateAction(ctx, isPlaying = true) {
            ctx.isPlaying = isPlaying
            ctx.isPlaying ? audioContext.play() : audioContext.pause()
        },

        // 上一首、下一首
        changeMusicPlayAction(ctx, isNext = true) {
            // 1.获取当前歌曲索引
            let index = ctx.playListIndex
            // 2.根据不同的播放模式下获取上、下一首歌曲的索引
            switch (ctx.playModeIndex) {
                case 0: //顺序播放
                    index = isNext ? index + 1 : index - 1
                    if (index === -1) index = ctx.playListSongs.length - 1 // 第一首的上一首 -> 最后一首歌 
                    if (index === ctx.playListSongs.length) index = 0 // 最后一首的下一首 -> 第一首 
                    break
                case 1: //单曲循环
                    index
                    break
                case 2: //随机播放
                    index = Math.floor(Math.random() * ctx.playListSongs.length) // 随机值在歌曲列表总数中随机 ->Math.random()取值是[0,1)
                    break
            }
            console.log(index);
            // 记录最新的索引
            ctx.playListIndex = index
            // 3.获取当前索引对应的歌曲
            let currentSong = ctx.playListSongs[index]
            // 如果歌曲为空
            if(!currentSong){
                currentSong = ctx.currentSong
            }
            // 4.根据获取的最新歌曲的id请求播放
            this.dispatch("playMusicWithSongIdAction", {
                id: currentSong.id,
                isRefresh: true
            })
        },

    }
})

export {
    audioContext,
    playerStore
}