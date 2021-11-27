<template>
<div class="layerIframe">
  <form class="layui-form" lay-filter="form">
    <input name="id" style="display: none">
    <div class="layui-form-item">
      <div class="layui-form-label">用户名</div>
      <div class="layui-input-block">
        <input class="layui-input layui-input-form" lay-verify="required" name="username">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">昵称</div>
      <div class="layui-input-block">
        <input class="layui-input layui-input-form" lay-verify="required" name="nickName">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">角色</div>
      <div class="layui-input-block">
        <div class="layui-input-form" id="role" style="width: 100%;"></div>
      </div>
    </div>
    <div class="layui-form-item btn-div">
      <div class="layui-inline">
        <button class="layui-btn layui-btn-sm layui-btn-primary btn-save" @click="cancel">取消</button>
        <button class="layui-btn layui-btn-sm layui-btn-normal btn-save" lay-submit lay-filter="form">保存</button>
      </div>
    </div>
  </form>
</div>
</template>
<script>
import {nextTick, reactive} from "vue";
import {getRoleSelect} from "../../api/role/role";
import {errorMsg, successMsg} from "../../utils/layerMsg";
import {editUser} from "../../api/user/user";

export default {
  name: "edit",
  setup(props, context){
    const state = reactive({
      selected: null,
      roles: []
    })

    //  将方法getParentParams绑定到window中,方便父页面直接调用
    window.getParentParams = getParentParams

    function getParentParams(param){
      if (param.id){
        nextTick(() => {
          const form = window.layui.form
          form.val('form', param)
        })
      }
      getRoles(param.id)
    }

    function getRoles(userId){
      getRoleSelect({userId: userId}).then(res => {
        if (res.success){
          const selected = []
          if (res.data && res.data.length > 0){
            res.data.forEach((item) => {
              if (item.selected){
                selected.push(item.id)
              }
            })
          }
          nextTick(() => {
            window.layui.use('selectMultiple', function () {
              const selectMultiple = window.layui.selectMultiple
              state.selected = selectMultiple({
                elem: '#role',
                data: res.data,
                name: 'roles',
                verify: 'required',
                selected: selected
              })
            })
          })
        } else {
          errorMsg(res.msg)
        }
      })
    }

    function cancel(){
      parent.layer.closeAll()
    }

    //  form监听
    nextTick(() => {
      const form = window.layui.form

      //  渲染select
      form.render('select')

      //  表单提交
      form.on('submit(form)', function (data) {
        if (data.field.roles){
         data.field.roles = data.field.roles.split(";")
        }
        editUser(data.field).then(res => {
          if (res.success){
            successMsg(res.data)
            parent.getUserTable()
            cancel()
          } else {
            errorMsg(res.msg)
          }
        })
        return false
      })
    })

    return {
      state,
      cancel
    }
  }
}
</script>

<style scoped>

</style>