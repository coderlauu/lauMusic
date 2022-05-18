// 设定一个固定的地址
const BASE_URL = 'http://123.207.32.32:9001'

// 封装wx.request函数
class LQRequest {
    request(url, methods, params) { //url:接口地址，methods:http请求方法，params即data:请求的参数,类型为:string/object/Array
        return new Promise((resolve, reject) => {
            wx.request({
                url: BASE_URL + url, // 在固定地址后面加上二级路径
                methods: methods, // get请求、post请求
                data: params, // 类型为:Array[offset参数、limit参数]
                success(res) {
                    resolve(res.data)
                },
                fail: reject
            })
        })
    }

    // 封装get请求
    get(url, params) {
        // 返回上面class里面的request请求
        return this.request(url, "GET", params)
    }

    // 封装post请求
    post(url, params) {
        return this.request(url, 'POST', params)
    }
}

// 创建变量接收请求
const lqRequest = new LQRequest()

// 导出
export default lqRequest