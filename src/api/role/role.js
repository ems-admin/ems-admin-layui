import request from "@/utils/request";

/**
 * 查询角色选择下拉框
 * @param params
 * @returns {*}
 */
export function getRoleSelect(params){
    return request({
        url: '/sys/role/select',
        method: 'get',
        params
    })
}

/**
 * 查询角色列表
 * @param params
 * @returns {*}
 */
export function getRoleTable(params){
    return request({
        url: '/sys/role/table',
        method: 'get',
        params
    })
}

/**
 * 编辑角色
 * @param data
 * @returns {*}
 */
export function editRole(data){
    return request({
        url: '/sys/role/edit',
        method: 'post',
        data
    })
}

/**
 * 删除角色
 * @param params
 * @returns {*}
 */
export function deleteRole(params){
    return request({
        url: '/sys/role/del',
        method: 'delete',
        params
    })
}

