//封装获取元素矩形信息的函数
export default function (selector) {
    return new Promise((resolve) => {
        const query = wx.createSelectorQuery()
        query.select(selector).boundingClientRect()
        query.exec((res) => {
            // console.log(rect); //查看相应数据
            resolve(res) //将res的结果resolve出去
        })
    })
}