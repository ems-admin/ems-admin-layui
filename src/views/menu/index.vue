<template>
<div class="body">
  <div class="search-div">
    <div class="layui-row" style="width: 100%;">
      <div class="layui-col-sm8">
        <div class="search-inline">
          <input type="text" class="layui-input search-input" v-model="state.blurry" placeholder="请输入菜单名称">
          <button type="button" class="layui-btn layui-btn-sm" @click="getTableTree">查询</button>
        </div>
      </div>
      <div class="layui-col-sm4">
        <div style="text-align: right;">
          <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" @click="editMenu">新增</button>
        </div>
      </div>
    </div>
  </div>
  <table id="menu"></table>
</div>
</template>

<script>
import {getMenuTable} from "@/api/menu/menu";
import {errorMsg} from "@/utils/layerMsg";
import {nextTick, onMounted, reactive} from "vue";
import {infoMsg, successMsg} from "../../utils/layerMsg";
import {deleteMenu} from "@/api/menu/menu";

export default {
  name: "Index",
  setup(props, context){
    const state = reactive({
      blurry: '',
      parentId: ''
    })

    //  将方法getTableTree绑定到window中,方便iframe直接调用
    window.getTableTree = getTableTree

    onMounted(() => {
      getTableTree()
    })

    function getTableTree(){
      getMenuTable({blurry: state.blurry}).then(res => {
        if (res.success){
          nextTick(() => {
            window.layui.use('treeTable', function () {
              const treeTable = window.layui.treeTable
              renderTable(treeTable, res.data)
            })
          })
        } else {
          errorMsg(res.msg)
        }
      })
    }
    function renderTable(treeTable, data){
      treeTable.render({
        elem: '#menu',
        height: 'full-10',
        tree: {
          iconIndex: 2,
          isPidData: true,
          idName: 'id',
          pidName: 'parentId',
        },
        cols: [[
          { field: 'id', title: 'ID', hide: true},
          { field: 'parentId', title: '父级ID', hide: true},
          { field: 'name', title: '菜单名称', align: 'left'},
          { field: 'path', title: '菜单路由'},
          { field: 'component', title: '菜单组件'},
          { field: 'type', title: '菜单类型', width: 150, templet: function (d) {
              if (d.type === '1'){
                return '菜单'
              } else if (d.type === '2'){
                return '页面'
              } else if (d.type === '3'){
                return '按钮'
              }
            }},
          { field: 'sort', title: '排序', width: 120,},
          { field: 'option', title: '操作', align: 'center', width:120, templet: function (d) {
              return '<a class="layui-btn layui-btn-xs" lay-event="edit">修改</a>' +
                  '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>'
            }},
        ]],
        data: data,
      })

      treeTable.on('tool(menu)', function (obj) {
        if (obj.event === 'edit'){
          editMenu(obj.data)
        } else if (obj.event === 'del'){
          delMenu(obj.data.id)
        }
      })
    }

    //  编辑菜单
    function editMenu(obj){
      window.layer.open({
        type: 2,
        title: '编辑菜单',
        area: ['800px', '420px'],
        content: 'menu/edit',
        success: function (layero, index) {
          if (obj){
            const iframeWin = window[layero.find('iframe')[0]['name']]
            //  将data传到子页面
            iframeWin.getParentParams(obj)
          }
        }
      })
    }

    //  删除菜单
    function delMenu(id){
      window.layer.confirm('确认删除用户？',{
        btn: ['确认', '取消']
      }, function () {
        deleteMenu({id: id}).then(res => {
          if (res.success){
            getTableTree()
            successMsg(res.data)
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
      getTableTree,
      editMenu
    }
  }
}
</script>

<style scoped>

</style>