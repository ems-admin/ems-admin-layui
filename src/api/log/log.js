import request from "@/utils/request";

/**
 * 查询日志记录
 * @param params
 * @returns {*}
 */
export function queryLogs(params){
    return request({
        url: '/sys/log/list',
        method: 'get',
        params
    })
}