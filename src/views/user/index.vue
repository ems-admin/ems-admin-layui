<template>
<div class="body">
  <div class="search-div">
    <div class="layui-row" style="width: 100%;">
      <div class="layui-col-sm8">
        <div class="search-inline">
          <input type="text" class="layui-input search-input" v-model="this.state.blurry" placeholder="请输入用户名/昵称">
          <button type="button" class="layui-btn layui-btn-sm" @click="getUserTable">查询</button>
        </div>
      </div>
      <div class="layui-col-sm4">
        <div style="text-align: right;">
          <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" @click="editUser">新增</button>
        </div>
      </div>
    </div>
  </div>
  <table id="user" lay-filter="user"></table>
</div>
</template>

<script>
import {nextTick, onMounted, reactive} from "vue";
import {errorMsg, infoMsg, successMsg} from "../../utils/layerMsg";
import {chargeUserStatus, delUserById, getUserList} from "../../api/user/user";
import store from "../../store";

export default {
  name: "Index",
  setup(props, context){
    const state = reactive({
      blurry: '',
    })

    //  将方法getUserTable绑定到window中,方便iframe直接调用
    window.getUserTable = getUserTable

    onMounted(() => {
      getUserTable()
    })

    //  获取用户数据
    function getUserTable() {
      getUserList().then(res => {
        if (res.success){
          nextTick(() => {
            const table = window.layui.table
            renderTable(table, res.data)
          })
        } else {
          errorMsg(res.msg)
        }
      })
    }

    //  生成用户表
    function renderTable(table, data){
      table.render({
        elem: '#user',
        id: 'user_id',
        height: 'full-50',
        page: true,
        cols: [[
          { type: 'numbers', title: '序号' },
          { field: 'username', title: '用户名' },
          { field: 'nickName', title: '昵称' },
          { field: 'enabled', title: '状态', width: 100, templet: function (data) {
              return data.enabled === true ? '启用' : '停用'
            } },
          { field: 'option', title: '操作', width: 180, align: 'center', templet: function (data) {
              const status = data.enabled === false ? '启用' : '停用'
              if (data.roles.indexOf('ROLE_ADMIN') === -1){
                return '<a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="status">'+status+'</a>' +
                    '<a class="layui-btn layui-btn-xs" lay-event="edit">修改</a>' +
                    '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>'
              } else {
                return ''
              }
            } },
        ]],
        data: data ? data : []
      })

      table.on('tool(user)', function (obj) {
        if (obj.event === 'status'){
          changeStatus(obj.data.id, !obj.data.enabled)
        } else if (obj.event === 'edit'){
          editUser(obj.data)
        } else if (obj.event === 'del'){
          delUser(obj.data.id)
        }
      })
    }

    //  编辑用户
    function editUser(obj){
      window.layer.open({
        type: 2,
        title: '编辑用户',
        area: ['700px', '350px'],
        content: 'user/edit',
        success: function (layero, index) {
          const iframeWin = window[layero.find('iframe')[0]['name']]
          iframeWin.getParentParams(obj)
        }
      })
    }

    //  修改用户状态
    function changeStatus(id, enabled){
      chargeUserStatus({id: id, enabled: enabled}).then(res => {
        if (res.success){
          successMsg(res.data)
          getUserTable()
        } else {
          errorMsg(res.msg)
        }
      })
    }

    //  删除用户
    function delUser(id){
      window.layer.confirm('确认删除用户？',{
        btn: ['确认', '取消']
      }, function () {
        delUserById({id: id}).then(res => {
          if (res.success){
            successMsg(res.data)
            getUserTable()
          } else {
            errorMsg(res.msg)
          }
        })
      }, function () {
        infoMsg('已取消')
      })
    }

    return {
      state,
      editUser,
      getUserTable
    }
  }
}
</script>

<style scoped>

</style>