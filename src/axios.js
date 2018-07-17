import axios from 'axios'



const instance = axios.create({
    timeout: 60000000000
})

instance.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest'
instance.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'
instance.defaults.headers.put['X-Requested-With'] = 'XMLHttpRequest'
instance.defaults.headers.delete['X-Requested-With'] = 'XMLHttpRequest'

//
instance.interceptors.response.use(
    response => {
        // removePending(response.config)
        return response
    },
    error => {
        console.warn(JSON.stringify(error))
        if (error.response) {
            switch (error.response.status) {
                case 408:
                    console.warn("会话超时，即将刷新页面重新登录！", JSON.stringify(error))
                // window.document.location.reload()
            }
        }
        return Promise.reject(error.response.data)
    }
)

export default instance


export function httpGet(url,params = {}){
    return new Promise((resolve,reject) => {
        instance.get(url,{
            params:params
        })
    .then(response => {
        resolve(response.data);
    })
    .catch(err => {
        reject(err)
        })
    })
}

export function httpPost(url, params = {}) {
    return new Promise((resolve, reject) => {
        instance.post(url, params)
        .then(response => {
            resolve(response)
        })
        .catch(err => {
            reject(err)
        })
    })
}

export function httpPut(url, params = {}) {
    return new Promise((resolve, reject) => {
        instance.post(url, params)
        .then(response => {
            resolve(response)
        })
        .catch(err => {
            reject(err)
        })
    })
}

export function httpDelete(url, params = {}) {
    return new Promise((resolve, reject) => {
        instance.delete(url, params)
        .then(response => {
            resolve(response)
        })
        .catch(err => {
            reject(err)
        })
    })
}

//超时重传代码，下一版本开发者辛苦了，你可能会用到,代码整体逻辑也要大改

// axios.defaults.timeout = 20000
// //请求次数
// axios.defaults.retry = 10
// //请求间隔
// axios.defaults.retryDelay = 1000

// axios.interceptors.response.use(undefined, function axiosRetryInterceptors(err) {
//     let config = err.config
//     if(!config || !config.retry) {
//         return Promise.reject(err)
//     }
//     config.__retryCount = config._retryCount || 0
//     if(config.__retryCount >= config.retry) {
//         return Promise.reject(err)
//     }
//     config.__retryCount += 1
//     let backoff = new Promise(function(resolve) {
//         setTimeout(() => {
//             resolve()
//         }, config.retryDelay || 1)
//     })
//     return backoff.then(() => {
//         return axios(config)
//     })
// })