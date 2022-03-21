<template>
  <div class="layerIframe">
    <form class="layui-form" lay-filter="form">
      <input name="id" style="display: none">
      <div class="layui-row layui-col-space10">
        <div class="layui-col-sm6">
          <div class="layui-form-item">
            <div class="layui-form-label">上级目录</div>
            <div class="layui-input-block">
              <input v-model="state.parentId" type="text" id="tree" name="parentId" lay-verify="required" lay-filter="tree" placeholder="请选择上级目录" class="layui-input layui-input-form">
            </div>
          </div>
        </div>
        <div class="layui-col-sm6">
          <div class="layui-form-item">
            <div class="layui-form-label">菜单排序</div>
            <div class="layui-input-block">
              <input class="layui-input" lay-verify="required|number" name="sort" placeholder="请输入菜单排序">
            </div>
          </div>
        </div>
      </div>
      <div class="layui-row layui-col-space10">
        <div class="layui-col-sm6">
          <div class="layui-form-item" pane>
            <div class="layui-form-label">菜单类型</div>
            <div class="layui-input-block" style="text-align: left;">
              <input type="radio" lay-filter="type" name="type" value="1" title="菜单" checked>
              <input type="radio" lay-filter="type" name="type" value="2" title="页面">
              <input type="radio" lay-filter="type" name="type" value="3" title="按钮">
            </div>
          </div>
        </div>
        <div v-if="state.isBtn" class="layui-col-sm6">
          <div class="layui-form-item">
            <div class="layui-form-label">权限标识</div>
            <div class="layui-input-block">
              <input class="layui-input" lay-verify="required" name="permission" placeholder="请输入权限标识">
            </div>
          </div>
        </div>
      </div>
      <div class="layui-form-item">
        <div class="layui-form-label">菜单名称</div>
        <div class="layui-input-block">
          <input class="layui-input layui-input-form" lay-verify="required" name="name" placeholder="请输入菜单名称">
        </div>
      </div>
      <div v-if="state.isPage" class="layui-form-item">
        <div class="layui-form-label">菜单路由</div>
        <div class="layui-input-block">
          <input class="layui-input layui-input-form" lay-verify="required" name="path" placeholder="请输入菜单路由">
        </div>
      </div>
      <div v-if="state.isPage" class="layui-form-item">
        <div class="layui-form-label">菜单组件</div>
        <div class="layui-input-block">
          <input class="layui-input layui-input-form" lay-verify="required" name="component" placeholder="请输入菜单组件">
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
import {nextTick, onMounted, reactive} from "vue";
import {editMenu, getSelectTree} from "../../api/menu/menu";
import {errorMsg, successMsg} from "../../utils/layerMsg";

export default {
  name: "Edit",
  setup(props, context){
    const state = reactive({
      isPage: false,
      isBtn: false,
      parentId: null,
      childObj: null
    })

    //  将方法getParentParams绑定到window中,方便父页面直接调用
    window.getParentParams = getParentParams

    onMounted(() => {

    })

    //  获取父组件传值
    function getParentParams(param){
      if (param && param.id){
        nextTick(() => {
          const form = window.layui.form
          if (param.type === '2'){
            state.isPage = true
          } else if (param.type === '3'){
            state.isPage = true
            state.isBtn = true
          }
          //  延时1毫秒,不然path会来不及更新
          setTimeout(() => {
            form.val('form', param)
          }, 1)
        })
      }
      getParentTree(param.parentId)
    }

    //  获取菜单数据
    function getParentTree(parentId) {
      getSelectTree().then(res => {
        if (res.success){
          nextTick(() => {
            window.layui.use('treeSelect', function () {
              const treeSelect = window.layui.treeSelect
              renderParentTree(treeSelect, res.data, parentId)
            })
          })
        } else {
          errorMsg(res.msg)
        }
      })
    }

    //  生成菜单树
    function renderParentTree(treeSelect, data, parentId){
      treeSelect.render({
        elem: '#tree',
        data: data,
        style: {
          folder: {
            enable: true
          },
          line: {
            enable: true
          }
        },
        search: true,
        click: function(obj){
          state.parentId = obj.current.id
        },
        success: function (data) {
          //  默认为0，即顶级目录
          parentId = parentId ? parentId : 0
          state.parentId = parentId
          treeSelect.checkNode('tree', parentId)
        }
      })
    }

    //  取消
    function cancel(){
      parent.layer.closeAll()
    }

    //  form表单渲染
    nextTick(() => {
      const form = window.layui.form
      //  渲染radio
      form.render('radio')
      //  监听radio
      form.on('radio(type)', function (obj) {
        if (obj.value === '2'){
          state.isPage = true
          state.isBtn = false
        } else if (obj.value === '3'){
          state.isPage = true
          state.isBtn = true
        } else {
          state.isPage = false
          state.isBtn = false
        }
      })
      //  提交
      form.on('submit(form)', function (data) {
        console.info('aaa')
        console.info(data.field)
        editMenu(data.field).then(res => {
          if (res.success){
            successMsg(res.data)
            //  刷新列表
            window.parent.getTableTree()
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
      cancel,
      getParentParams
    }
  }
}
</script>

<style scoped>

</style>