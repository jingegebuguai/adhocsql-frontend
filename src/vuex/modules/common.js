import axios from '~/axios'

const state = {

    flag: ''

}

const getters = {

    
}

const mutations = {
    
    updateFlag(state, ret) {
        state.flag = ret
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