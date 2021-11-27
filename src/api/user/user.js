import request from "@/utils/request";

/**
 * 获取用户列表
 * @param params
 * @returns {*}
 */
export function getUserList(params){
    return request({
        url: '/sys/user/table',
        method: 'get',
        params
    })
}

/**
 * 修改用户状态
 * @param data
 * @returns {*}
 */
export function chargeUserStatus(data){
    return request({
        url: '/sys/user/enabled',
        method: 'put',
        data
    })
}

/**
 * 删除用户
 * @param params
 * @returns {*}
 */
export function delUserById(params){
    return request({
        url: '/sys/user/del',
        method: 'delete',
        params
    })
}

/**
 * 编辑用户
 * @param data
 * @returns {*}
 */
export function editUser(data){
    return request({
        url: '/sys/user/edit',
        method: 'post',
        data
    })
}