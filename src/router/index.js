import router from './routers'
import store from "../store";
import {queryAllMenu} from "../api/menu/menu";
import {errorMsg} from "../utils/layerMsg";
import routers from "./routers";

//  定义白名单路由
const whiteList = ['/login']

//  路由守卫
router.beforeEach((to, from, next) => {
  //  判官是否登录
  if (store.state.token) {
    //  在用户手动切换到根路由的时候，强制返回，避免路由跳出当前主页面
    if (to.path === '/'){
      routers.go(-1)
    }
    // 如果登录就直接跳转到主页
    if (to.path === '/login') {
      next({ path: '/index' })
    } else {
      //  判断是否已拉取过了用户菜单
      if (!store.state.isLoadMenu) {
        loadMenus(next, to)
      //  如果拉取过
      } else {
        //  判断请求路由是否存在于系统路由中,如果不存在
        if (!hashRoute(to)){
          //  将缓存中的路由添加到系统路由中
          addRoute()
          //  再进行判断
          if (hashRoute(to)){
            next(to.fullPath)
          } else {
            next({path: '/404'})
          }
        //  如果存在
        } else {
          //  直接访问
          next()
        }
      }
    }
  } else {
    // 在免登录白名单，直接进入
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    // 否则全部重定向到登录页
    } else {
      next(`/login`)
    }
  }
})

/**
 * 拉取用户菜单
 * @param next
 * @param to
 */
export const loadMenus = (next, to) => {
  queryAllMenu().then(res => {
    if (res.success){
      if (res.data.length > 0){
        //  将用户菜单缓存到store中
        store.dispatch('routesActions', res.data)
        //  将拉取状态缓存到store中
        store.dispatch('loadMenuAction', true)
        next({ ...to, replace: true })
      }
    } else {
      errorMsg(res.msg)
    }
  })
}

/**
 * 校验请求路径是否存在于router中
 * @param to
 * @returns {boolean}
 */
export function hashRoute(to){
  let find = router.getRoutes().find(item => item.path === to.path)
  return !!find;
}

/**
 * 将缓存的路径添加到系统路由中
 */
export function addRoute(){
  let routes = store.state.routers
  if (routes && routes.length > 0){
    routes.forEach(item => {
      router.addRoute({
        path: item.path,
        name: item.name,
        component: item.component !== null ? () => import(`@/views/${item.component}`) : null
      })
    })
  }
}
