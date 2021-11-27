<template>
<div class="body">
  <div class="search-div">
    <div class="layui-row">
      <div class="layui-col-sm3">
        <div class="search-inline">
          <label>用户名：</label>
          <input type="text" class="layui-input search-input" v-model="state.username" placeholder="">
        </div>
      </div>
      <div class="layui-col-sm3">
        <div class="search-inline">
          <label>说明：</label>
          <input type="text" class="layui-input search-input" v-model="state.description" placeholder="">
        </div>
      </div>
      <div class="layui-col-sm3">
        <div class="search-inline layui-form">
          <label>类型：</label>
          <select v-model="state.logType" lay-filter="logType">
            <option value="">全部</option>
            <option value="1">正常</option>
            <option value="2">异常</option>
          </select>
          <button type="button" class="layui-btn layui-btn-sm" style="margin-left: 20px;" @click="getLogs">查询</button>
        </div>
      </div>
    </div>
  </div>
  <table id="log" lay-filter="log"></table>
  <div id="page" class="page border"></div>
</div>
</template>

<script>
import {nextTick, onMounted, reactive} from "vue";
import {errorMsg} from "../../utils/layerMsg";
import {queryLogs} from "../../api/log/log";

export default {
  name: "index",
  setup(props, context){
    const state = reactive({
      total: 0,
      corr: 1,
      limit: 10,
      username: '',
      description: '',
      logType: ''
    })

    onMounted(() => {
      getLogs()
    })

    function getPage(){
      nextTick(() => {
        const laypage = window.layui.laypage
        laypage.render({
          elem: 'page',
          count: state.total,
          curr: state.curr,
          limit: state.limit,
          limits: [10, 20, 50, 100, 200, 500, 1000],
          layout: [ 'prev', 'page', 'next', 'count','limit'],
          prev: "<",
          next: ">",
          jump: function (obj, first) {
            state.curr = obj.curr
            state.limit = obj.limit
            if (!first){
              getLogs()
            }
          }
        })
      })
    }

    function getLogs(){
      const logParams = {
          current: state.curr,
          size: state.limit,
          username: state.username,
          description: state.description,
          logType: state.logType
      }
      queryLogs(logParams).then(res => {
        if (res.success){
          nextTick (() => {
            const table = window.layui.table
            state.total = res.data.total
            renderTable(table, res.data.records)
          })
        } else {
          errorMsg(res.msg)
        }
      })
    }

    function renderTable(table, data){
      table.render({
        elem: '#log',
        id: 'log_id',
        height: 'full-120',
        limit: state.limit,
        cols: [[
          {type: 'numbers', title: '序号', width: 60},
          {field: 'username', title: '用户名'},
          {field: 'description', title: '说明'},
          {field: 'logType', title: '类型', templet: function(d){
              if (d.logType === '1'){
                return '正常'
              } else if (d.logType === '2'){
                return '异常'
              }
            }},
          {field: 'method', title: '调用方法'},
          {field: 'params', title: '参数'},
          {field: 'ip', title: 'IP'},
          {field: 'time', title: '耗时(ms)'},
          {field: 'exceptionDetail', title: '错误信息'},
          {field: 'createTime', title: '操作时间'},
        ]],
        data: data ? data : [],
        done: function () {
          getPage()
        }
      })
    }

    nextTick(() => {
      const form = window.layui.form
      form.render()

      form.on('select(logType)', function (data) {
        state.logType = data.value
      })
    })

    return {
      state,
      getLogs
    }
  }
}
</script>

<style scoped lang="scss">
  .page{
    text-align: left;
    margin-top: -10px;
  }

  .layui-form-select{
    width: 120px;
  }
</style>