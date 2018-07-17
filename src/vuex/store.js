import Vue from 'vue'
import Vuex from 'vuex'
import plugins from './plugins'
import params from './modules/params'
import queryBox from './modules/queryBox'
import execute from './modules/execute'
import queryRecord from './modules/queryRecord'
import common from './modules/common'
import collect from './modules/collect'
import temprorary from './modules/temprorary'
import resource from './modules/resource'


Vue.use(Vuex)
export const STORAGE_KEY = 'todos-vuejs'

export default new Vuex.Store({
    plugins,
    state: {
        query_md5: '6d37d11078ff8253ca17f214d60b38e2'
    },
    mutations: {
        ChangeQueryMd5(state, val) {
            state.query_md5 = val
        }
    },
    actions: {},
    modules: {
        params,
        common,
        queryBox,
        execute,
        queryRecord,
        collect,
        temprorary,
        resource
    }
})
