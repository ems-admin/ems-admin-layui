import {createStore} from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  state: {
    token: null,
    routers: null,
    isLoadMenu: false,
    user: null
  },
  mutations: {
    //  持久化token
    tokenMutation(state, payload){
      state.token = payload
    },
    //  持久化路由
    routesMutation(state, payload){
      state.routers = payload
    },
    //  持久化是否加载路由状态
    loadMenuMutation(state, payload){
      state.isLoadMenu = payload
    },
    //  持久化用户对象
    userMutation(state, payload){
      state.user = payload
    }
  },
  actions: {
    //  持久化token
    tokenAction(context, data){
      context.commit('tokenMutation', data)
    },
    //  持久化路由
    routesActions(context, data){
      context.commit('routesMutation', data)
    },
    //  持久化是否加载路由状态
    loadMenuAction(context, data){
      context.commit('loadMenuMutation', data)
    },
    //  持久化用户对象
    userAction(context, data){
      context.commit('userMutation', data)
    }
  },
  plugins: [createPersistedState({storage: sessionStorage})]
})

export default store
