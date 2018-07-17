import axios from '~/axios'
import queryBox from '../modules/queryBox'
import { httpGet } from '../../axios';
import { urlMap } from '../../url';
import moment from '../../../node_modules/moment'

const state = {

    //是否点击记录框
    isClickQueryRecordBox: false,
    isHasQueryRecordBox: false,
    //查询历史结果状态
    historyResult_status: '',
    historyResult_msg: '',

    //查询历史日志状态
    historyLog_status: '',
    historyLog_msg: '',

    //查询记录列表状态
    historyList_status: '',
    historyList_msg: '',

    recordList: [],
    recordResult: [],
    recordLog: [],

    recordEvent: '',
    operatorData: {},
    isClickRecordEvent: false,
    row: 0
}

const getters = {

    
}

const mutations = {
    updateIsHasQueryRecordBox(state, ret) {
        state.isHasQueryRecordBox = ret
    },
    updateQueryRecordStatus(state, ret) {
        state.isClickQueryRecordBox =  ret
    },

    updateHistoryResultInfo(state, {status, msg}) {
        state.historyResult_status = state
        state.historyResult_msg = msg
    },

    updateHistoryLogInfo(state, {status, msg}) {
        state.historyLog_status = status
        state.historyLog_msg = msg
    },

    updateHistoryListInfo(state, {status, msg}) {
        state.historyList_status = status
        state.historyList_msg = msg
    },

    updateRecordResult(state, ret) {
        state.recordResult = ret
    },

    updateRecordLog(state, ret) {
        state.recordLog = ret
    },
  
    updateRecordList(state, ret) {
        state.recordList = ret
    },

    updateRecordEvent(state, ret) {
        state.recordEvent = ret
    },
    setIsClickRecordEvent(state, ret) {
        state.isClickRecordEvent = ret
    },
    updateOperatorData(state, ret) {
        state.operatorData = ret
    }


    
}



const actions = {
    executeHistoryResultAction: async function({commit, dispatch}, val) {
        commit('updateHistoryResultInfo', {status: 'loading', msg: ''})
        let url = urlMap.record.historyResult + '/' + state.operatorData.id
        const promise = await httpGet(url)
            .then(
                response => {
                    let object = {
                        executeIndex: val.index,
                        tableColumn: [],
                        executeResult: [],
                        executeLog: [],
                        taskId: val.id,
                        //是否有执行
                        hasExecute: false,
                        //执行状态,false失败：true成功
                        executeStatus: false,
                        //当前执行的sql
                        sql: val.sql,
                        createTime: val.create_time,
                        durationTime: '',
                        label: {},
                        prop: []
                    }
                    queryBox.state.executeList.push(object)
                    let executeList = response.data

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
                        queryBox.state.executeList.forEach(ele => {
                            //console.log('ele-->', ele)
                            if(ele.executeIndex !== null && ele.hasExecute == false) {
                                ele.executeResult = executeList.result.length > 10000? executeList.result.slice(0, 10000) : executeList.result
                                let executeKeys = Object.keys(executeList.result[0])
                                ele.tableColumn = executeKeys
                                ele.executeLog = executeList.execute_log
                                ele.hasExecute = true
                                ele.executeStatus = executeList.success
                                ele.durationTime = executeList.duration_time
                            }
                        })
                    } else {
                        queryBox.state.executeList.forEach(ele => {
                            //console.log('ele-->', ele)
                            if(ele.executeIndex !== null && ele.hasExecute == false) {
                                ele.executeLog = executeList.execute_log
                                ele.hasExecute = true
                                ele.executeStatus = executeList.success
                                ele.durationTime = executeList.duration_time
                            }
                        })
                    }
                    //console.log(queryBox.state.executeList)
                    commit('updateHistoryResultInfo', {status: 'success', msg: '查询结果成功^v^'})

                }
            )
            .catch(
                error => {
                    console.error('get executeResult meta data error', error) 
                    commit('updateHistoryResultInfo', {status: 'error', msg: '查询结果失败-_-|'})
                }
            )
    },

    executeHistoryLogAction: async function({commit, dispatch, rootState}, val) {
        commit('updateHistoryLogInfo', {status: 'loading', msg: ''})
        let url = urlMap.record.historyLog + '/' + state.operatorData.id
        const promise = await httpGet(url).then(
            response => {
                let object = {
                    executeIndex: val.index,
                    tableColumn: [],
                    executeResult: [],
                    executeLog: [],
                    taskId: val.id,
                    //是否有执行
                    hasExecute: false,
                    //执行状态,false失败：true成功
                    executeStatus: false,
                    //当前执行的sql
                    sql: val.sql,
                    createTime: val.create_time,
                    durationTime: ''
                }
                queryBox.state.executeList.push(object)
                let executeList = response.data
                if(executeList.success === true) {
                    queryBox.state.executeList.forEach(ele => {
                        //console.log('ele-->', ele)
                        if(ele.executeIndex !== null && ele.hasExecute == false) {
                            ele.executeResult = executeList.result
                            let executeKeys = Object.keys(executeList.result[0])
                            ele.tableColumn = executeKeys
                            ele.executeLog = executeList.execute_log
                            ele.hasExecute = true
                            ele.executeStatus = executeList.success
                            ele.durationTime = executeList.duration_time
                        }
                    })
                } else {
                    queryBox.state.executeList.forEach(ele => {
                        //console.log('ele-->', ele)
                        if(ele.executeIndex !== null && ele.hasExecute == false) {
                            ele.executeLog = executeList.execute_log
                            ele.hasExecute = true
                            ele.executeStatus = executeList.success
                            ele.durationTime = executeList.duration_time
                        }
                    })
                }

                commit('updateHistoryLogInfo', {status: 'success', msg: '查询结果成功^v^'})
            }
        ).catch(error => {
            console.error('get executeLog meta data error', error) 
            commit('updateHistoryLogInfo', {status: 'error', msg: '查询结果失败-_-|'})
        })
    },

    executeHistoryListAction: async function({commit, dispatch, rootState}, val) {
        commit('updateHistoryListInfo', {status: 'loading', msg: ''})
        if(typeof(val) !== 'undefined') {
            //console.log(val)
            let size = val.limit
            let page = val.page_num

            let url = urlMap.record.historyList + `?page_size=` + size + `&page_number=` + page
            const promise = await httpGet(url).then(
                response => {
                    let recordList = response.data.list
                    state.row = response.data.total_row
                    //console.log('record',recordList)
                    recordList.map(ele => {
                        ele.create_time = moment(ele.create_time).format('YYYY-MM-DD HH:mm:SS')
                        switch(ele.status) {
                            case 0: ele.status = '进行中'
                            break
                            case 1: ele.status = '失败'
                            break
                            case 2: ele.status = '成功'
                        }
                    })
                    commit('updateRecordList', recordList)
                    //console.log(recordList)
                    commit('updateHistoryListInfo', {status: 'success', msg: '查询结果成功^v^'})
                }
            ).catch(error => {
                    console.error('get recordList meta data error', error) 
                    commit('updateHistoryListInfo', {status: 'error', msg: '查询结果失败-_-|'})
                }
            )
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