import Vue from 'vue'
import router from './router'
import store from './vuex/store'
import ElementUI, { ColorPicker } from 'element-ui'
import iView from 'iview'
import App from './App.vue'
import Icon from 'vue-awesome/components/Icon'
import VCalendar from 'v-calendar'
import 'vue-awesome/icons'
import 'iview/dist/styles/iview.css'
import './theme/index.scss'
import './assets/iconfont/iconfont.css'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'font-awesome/css/font-awesome.min.css'

import '~/scss/index.scss'

import {httpGet, httpPost, httpPut, httpDelete} from '~/axios'

import {urlMap} from '~/url'




Vue.use(ElementUI)
Vue.use(iView)
Vue.use(VCalendar)
Vue.component('icon', Icon)
Vue.use(VueCodemirror)


Vue.prototype.$httpPost=httpPost;
Vue.prototype.$httpGet=httpGet;
Vue.prototype.$httpPut=httpPut;
Vue.prototype.$httpDelete=httpDelete;
Vue.prototype.$urlMap = urlMap

new Vue({
    store,
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
})