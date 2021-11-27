//  成功信息
export function successMsg(msg){
    window.layer.alert(msg, {icon: 1})
}

//  失败信息
export function errorMsg(msg){
    window.layer.alert(msg, {icon: 2})
}

//  警告信息
export function waringMsg(msg){
    window.layer.alert(msg, {icon: 3})
}

//  提示信息
export function infoMsg(msg){
    window.layer.alert(msg, {icon: 0})
}