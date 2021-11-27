<template>
<div class="system">
  <img src="../../assets/image/404.png"/>
  <div class="title">
    <h2>页面走丢了...</h2>
    <button type="button" class="layui-btn layui-btn-lg layui-btn-normal" @click="back">返回</button>
<!--    <h4>远方的朋友你好！非常抱歉，您所请求的页面不存在！</h4>-->
<!--    <h4>请仔细检查您输入的网址是否正确。</h4>-->
  </div>
</div>
</template>
<script>
import '/src/assets/css/404.css'
import '/src/assets/css/h-ui.reset.css'
import routers from "../../router/routers";
export default {
  name: "404",
  setup(){
    function back(){
      routers.back()
    }

    return {
      back
    }
  }
}
</script>

<style scoped lang="scss">
  .layui-btn-normal{
    background-color: rgba(30,159,255,0.5);
    font-size: 18px;
    font-weight: bold;
  }
</style>