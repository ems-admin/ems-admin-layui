<template>
<div class="layerIframe">
  <div id="tree" style="height: 220px;text-align: left;"></div>
  <div class="btn-div">
    <button class="layui-btn layui-btn-sm layui-btn-primary btn-save" @click="cancel">取消</button>
    <button class="layui-btn layui-btn-sm layui-btn-normal btn-save" @click="authorize">授权</button>
  </div>
</div>
</template>

<script>
import {nextTick, reactive} from "vue";
import {getRoleMenuTree} from "@/api/menu/menu";
import {errorMsg, successMsg} from "@/utils/layerMsg";
import {authorizeRole} from "../../api/menu/menu";
export default {
  name: "authorize",
  setup(props, context){
    const state = reactive({
      menuIds: [],
      roleId: ''
    })

    //  将getParentParams绑定对window上，方便父页面调用传值
    window.getParentParams = getParentParams

    function getParentParams(param){
      state.roleId = param
      getMenuTree(param)
    }

    //  获取菜单树
    function getMenuTree(roleId) {
      getRoleMenuTree({roleId: roleId}).then(res => {
        if (res.success){
          nextTick(() => {
            const tree = window.layui.tree
            renderTree(tree, res.data)
          })
        }
      })
    }

    //  生成树
    function renderTree(tree, data){
      tree.render({
        elem: '#tree',
        id: 'tree_id',
        data: data,
        showCheckbox: true,
        accordion: false
      })
    }

    //  授权
    function authorize(){
      nextTick(() => {
        const tree = window.layui.tree
        //获得选中的节点
        const checkData = tree.getChecked('tree_id')
        console.log('选中的节点')
        console.info(checkData)
        state.menuIds = []
        state.menuIds = getChildNodes(checkData, state.menuIds)
        console.log('授权的菜单')
        console.info(state.menuIds)
        authorizeRole({roleId: state.roleId, menuIds: state.menuIds}).then(res => {
          if (res.success){
            cancel()
            getMenuTree()
            successMsg(res.data)
          } else {
            errorMsg(res.msg)
          }
        })
      })
    }

    //  只获取最下级子节点，防止获取上级目录，渲染的时候会将该上级目录的所有下级目录勾选
    function getChildNodes(treeNode, result){
      for (const i in treeNode) {
        if (treeNode[i].children && treeNode[i].children.length === 0){
          result.push(treeNode[i].id)
        } else {
          getChildNodes(treeNode[i].children, result)
        }
        // result.push(treeNode[i].id)
        // result = getChildNodes(treeNode[i].children, result)
      }
      return result
    }

    //  取消
    function cancel(){
      parent.layer.closeAll()
    }

    return {
      state,
      authorize,
      cancel
    }
  }
}
</script>

<style scoped>

</style>