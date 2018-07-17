import axios from '~/axios'
import { urlMap } from '../../url';
import { httpGet, httpPost, httpDelete } from '../../axios';
import moment from '../../../node_modules/moment'

const state = {

    dialogFormVisible: false,
    isClickCollectList: false,
    isHasCollectBox: false,

    //收藏post状态
    collect_status: '',
    collect_msg: '',

    //收藏list状态
    collectList_status: '',
    collectList_msg: '',

    //修改状态
    modifySql_status: '',
    modifySql_msg: '',

    deleteSql_status: '',
    deleteSql_msg: '',

    collectList: [],
    opreatorData: {},
    isClickCollectQueryButton: false,
    isClickCollectEditButton: false,
    row: 0,
}

const getters = {

    
}

const mutations = {
    updateIsHasCollectBox(state, ret) {
        state.isHasCollectBox = ret
    },
    updateDialogFormVisible(state, ret) {
        state.dialogFormVisible = ret
    },
    updateCollectListStatus(state, ret) {
        state.isClickCollectList = ret
    },
    updateCollectInfo(state, {status, msg}) {
        state.collect_status = status,
        state.collect_msg = msg
    },
    updateCollectListInfo(state, {status, msg}) {
        state.collectList_status = status,
        state.collectList_msg = msg
    },
    updateModifySqlInfo(state, {status, msg}) {
        state.modifySql_status = status,
        state.modifySql_msg = msg
    },
    updateDeleteSqlInfo(state, {status, msg}) {
        state.deleteSql_status = status,
        state.deleteSql_msg = msg
    },
    updateOperateData(state, ret) {
        state.opreatorData = ret
    },
    setIsClickCollectQueryButton(state, ret) {
        state.isClickCollectQueryButton = ret
    },
    setIsClickCollectEditButton(state, ret) {
        state.isClickCollectEditButton = ret
    }
}

const actions = {

    collectSqlAction: async function({commit, dispatch}, val) {
        commit('updateCollectInfo', {status: 'loading', msg: ''})
        let url = urlMap.collect.collectSql
        let params = {
            query_name: val.name,
            sql_content: val.sql,
        }
        await httpPost(url, params).then(
            response => {
                let responseStatus = response.data.success
                if(responseStatus === true) {
                    commit('updateCollectInfo', {status: 'success', msg: 'sql收藏成功^v^'})
                } else {
                    commit('updateCollectInfo', {status: 'error', msg: 'sql收藏失败-_-|'})
                }
            }
        ).catch(
            error => {
                commit('updateCollectInfo', {status: 'error', msg: 'sql收藏失败-_-|'})
            }
        )
    },

    collectListAction: async function({commit, dispatch}, val) {
        commit('updateCollectListInfo', {status: 'loading', msg: ''})
        let url = urlMap.collect.collectList + `?page_size=` + val.limit + `&page_number=` + val.page
        const promise = await httpGet(url).then(
            response => {
                if(response.success === true) {
                    let collectList = response.data.list
                    collectList.map(ele => {
                        ele.create_time = moment(ele.create_time).format('YYYY-MM-DD HH:mm:SS')
                    })
                    state.collectList = collectList
                    state.row = response.data.total_row
                    commit('updateCollectListInfo', {status: 'success', msg: 'sql收藏列表获取成功^v^'})
                } else {
                    console.error('get executeResultAndLog meta data error', error) 
                    commit('updateCollectListInfo', {status: 'error', msg: 'sql收藏列表获取失败-_-|'})        
                }
            }
        ).catch(
            error => {
                console.error('get collectList meta data error', error) 
                commit('updateCollectListInfo', {status: 'error', msg: 'sql收藏列表获取失败-_-|'})
            }
        )
    },

    modifyCollectSql: async function({commit, dispatch}, val) {
        commit('updateModifySqlInfo', {status: 'loading', msg: ''})
        let url = urlMap.collect.modify
        let params = {
            id: state.opreatorData.id,
            query_name: val.name,
            sql_content: val.sql
        }
        await httpPost(url, params).then(
            response => {

                let modifyStatus = response.data.success
                if(modifyStatus === true) {
                    commit('updateModifySqlInfo', {status: 'success', msg: 'sql修改成功^v^'})
                } else {
                    commit('updateModifySqlInfo', {status: 'error', msg: 'sql修改失败-_-|'})
                }
            }
        ).catch(
            error => {
                commit('updateModifySqlInfo', {status: 'error', msg: 'sql修改失败-_-|'})

            }
        )
    },

    deleteCollectSql: async function({commit, dispatch}, val) {
        commit('updateDeleteSqlInfo', {status: 'loading', msg: ''})
        let url = urlMap.collect.delete + '/' + state.opreatorData.id
        const promise = await httpDelete(url).then(
            response => {
                let deleteStatus = response.data.success
                if(deleteStatus === true) {
                    commit('updateDeleteSqlInfo', {status: 'success', msg: 'sql删除成功^v^'})

                } else {
                    commit('updateDeleteSqlInfo', {status: 'error', msg: 'sql删除失败-_-|'})

                }
            }
        ).catch(
            error => {
                commit('updateDeleteSqlInfo', {status: 'error', msg: 'sql删除失败-_-|'})

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