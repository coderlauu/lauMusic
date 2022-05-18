// 对于一些固定的参数(limit、url)可以进行再封装，目的是让页面需要对网络请求发起的逻辑更简洁(写的代码更少) -> 在调用request请求时只需调用下面的getTopMV()即可
// 引入lqRequest
import lqRequest from './index'

export function getTopMV(offset, limit = 10) {
    return lqRequest.get('/top/mv', {
        offset,
        limit
    })
    // 调用get函数并传参->get(url, params)
}