import { createApp } from 'vue'
import App from './App.vue'

import '/src/assets/css/common.css'
import 'layui/dist/css/layui.css'
import 'layui/dist/css/modules/layer/default/layer.css'
import 'layui/dist/layui'
import '/src/assets/js/treeTable'
import '/src/assets/js/treeSelect'
import '/src/assets/js/selectMultiple'
import './router/index'

import router from './router/routers'
import store from "./store";

const app = createApp(App)
app.use(router).use(store)
app.mount('#app')
