import axios from '~/axios'
import { urlMap } from '../../url';
import { httpPost } from '../../axios';
import moment from '../../../node_modules/moment'

const state = {

    isClickQueryBox: false,
    //所有查询框code代码集合
    queryListData: [],
    //当前查询框代码list
    curQueryCodeList: [],
    //当前执行选中的sql
    curPreQueryCode: '',

    execute_status: '',
    execute_msg: '',

    //查询结果(包括结果和日志)
    executeList: [],

    //本机IP地址
    ip: '',

    preExecuteInfo: [],

    //查询是否成功
    isQuerySuccess: true,


    
}

const getters = {

}

const mutations = {

    updateQueryBoxStatus(state, ret) {
        state.isClickQueryBox = ret
    },
    updateQueryListData(state, ret) {
        state.queryListData = ret
    },
    updateCurQueryCodeList(state, ret) {
        state.curQueryCodeList = ret
    },
    updateCurPreQueryCode(state, ret) {
        state.curPreQueryCode = ret
    },
    updateExecuteInfo(state, {status, msg}) {
        state.execute_status = status
        state.execute_msg = msg
    },
    updateExecuteList(state, ret) {
        state.executeList = ret
    },
    updateIp(state, ret) {
        state.ip = ret
    },
    updateIsQuerySuccess(state, ret) {
        state.isQuerySuccess = ret
    },
  
}




const actions = {

    executeAction: async function({commit, dispatch, rootState}, val) {
        commit('updateExecuteInfo', {status: 'loading', msg: ''})
        //console.log('val',val.sql)
        if(val.multiStatus === false) {
            let url = urlMap.execute.execute
            let params = {
                sql_content: val.sql,
                ip: state.ip
            }
            state.preExecuteInfo.push({
                sql: val.sql, 
                index: val.index
            })
            let object = {
                executeIndex: val.index,
                tableColumn: [],
                executeResult: [],
                executeLog: [],
                taskId: 0,
                //是否有执行
                hasExecute: false,
                //执行状态,false失败：true成功
                executeStatus: false,
                //当前执行的sql
                sql: val.sql,
                createTime: '',
                durationTime: '',
                label: {},
                prop: []
            }
            const promise = await httpPost(url, params)
            .then(
                response => { 
                    state.executeList.push(object)
                    let executeList = response.data.data
                    const trimArray = []
                    executeList.result.forEach(o=>{
                        let primaryKeys = Object.keys(o)
                        let json = {}
                        primaryKeys.forEach((pk, index)=>{
                            json[index] = o[pk]
                            object.label[index] = pk
                        })
                        trimArray.push(json)
                    })
                    executeList.result = trimArray

                    if(executeList.success === true) {
                        state.executeList.forEach(ele => {
                            if(ele.executeIndex !== null && ele.hasExecute == false) {
                                ele.executeResult = executeList.result.length > 10000? executeList.result.slice(0, 10000) : executeList.result
                                let executeKeys = Object.keys(executeList.result[0])     
                                ele.tableColumn = executeKeys
                                ele.taskId = executeList.id
                                ele.executeLog = executeList.execute_log
                                ele.hasExecute = true
                                ele.executeStatus = executeList.success
                                ele.createTime = moment(executeList.create_time).format('YYYY-MM-DD HH:mm:SS'),
                                ele.durationTime = executeList.duration_time
                            }
                        })
                    } else {
                        state.isQuerySuccess = false
                        state.executeList.forEach(ele => {
                            if(ele.executeIndex !== null && ele.hasExecute == false) {
                                ele.taskId = executeList.id
                                ele.executeLog = executeList.execute_log
                                ele.hasExecute = true
                                ele.executeStatus = executeList.success
                                ele.createTime = moment(executeList.create_time).format('YYYY-MM-DD HH:mm:SS'),
                                ele.durationTime = executeList.duration_time
                            }
                        })
                    }
                    //console.log('list', state.executeList)
                    commit('updateExecuteInfo', {status: 'success', msg: 'sql执行成功^v^'})   
            }).catch(error => {
                console.error('get executeResultAndLog meta data error', error) 
                commit('updateExecuteInfo', {status: 'error', msg: 'sql执行失败-_-|'})   
            })
        } else {
            commit('updateSqlExecuteStatus', true)
            //console.log('list-->', state.curQueryCodeList)
        }    
    },

    



}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}