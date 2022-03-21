import request from "@/utils/request";

/**
 * 查询菜单列表(左侧菜单树专用)
 * @returns {AxiosPromise}
 */
export function getMenuList(){
    return request({
        url: 'sys/menu/tree/left',
        method: 'get'
    })
}

/**
 * 查询所有权限菜单
 * @returns {AxiosPromise}
 */
export function queryAllMenu(){
    return request({
        url: 'sys/menu/all',
        method: 'get'
    })
}

/**
 * 查询菜单列表
 * @param param
 * @returns {*}
 */
export function getMenuTable(param){
    return request({
        url: '/sys/menu/table',
        method: 'get',
        param
    })
}

/**
 * 获取下拉框树
 * @returns {AxiosPromise}
 */
export function getSelectTree(){
    return request({
        url: '/sys/menu/select/tree',
        method: 'get'
    })
}

/**
 * 编辑菜单
 * @param data
 * @returns {AxiosPromise}
 */
export function editMenu(data){
    return request({
        url: '/sys/menu/edit',
        method: 'post',
        data
    })
}

/**
 * 删除菜单
 * @param params
 * @returns {*}
 */
export function deleteMenu(params){
    return request({
        url: '/sys/menu/del',
        method: 'delete',
        params
    })
}

/**
 * 获取角色的菜单树
 * @param params
 * @returns {*}
 */
export function getRoleMenuTree(params){
    return request({
        url: 'sys/menu/role/tree',
        method: 'get',
        params
    })
}

/**
 * 角色授权
 * @param data
 * @returns {*}
 */
export function authorizeRole(data){
    return request({
        url: 'sys/role/menu/edit',
        method: 'post',
        data
    })
}