import lqRequest from './index'

/**
 * 调⽤此接⼝ , 传⼊⾳乐 id(⽀持多个 id, ⽤ , 隔开), 可获得歌曲详情
 * 必选参数 : ids : ⾳乐 id
 * 接⼝地址 : /song/detail
 */
export function getSongDetail(ids){
    return lqRequest.get('/song/detail',{
        ids
    })
}

/**
 * 调⽤此接⼝ , 传⼊⾳乐 id 可获得对应⾳乐的歌词 ( 不需要登录 )
 * 必选参数 : id : ⾳乐 id
 * 接⼝地址 : /lyric
 */
export function getSongLyric(id){
    return lqRequest.get('/lyric',{
        id
    })
}