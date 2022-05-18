import lqRequest from './index'

/**
 * 调⽤此接⼝ , 可获取 banner( 轮播图 ) 数据
 * type : 0:pc 1:安卓 2:ios 3:ipad
 * 接⼝地址 : /banner
 */
export function getBanners() {
    return lqRequest.get('/banner', {
        type: 2 //0:pc 1:安卓 2:ios 3:ipad
    })
}

/**
 * 《歌曲数据》
 * 调⽤此接⼝ , 传⼊榜单 id, 可获取不同排⾏榜数据
 * idx: 0：新歌 1:热歌 2:原创 3:飙升
 * 接⼝地址 : /top/list
 */
export function getRankings(idx) {
    return lqRequest.get('/top/list', {
        idx //0：新歌 1:热歌 2:原创 3:飙升
    })
}

/**
 * 《歌单数据》
 * 调用接口-获取⽹友精选碟歌单
 * cat:" 华语 "、" 古⻛ " 、" 欧美 "、" 流⾏ ", 默认为 "全部"
 * limit:取出歌单数量 , 默认为 50
 * offset:偏移数量 , ⽤于分⻚
 * 接⼝地址 : /top/playlist
 */
export function getSongMenu(cat = "全部", limit = 6, offset = 0) { //默认参数，实际参数可在获取数据那里重新传
    return lqRequest.get('/top/playlist', {
        cat,
        limit,
        offset
    })
}

/**
 * 调⽤后可获取《歌单详情动态部分》,如评论数,是否收藏,播放数
 * 必选参数-> id : 歌单 id
 * 接⼝地址 : /playlist/detail/dynamic
 */
export function getSongMenuDetail(id) {
    return lqRequest.get('/playlist/detail/dynamic', {
        id
    })
}