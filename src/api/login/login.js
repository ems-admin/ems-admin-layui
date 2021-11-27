import request from "../../utils/request";

/**
 * 登录
 * @param data
 * @returns {AxiosPromise}
 */
export function login(data){
    return request({
        url: '/auth/login',
        method: 'post',
        data: data
    })
}