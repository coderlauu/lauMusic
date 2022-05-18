import lqRequest from './index'

export function getSearchHot(){
    return lqRequest.get('/search/hot')
}

/**
 * 必选参数 : keywords : 关键词
 * 可选参数 : type : 如果传 'mobile' 则返回移动端数据
 * 接⼝地址 : /search/suggest
 */
export function getSearchSuggest(keywords){
    // keywords参数靠什么地方传？靠事件触发携带的event参数
    return lqRequest.get('/search/suggest',{
        keywords,
        type:'mobile'
    })
}

/**
 * 调⽤此接⼝ , 传⼊搜索关键词可以搜索该⾳乐 / 专辑 / 歌⼿ / 歌单 / ⽤户 , 关键词可以多个 , 以空格隔开
 * 必选参数 : keywords : 关键词
 * 可选参数 : limit : 返回数量 , 默认为 30 offset : 偏移数量默认为 0
 * type : 搜索类型；默认为 1
 *      1: 单曲, 10: 专辑, 100: 歌⼿, 1000: 歌单, 1002: ⽤户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
 * 接⼝地址 : /search 或者 /cloudsearch (更全)
 */
export function getSearchResults(keywords){
    return lqRequest.get('/search',{
        keywords
    })
}