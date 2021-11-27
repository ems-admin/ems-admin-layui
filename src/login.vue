<template>
<div class="login-div" style="margin: 0;">
  <form class="layui-form login-form">
    <h1 class="login-head">登    录</h1>
    <div class="layui-form-item">
      <div class="layui-inline">
        <input type="text" v-model="loginForm.username" name="username" lay-verify="required" class="layui-input login-input" placeholder="请输入用户名">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-inline">
        <input type="password" v-model="loginForm.password" name="password" lay-verify="required" class="login-input layui-input" placeholder="请输入密码">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-inline">
        <button type="button" class="layui-btn layui-btn-fluid login-input" lay-submit lay-filter="login" @click="submit">登     录</button>
      </div>
    </div>
  </form>
</div>
</template>
<script>
import {login} from "./api/login/login";
import cookie from "js-cookie";
import {errorMsg} from "./utils/layerMsg";
import routers from "./router/routers";
import store from "./store";
export default {
  name: "Login",
  setup(){
    const loginForm = {
      username: '',
      password: ''
    }

    //  登录方法
    function submit(){
      const form = window.layui.form
      form.on('submit(login)', function (data) {
        login(data.field).then(res => {
          if (res.success){
            store.dispatch('tokenAction', res.data.token)
            store.dispatch('userAction', res.data.userDto)
            routers.push({path: '/index'})
          } else {
            errorMsg(res.msg)
          }
        })
      })
    }

    return {
      loginForm,
      submit
    }
  }
}
</script>

<style scoped lang="scss">

</style>