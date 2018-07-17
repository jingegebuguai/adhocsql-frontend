import axios from '~/axios'
import { urlMap } from '../../url';
import { httpPost, httpGet, httpDelete } from '../../axios';
import moment from '../../../node_modules/moment'

const state = {

    dialogFormVisible: false,

    curSql: '',
    executeTime: '',

    temporaryForm_status: '',
    temporaryForm_msg: '',

    temporaryList: [],

    temporaryList_status: '',
    temporaryList_msg: '',

    temporaryDel_status: '',
    temporaryDel_msg: '',

}

const getters = {

    
}

const mutations = {
    
    updateTemproraryFormVisible(state, ret) {
        state.dialogFormVisible = ret
    },
    updateTemproraryFormInfo(state, {status, msg}) {
        state.temporaryForm_status = status
        state.temporaryForm_msg = msg
    },
    updateTemporaryList(state, ret) {
        state.temporaryList = ret
    },
    updateTemproraryListInfo(state, {status, msg}) {
        state.temporaryList_status = status
        state.temporaryList_msg = msg
    },
    updateCurSql(state, ret) {
        state.curSql = ret
    },
    updateExecuteTime(state, ret) {
        state.executeTime = ret
    },
    updateTemproraryDelInfo(state, {status, msg}) {
        state.temporaryDel_status = status
        state.temporaryDel_msg = msg
    }
    
  

}

const actions = {
    temporaryFormAction: async function({commit, dispatch}, val) {
        let url_form = urlMap.temporary.tempForm
        let url_check = urlMap.temporary.checkTemp + '/' + val.name
        let params = {
            table_name: val.name,
            sql_content: val.sql,
            table_comment: 'ss'
        }
        commit('updateTemproraryFormInfo', {status: 'loading', msg: ''})
        await httpGet(url_check).then(
            response => {
                if(response.data === true) {
                    commit('updateTemproraryFormInfo', {status: 'error', msg: '临时表名已存在^v^'})

                } else {
                    httpPost(url_form, params).then(
                        response => {
                
                                commit('updateTemproraryFormInfo', {status: 'success', msg: '临时表保存成功^v^'})
                
                            }
                        ).catch(
                            error => {
                                commit('updateTemproraryFormInfo', {status: 'error', msg: '临时表保存失败-_-|'})
                
                            }
                        )
                    
                }
            }
        ).catch(
            error => {
                commit('updateTemproraryFormInfo', {status: 'error', msg: '临时表保存失败-_-|'})
            }
        )
        // await httpPost(url_form, params).then(
        //     response => {

        //         commit('updateTemproraryFormInfo', {status: 'success', msg: '临时表保存成功^v^'})

        //     }
        // ).catch(
        //     error => {
        //         commit('updateTemproraryFormInfo', {status: 'error', msg: '临时表保存失败-_-|'})

        //     }
        // )
    },

    temporaryListAction: async function({commit, dispatch}) {
        let url = urlMap.temporary.tempList
        httpGet(url)
            .then(
                response => {
                    let temporaryList = response.data
                    temporaryList.map(ele => {
                        ele.create_time = moment(ele.create_time).format('YYYY-MM-DD HH:mm:SS')
                        ele.expire_time = moment(ele.expire_time).format('YYYY-MM-DD HH:mm:SS')
                    })
                    commit('updateTemporaryList', temporaryList)
                    commit('updateTemproraryListInfo', {status: 'success', msg: '临时表获取成功^v^'})   
                }
            )
            .catch(
                error => {
                    console.error('get temporaryList meta data error', error) 
                    commit('updateTemproraryListInfo', {status: 'error', msg: '临时表获取失败-_-|'})   
    
                }
            )
    },
    deleteTemproraryAction: async function({commit, dispatch}, val) {
        commit('updateTemproraryDelInfo', {status: 'loading', msg: ''})
        let url = urlMap.temporary.deleteTemp + '/' + val
        //const response = await axios.delete(`/temporary_table/delete/` + val)
        httpDelete(url)
        .then(
            response => {
                commit('updateTemproraryDelInfo', {status: 'success', msg: '临时表删除成功^v^'})

            }
        ).catch(
            error => {
                commit('updateTemproraryDelInfo', {status: 'error', msg: '临时表删除失败-_-|'})
            }
        )
    }

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}