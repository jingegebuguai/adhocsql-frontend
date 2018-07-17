import Vue from 'vue'
import Router from 'vue-router'
import MainBox from '~/containers/MainBox.vue'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    routes: [{
        path: '/',
        redirect: '/main-box'
    }, {
        path: '/main-box',
        name: 'mian-box',
        component: MainBox
    }]
})