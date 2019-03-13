import Vue from "vue"
import Home from "./index.vue"
import Toast from '@component/toast/toast.js'
import '@component/toast/toast.css'
Vue.use(Toast)
//const vConsole = new VConsole(); // 不使用的时候，可以将这句屏蔽掉；
import 'babel-polyfill';
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()

new Vue({
    el: '#app',
    components: { Home },
    template: '<Home/>'
})