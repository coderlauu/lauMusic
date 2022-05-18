// 引入二次封装好的函数
import {
    getTopMV
} from '../../service/api_video'

Page({
    data: {
        topMVs: [],
        hasMore: true
    },

    // 页面加载
    onLoad(options) {
        // 调用request请求
        // lqRequest.get("/top/mv", {
        //     offset: 0,
        //     limit: 10
        // }).then(...)  -> 这些是调用index.js里封装好的函数
        this.getTopMVData(0)
    },

    //封装网络请求的方法
    getTopMVData(offset) {
        // 判断是否可以请求 --> 没有更多数据了 以及 数据加载完的情况下
        if (!this.data.hasMore && offset !== 0) return
        // 在导航条展示加载动画 -> 需在json添加配置
        wx.showNavigationBarLoading({})
        // 请求数据
        getTopMV(offset).then(res => {
            let newData = this.data.topMVs
            if (offset === 0) {
                newData = res.data
            } else {
                newData = newData.concat(res.data)
            }
            // 设置数据
            this.setData({
                topMVs: newData
            })
            this.setData({
                hasMore: res.hasMore
            })
            // 加载完数据后隐藏加载动画
            wx.hideNavigationBarLoading()
            // 下拉刷新时offset=0，这时数据刷新完了就需要停止下拉刷新动画
            if (offset === 0) {
                wx.stopPullDownRefresh()
            }
            // 
        })
    },

    // 上拉加载--更新10条新数据
    onReachBottom() {
        this.getTopMVData(this.data.topMVs.length)
    },

    // 下拉刷新--覆盖原来加载过的数据，只显示前10条 -> 需在json添加配置
    onPullDownRefresh() {
        this.getTopMVData(0)
    }

})


