<template>
<div class="body">
  <div class="search-div">
    <div class="layui-row" style="width: 100%;">
      <div class="layui-col-sm8">
        <div class="search-inline">
          <input type="text" class="layui-input search-input" v-model="state.blurry" placeholder="请输入角色名称/代码/描述">
          <button type="button" class="layui-btn layui-btn-sm" @click="getRoleList">查询</button>
        </div>
      </div>
      <div class="layui-col-sm4">
        <div style="text-align: right;">
          <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" @click="editRole">新增</button>
        </div>
      </div>
    </div>
  </div>
  <table id="role" lay-filter="role"></table>
</div>
</template>

<script>
import {nextTick, onMounted, reactive} from "vue";
import {getRoleTable} from "@/api/role/role";
import {errorMsg} from "@/utils/layerMsg";
import {infoMsg, successMsg} from "../../utils/layerMsg";
import {deleteRole} from "../../api/role/role";

export default {
  name: "index",
  setup(props, context){
    const state = reactive({
      blurry: ''
    })

    //  将getRoleList绑定到window上面，方便iframe页面调用
    window.getRoleList = getRoleList

    onMounted(() => {
      getRoleList()
    })

    //  获取角色数据
    function getRoleList(){
      getRoleTable({blurry: state.blurry}).then(res => {
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

    //  生成角色列表
    function renderTable(table, data){
      table.render({
        elem: '#role',
        id: 'role_id',
        height: 'full-50',
        page: true,
        cols:[[
          { type: 'numbers', title: '序号', width: 50},
          { field: 'roleName', title: '角色名称'},
          { field: 'roleCode', title: '角色代码'},
          { field: 'description', title: '描述', align: 'left'},
          { field: 'option', title: '操作', width: 200, align: 'center', templet: function (data) {
              return '<a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="authorize">授权</a>' +
                  '<a class="layui-btn layui-btn-xs" lay-event="edit">修改</a>' +
                  '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>'
            } },
        ]],
        data: data ? data : []
      })

      table.on('tool(role)', function (obj) {
        if (obj.event === 'edit'){
          editRole(obj.data)
        } else if (obj.event === 'del'){
          delRole(obj.data.id)
        } else if (obj.event === 'authorize'){
          authorize(obj.data.id)
        }
      })
    }

    //  编辑角色
    function editRole(data){
      window.layer.open({
        type: 2,
        title: '编辑角色',
        area: ['800px', '400px'],
        content: '/role/edit',
        success: function (layero, index) {
          const iframeWin = window[layero.find('iframe')[0]['name']]
          //  将data传到子页面
          iframeWin.getParentParams(data)
        }
      })
    }

    //  删除角色
    function delRole(id){
      window.layer.confirm('确认删除角色？', {
        btn: ['确认', '取消']
      }, function () {
        deleteRole({id: id}).then(res => {
          if (res.success){
            successMsg(res.data)
            getRoleList()
          } else {
            errorMsg(res.msg)
          }
        })
      }, function () {
        infoMsg('操作已取消')
      })
    }

    //  角色授权
    function authorize(id){
      window.layer.open({
        type: 2,
        title: '角色授权',
        area: ['800px', '400px'],
        content: '/role/authorize',
        success: function (layero, index) {
          const iframeWin = window[layero.find('iframe')[0]['name']]
          //  将data传到子页面
          iframeWin.getParentParams(id)
        }
      })
    }

    return{
      state,
      getRoleList,
      editRole
    }
  }
}
</script>

<style scoped>

</style>