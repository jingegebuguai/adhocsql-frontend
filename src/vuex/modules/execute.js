import axios from '~/axios'

const state = {

    //是否点击执行框
    isClickCurExecute: false,
    isClickAllExecute: false,

    curExecuteIndexAndFlag: '',

    //记录每个sql对应的结果框
    executedSqlList: []
    
}

const getters = {

}

const mutations = {

    updateCurExecuteStatus(state, ret) {
        state.isClickCurExecute = ret
    },
    updateAllExecuteStatus(state, ret) {
        state.isClickAllExecute = ret
    },
    updateCurExecuteIndexAndFlag(state, ret) {
        state.curExecuteIndexAndFlag = ret
    },

    updateExecutedSqlList(state, ret) {
        state.executedSqlList = ret
    }

}

const actions = {
    
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}