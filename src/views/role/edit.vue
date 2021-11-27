<template>
<div class="layerIframe">
  <form class="layui-form" lay-filter="form">
    <input name="id" style="display: none">
    <div class="layui-form-item">
      <div class="layui-form-label">角色名称</div>
      <div class="layui-input-block">
        <input type="text" name="roleName" lay-verify="required" class="layui-input layui-input-form" placeholder="请输入角色名称">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">角色代码</div>
      <div class="layui-input-block">
        <input class="layui-input layui-input-form" lay-verify="required" name="roleCode" placeholder="请输入角色代码">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">角色描述</div>
      <div class="layui-input-block">
        <textarea class="layui-input layui-input-form layui-textarea-form" lay-verify="required" name="description" placeholder="请输入角色描述"></textarea>
      </div>
    </div>
    <div class="layui-form-item btn-div">
      <div class="layui-inline">
        <button type="button" class="layui-btn layui-btn-sm layui-btn-primary btn-save" @click="cancel">取消</button>
        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal btn-save" lay-submit lay-filter="form">保存</button>
      </div>
    </div>
  </form>
</div>
</template>

<script>
import {nextTick, reactive} from "vue";
import {editRole} from "../../api/role/role";
import {errorMsg, successMsg} from "../../utils/layerMsg";

export default {
  name: "edit",
  setup(props, context){
    const state = reactive({

    })

    //  将getParentParams绑定对window上，方便父页面调用传值
    window.getParentParams = getParentParams

    //  获取父页面传过来的值
    function getParentParams(param){
      if (param.id){
        nextTick(() => {
          const form = window.layui.form
          form.val('form', param)
        })
      }
    }

    //  取消
    function cancel(){
      parent.layer.closeAll()
    }

    nextTick(() => {
      const form = window.layui.form
      form.on('submit(form)', function (data) {
        editRole(data.field).then(res => {
          if (res.success){
            successMsg(res.msg)
            parent.getRoleList()
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