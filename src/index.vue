<template>
<div>
  <!--侧边导航-->
  <div style="width: 200px;">
    <ul class="layui-nav layui-nav-tree layui-nav-side" lay-filter="menu" lay-shrink="all">
      <div class="menu-head">
        <img src="../src/assets/image/ems.png" style="height: 40px;">
        <span>EMS-ADMIN</span>
      </div>
      <li v-for="(menu, index) in state.menuList" :key="index" class="layui-nav-item" style="text-align: left;">
        <a href="javascript:" :id="menu.id" :type="menu.type">{{menu.name}}</a>
        <dl v-if="menu.children.length > 0" class="layui-nav-child layui-nav-child-c">
          <dd v-for="(child, index) in menu.children" :key="index">
            <a href="javascript:" :id="child.id" :type="child.type" :rel="child.path">{{child.name}}</a>
          </dd>
        </dl>
      </li>
    </ul>
  </div>
  <div style="padding-left: 200px;" class="body">
    <!--头-->
    <div class="layui-row head">
      <div class="layui-col-md6" style="margin-left: 10px;display: flex;">
        <!--面包屑-->
        <span class="layui-breadcrumb">
          <span  v-for="(item, index) in state.breadcrumb" :key="index" >
            <a href="javascript:" @click="toHome(item.path)">{{item.name}}</a>
            <span v-if="index < state.breadcrumb.length - 1" lay-separator>/</span>
          </span>
        </span>
      </div>
      <div class="layui-col-md6">
        <div style="float: right;margin-right: 30px;">
          <span id="username" class="username">{{state.username}}</span>
        </div>
      </div>
    </div>
    <!--tab页面-->
    <div class="tab">
      <div class="layui-tab" lay-allowClose="true" lay-filter="tabs">
        <ul class="layui-tab-title"></ul>
        <div class="layui-tab-content">
          <div class="layui-table-item layui-show"></div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import {nextTick, onMounted, reactive} from "vue";
import {getMenuList} from "./api/menu/menu";
import {errorMsg, infoMsg, successMsg} from "./utils/layerMsg";
import store from "./store";
import routers from "./router/routers";
export default {
  name: "Index",
  setup(){
    const state = reactive({
      menuList: [],
      username: store.state.user.nickName,
      breadcrumb: [{path: '/home', name: '首页'}],
      ids: [0],
      breads: [],
      element: null
    })

    onMounted(() => {
      getHome()
    })

    //  获取首页
    function getHome(){
      nextTick(() => {
        state.element = window.layui.element
        const $ = window.layui.jquery
        state.element.tabAdd('tabs', {
          title: '首页',
          content: createIframe('/home'),
          id: 0
        })
        //  切换至首页
        state.element.tabChange('tabs', 0)
        //  隐藏首页关闭按钮
        $(".layui-tab ul").children('li').first().children('.layui-tab-close').css("display",'none');
        getMenuTree()
      })
    }

    //  获取菜单树
    function getMenuTree(){
      getMenuList().then(res => {
        if (res.success){
          state.menuList = res.data
          nextTick(() => {
            // const element = window.layui.element
            // //  初始化element模板，非常重要，不加不显示菜单
            state.element.init()
            //  监听事件
            state.element.on('nav(menu)', function (elem) {
              console.log('监听事件')
              const id = elem.context.id
              const type = elem.context.type
              const title = elem.context.innerText
              const url = elem.context.rel

              //  新增tab
              if (state.ids.indexOf(id) === -1){
                if (type === '2'){
                  state.element.tabAdd('tabs', {
                    title: title,
                    content: createIframe(url),
                    id: id
                  })
                  state.ids.push(id)
                  state.breads.push(title)
                  getTitle(id)
                } else if (type === '1'){
                  state.breads = []
                  state.breadParent = title
                  state.breads.push(title)
                }
              }
              //  切换至当前tab
              state.element.tabChange('tabs', id)
              //  切换🍞屑
              state.element.on('tab(tabs)', function (data) {
                if (data.elem.context.attributes && data.elem.context.attributes.length > 0){
                  getTitle(data.elem.context.attributes[0].value)
                }
              })

              //  删除tab
              state.element.on('tabDelete(tabs)', function (elem) {
                const index = elem.index
                state.ids.splice(index, 1)
                state.breads.splice(1, 1)
              })
              //  重新渲染
              state.element.render('nav')
            })
          })
        } else {
          errorMsg(res.msg)
        }
      })
    }

    //  每个tab就是一个iframe
    function createIframe(url){
      return '<iframe src="'+url+'" class="iframe" frameborder="0" scrolling="no"></iframe>'
    }

    //  通过id获取对应的上下级，以生成🍞屑层级
    function getTitle(id){
      state.breadcrumb = []
      state.breadcrumb.push({
        path: '/home',
        name: '首页'
      })
      state.menuList.forEach((item) => {
        if (item.children && item.children.length > 0){
          item.children.forEach((child) => {
            if (child.id + '' === id){
              state.breadcrumb.push(item)
              state.breadcrumb.push(child)
            }
          })
        }
      })
    }

    //  通过🍞屑返回首页
    function toHome(path){
      if (path === "/home"){
        state.element.tabChange('tabs', 0)
        getTitle(0)
      }
    }

    //  退出登录
    function logout(){
      window.layer.confirm('确认退出登录？',{
        btn: ['确认', '取消']
      }, function (index) {
        store.dispatch('tokenAction', null)
        store.dispatch('userAction', null)
        window.layer.close(index)
        routers.replace({path: '/login'})
      }, function () {
        infoMsg('已取消')
      })
    }

    nextTick(() => {
      const dropdown = window.layui.dropdown
      dropdown.render({
        elem: '#username',
        align: 'center',
        data: [{
          title: '退出',
          id: 'logout',
        }],
        style: 'text-align: center;',
        click: function (obj) {
          if (obj.id === 'logout'){
            logout()
          }
        }
      })
    })

    return {
      state,
      createIframe,
      toHome
    }
  }
}
</script>

<style scoped lang="scss">
  .layui-tab{
    margin: 0;
  }

  .layui-tab-title{
    background-color: #FAFAFA;
    width: calc(100vw - 215px);
    height: 30px;
    padding-top: 5px;
    padding-bottom: 5px;
    border: none;
  }

  :deep(.layui-tab-title li){
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }

  :deep(.layui-this:after){
    height: 30px;
  }

  :deep(.layui-tab-title .layui-this) {
    height: 30px;
    color: #ffffff;
    background-color: #5FB878;
  }

</style>