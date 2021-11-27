import axios from "axios";
import routers from "../router/routers";
import store from "../store";
import {errorMsg} from "./layerMsg";


// 创建axios实例
const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_URL : 'http://localhost:8415',
    timeout: 50000 // 请求超时时间(毫秒)
})

// request拦截器
instance.interceptors.request.use(
    config => {
        if (store.state.token) {
            config.headers['Authorization'] = 'Bearer ' + store.state.token
        }
        config.headers['Content-Type'] = 'application/json'
        return config
    },
    error => {
        Promise.reject(error)
    }
)

// response 拦截器
instance.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        const code = error.response.status
        const data = error.response.data
        if (code) {
            if (code === 401) {
                if (data){
                    errorMsg(data.detail)
                } else {
                    routers.replace({path: '/401'})
                    //  清空token
                    store.dispatch('tokenAction', null)
                }
            } else if (code === 403) {
                routers.push({ path: '/401' })
            } else if (code === 500) {
                errorMsg(error.response.data.detail)
            } else{
                const errorMessage = error.response.data.detail
                if (errorMessage !== undefined) {
                    errorMsg(errorMessage)
                }
            }
        } else {
            errorMsg('接口请求失败')
        }
        return Promise.reject(error)
    }
)
export default instance