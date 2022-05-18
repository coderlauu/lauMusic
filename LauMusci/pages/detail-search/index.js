import {
    getSearchHot,
    getSearchSuggest,
    getSearchResults
} from '../../service/api_search'
import debounce from '../../debounce'
import stringToNodes from '../../string-to-nodes'

// 对搜索请求进行防抖处理
const debouncegetSearchSuggest = debounce(getSearchSuggest, 200)

Page({

    data: {
        hotKeywords: [],
        suggestSongs: [],
        inputKeyword: "",
        suggestSongsNodes: [],
        resultsSongs: []
    },

    onLoad(options) {
        // 在页面加载数据
        this.getPageSearchData()
    },

    // 网络请求
    getPageSearchData() {
        // 获取api的热门搜索数据
        getSearchHot().then(res => {
            // console.log(res);  res -> {code: 200, result: {…}}
            this.setData({
                hotKeywords: res.result.hots
            })
        })

    },

    // 事件处理
    // 先获取输入框输入的字符，再将字符作为参数传给api函数进行匹配
    handleSearchChange(event) {
        // 1.获取输入的关键字
        const inputKeyword = event.detail
        // 2.保存关键字
        this.setData({
            inputKeyword
        })
        // 3.如果输入框为空
        if (!inputKeyword.length) {
            // 则将搜索建议、搜索结果清空
            this.setData({
                suggestSongs: [],
                resultsSongs: []
            })
            return
        }
        // 4.根据输入的关键字进行搜索--防抖处理
        debouncegetSearchSuggest(inputKeyword).then(res => {
            // 获取搜索建议歌曲的数据
            const suggestSongs = res.result.allMatch
            this.setData({
                suggestSongs
            })
            // 如果搜索建议区查不到值输入的值，就退出执行
            if (!suggestSongs) {
                return 
            }

            // 对得到的数据进行map方法取到想要的keyword值并赋给新变量保存
            const searchKeywords = suggestSongs.map(item => item.keyword)
            const suggestSongsNodes = []
            for (const keyword of searchKeywords) { // 对只带有keyword值的一组数据进行遍历，只取某个想要的关键字
                // 这里对if判断逻辑进行了封装
                const nodes = stringToNodes(keyword, inputKeyword)
                suggestSongsNodes.push(nodes)
            }
            // 将带有样式的搜索数据添加到新数组中，返回html中渲染
            this.setData({
                suggestSongsNodes
            })
        })
    },
    // 输入框回车后触发此事件 -> 获取输入框关键字的数据 
    handleSearchAction() {
        const inputKeyword = this.data.inputKeyword
        // 根据关键字发送网络请求--以显示在结果区
        getSearchResults(inputKeyword).then(res => {
            this.setData({
                resultsSongs: res.result.songs
            })
        })
    },
    // 搜索建议区将选中的关键字展示到输入框
    handleSuggestKeyword(event) {
        const keyword = event.currentTarget.dataset.keyword
        getSearchResults(keyword).then(res => {
            // 将关键字赋到输入框
            this.setData({
                inputKeyword: keyword
            })
            // 逻辑跟上面的函数一样 -> 根据输入框的关键字获取数据
            this.handleSearchAction()
        })
    },
    // 点击热门搜索区的关键字展示搜索结果
    handleHotSearchValue(event) {
        const keyword = event.currentTarget.dataset.first
        // 将关键字赋到输入框
        this.setData({
            inputKeyword: keyword
        })
        // 逻辑跟上面的函数一样 -> 根据输入框的关键字获取数据
        this.handleSearchAction()

    }

})