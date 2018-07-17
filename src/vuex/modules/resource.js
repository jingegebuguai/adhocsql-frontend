import axios from '~/axios'
import { urlMap } from '../../url';
import { httpGet } from '../../axios';

const state = {

    resourceList: [],

    resourceTitle: '',
    isClickResource: false,

    preResource: [],
    resourceList_status: '',
    resourceList_msg: '',

    resourceSchema_status: '',
    resourceSchema_msg: ''
}

const getters = {

}

const mutations = {

    updateResourceListInfo(state, {status, msg}) {
        state.resourceList_status = status,
        state.resourceList_msg = msg
    },

    updateResourceSchemaInfo(state, {status, msg}) {
        state.resourceSchema_msg = msg,
        state.resourceSchema_status = status
    },

    updatePreResource(state, ret) {
        state.preResource = ret
    },

    updateResourceTitle(state, {title, click}) {
        state.resourceTitle = title
        state.isClickResource = click
    }

}

const actions = {
    resourceListAction: async function({commit, dispatch}) {
        commit('updateResourceListInfo', {status: 'loading'})
        let url = urlMap.resource.resourceList 
        await httpGet(url)
        // const response = await axios.get(`/adhoc-sql/resource/list`)
        .then(
            response => {
                let resourceList = response.data
                state.resourceList = resourceList
                commit('updateResourceListInfo', {status: 'success', msg: '资源列表获取成功^v^'})   
            }
        ).catch(
            error => {
                console.error('get resourceList meta data error', error) 
                commit('updateResourceListInfo', {status: 'error', msg: '资源列表获取失败-_-|'})   
            }
        )
    },

    resourceSchemaAction: async function({commit, dispatch}, val) {
        commit('updateResourceSchemaInfo', {status: 'loading'})
        let url = urlMap.resource.resourceSchema + '/' + val.id
        await httpGet(url)
        .then(
            response => {
                let resourceSchema = response.data
                if(val.level === 2) {
                    val.children = []
                    
                    resourceSchema.forEach(ele => {
                        let thirdData = {}
                        thirdData.id = 0
                        thirdData.title = ele.name
                        thirdData.level = 3
                        thirdData.expand = true
                        thirdData.render = (h, { root, node, data }) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                },
                                on: {
                                    click: () => { this.select(thirdData) }
                                }
                            }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'cube',
                                            color: '#36ab00'
                                        },
                                        style: {
                                            marginRight: '8px'
                                        }
                                    }),
                                    h('span', data.title),       
                                ]),
                                h('span', {
                                    style: {
                                        display: 'inline-block',
                                        float: 'right',
                                        marginRight: '32px'
                                    }
                                }),
                            ])
                        }
                        val.children.push(thirdData)
                    })
                }
                commit('updateResourceSchemaInfo', {status: 'success', msg: ''})

            }
        ).catch(
            error => {
                console.error('get resourceSchema meta data error', error) 
                commit('updateResourceSchemaInfo', {status: 'error', msg: ''})

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