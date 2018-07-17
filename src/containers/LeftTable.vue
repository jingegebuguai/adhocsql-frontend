<template>
    <div class="table">
        <div class="guide">
            <div class="resource-font">资源</div>
            <div class="book"><a target="_blank" href="http://wiki.qiyi.domain/pages/viewpage.action?pageId=168402534">用户手册</a></div>
        </div>
        <div class="tab">
            <el-tabs v-model="choiceName" @tab-click="handleClick" type="border-card">
                <el-tab-pane  label="资源列表" name="resource"></el-tab-pane>
                <el-tab-pane  label="临时表" name="temprorary"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="search">
            <el-input type="primary" prefix-icon="el-icon-search" placeholder="请输入表名查找" v-model="search" clearable></el-input>
        </div>
        
        <div class="tree" v-if="choiceName == 'resource'">
            <Tree :data="resourceData" :empty-text="message" ref="tree" @on-toggle-expand="toggleExpand"></Tree>
        </div>
        <div class="tempropary" v-if="choiceName == 'temprorary'">
            
            <div v-for="item in tempList" class="item">
                <el-popover
                    placement="right"
                    width="400"
                    trigger="hover">
                    <el-form label-position="right" label-width="80px" :model="value">
                        <el-form-item label="表名">
                            <el-input disabled v-model="item.table_name"></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <el-input disabled v-model="item.create_time"></el-input>
                        </el-form-item>
                        <el-form-item label="过期时间">
                            <el-input disabled v-model="item.expire_time"></el-input>
                        </el-form-item>
                        <el-form-item label="创建表sql">
                            <el-input disabled type="textarea" v-model="item.sql_content"></el-input>
                        </el-form-item>

                    </el-form>
                    
                    <div class="reference" slot="reference">
                        <div class="grid_table">
                            <div class="grid_icon"><Icon type="ios-grid-view"></Icon></div>
                            <div class="table_name">{{item.table_name}}</div>
                        </div>
                        <div @click="deleteTable(item.id)"><Icon type="ios-trash" ></Icon> </div>              
                    </div>
                </el-popover>
            </div>

        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { mapState, mapMutations } from 'vuex';
    //import Icon from 'vue-awesome/components/Icon'

    export default {

        // components: {
        //     Icon
        // },

        data() {
            return {
                choiceName: 'resource',
                search: '',
                message: '',
                resourceData: [],
                tempList: [],
                value: {
                    tableName: '',
                    createTime: '',
                    guoqiTime: '',
                    sql: ''
                },
                
                
            }
        },
        methods: {
            handleClick(tab, event) {
                if(this.choiceName == 'temprorary') {
                    this.$store.dispatch('temprorary/temporaryListAction')
                }
            },

            toggleExpand(val) {
                if(val.level === 2) {
                    this.$store.dispatch('resource/resourceSchemaAction', val)
                }
            },

            select (data) {
                this.updateResourceTitle({title: data.title, click: true})
                
            },

            //删除临时表
            deleteTable(val) {
                this.$confirm('此操作将删除临时表, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                    }).then(() => {
                        this.$store.dispatch('temprorary/deleteTemproraryAction', val)
                    }).catch(() => {
                        this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            
            //将list原始数据进行处理，转化为树形控件数据
            dealResource(val, bool) {
                 //处理数据 
                let _this = this
                _this.resourceData = []
                val.forEach(ele => {
                    //第一级数据
                    let resource = {}
                    resource.id = 0
                    resource.title = ele.db_name
                    resource.level = 1
                    resource.expand = (bool == true? true:false)
                    resource.render = (h, { root, node, data }) => {
                        return h('span', {
                            style: {
                                display: 'inline-block',
                                width: '100%'
                            },
                            on: {
                                //click: () => { this.select(resource) }
                            }
                        }, [
                            h('span', [
                                h('Icon', {
                                    props: {
                                        type: 'soup-can',
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
                    },
                    resource.children = []
                    ele.table_infos.forEach(data => {
                        //第二级数据
                        let childrenData = {}
                        childrenData.title = data.table_name
                        childrenData.id = data.id
                        childrenData.level = 2
                        childrenData.expand = false
                        childrenData.children = [{}]
                        childrenData.render = (h, { root, node, data }) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                },
                                on: {
                                    click: () => { this.select(childrenData) }
                                }
                            }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-grid-view',
                                            color: '#36ab00'
                                        },
                                        style: {
                                            marginRight: '8px'
                                        }
                                    }),
                                    h('span', data.title)
                                ]),
                                h('span', {
                                    style: {
                                        display: 'inline-block',
                                        float: 'right',
                                        marginRight: '32px'
                                    }
                                })
                            ]);
                        },
                        resource.children.push(childrenData)
                    })
                    _this.resourceData.push(resource)
                })
                
            },

            ...mapMutations('resource', [
                'updateResourceTitle'
            ])
         
            
        },
        mounted() {
            this.$store.dispatch('resource/resourceListAction')
            this.$store.dispatch('temprorary/temporaryListAction')
        },  
        watch: {
            choiceName(val) {
            },
            
            //过滤resourceList
            search(val) {
                //过滤resourceList
                if(this.choiceName == 'resource') {
                    let tempResource = []
                    this.resourceList.forEach(ele => {
                        let tempTable = []
                        if(ele.table_infos !== null) {
                            tempTable = ele.table_infos.filter(data => 
                                data.table_name.toUpperCase().indexOf(val.toUpperCase()) !== -1
                            )
                        }
                        if(tempTable.length !== 0 || (tempTable.length == 0 && ele.db_name !== null && ele.db_name.indexOf(val) !== -1)) {
                            let contrus = {}
                            contrus.db = ele.db
                            contrus.db_name = ele.db_name
                            contrus.table_infos = tempTable
                            tempResource.push(contrus)
                        }
                    })
                    this.dealResource(tempResource, true)
                } 
                //过滤临时表
                else if(this.choiceName == 'temprorary') {
                    this.tempList = this.temporaryList.filter(ele => 
                        ele.table_name.indexOf(val) !== -1
                    )
                }
            },
            resourceList(val) {
                //处理数据
                this.dealResource(val, false)
                
            },
            // temporaryList_msg(val) {
            //     if(val == '') {
            //         return
            //     } else {
            //         this.$notify(
            //             {
            //                 type: val.indexOf('成功') != -1? 'success':'error',
            //                 message: val,
            //                 duration: 500
            //             }
            //         )
            //     }
            // },
            temporaryDel_msg(val) {
                if(val == '') {
                    return
                } else {
                    // this.$notify(
                    //     {
                    //         type: val.indexOf('成功') != -1? 'success':'error',
                    //         message: val,
                    //         duration: 500
                    //     }
                    // )
                    if(val.indexOf('成功') != -1) {
                        this.$store.dispatch('temprorary/temporaryListAction')
                    }
                }
                
            },
            temporaryList(val) {
                this.tempList = val
            }

        },
        computed: {
            ...mapState('resource', {
                resourceList: 'resourceList',
                preResource: 'preResource',
                resourceTitle: 'resourceTitle',
                isClickResource: 'isClickResource'
            }),
            ...mapState('temprorary', {
                temporaryList_msg: 'temporaryList_msg',
                temporaryList: 'temporaryList',
                temporaryDel_status: 'temporaryDel_status',
                temporaryDel_msg: 'temporaryDel_msg'
            })   
        }

}
</script>

<style lang="scss" rel="stylesheet/scss">

    @import './src/scss/table.scss';

    $theme_color: #36ab00;
    $back_color: #f3faf3;

    .table {
        width: 100%;
        max-height: 100%;
        display: flex;
        flex: {
            direction: column;
            wrap: nowrap; 
        }
        justify-content: flex-start;
        .guide {
            width: 100%;
            background: white;
            height: 40px;
            line-height: 40px;
            .resource-font {
                //width: 50%;
                float: left;
                //text-align: center;
                margin-left: 5%;
                font: {
                    weight: 900;
                    size: 16px;
                }
                //margin-left: 10%;
            }
            .book {
                width: 50%;
                float: right;
                font-weight: 900;
                text-align: center;
                a {
                    color: $theme_color;
                }
            }
        }
        .tab {
            box-sizing: content-box;
            width: 100%;
            height: 40px;
            .el-tabs {
                width: 100%;
                height: 100%;
            }
            .el-tabs__header {
                height: 100%;
            }
            .el-tabs__nav-scroll {
                height: 40px;
            }
            .el-tabs__nav {
                width: 100%;
                height: 100%;
            }
            .el-tabs__item {
                padding: 0;
                text-align: center;
                display: block;
                float: left;
                width: 50%;
                height: 39px;
                line-height: 39px;
            }
            
            .el-tabs--border-card > .el-tabs__content {
                padding: 0;
            }
        }
        .search {
            height: 40px;
            margin: 15px 15px;
            .el-input {
                height: 40px;
                display: block;
                .el-input__inner {
                    display: block;
                    border-bottom: 2px solid #dbdbdb;  
                    border-radius: 0;
                    border-top: 0;  
                    border-left: 0;  
                    border-right: 0; 
                }
                .el-input__icon {
                    display: block;
                }
            }
        }
        .tree {
            background: #fff;
            height: 100%;
            overflow-y: scroll;
            overflow-x: hidden;
            margin: 0 15px 15px;        
            padding: 0 15px;
            .ivu-tree ul {
                font-size: 16px;
            }
        }
        
        .tempropary {
            height: 100%;
            background: $back_color;
            margin: 5px 15px 15px;
            padding: 0 5px;
            overflow-y: scroll;
            .item {
                .reference {
                    display: flex;
                    flex: {
                        direction: row;
                        wrap: nowrap;
                    }
                    align-items: center;
                    justify-content: space-between;
                    overflow: hidden;
                    clear: both;
                    .grid_table {
                        display: inline;
                        .grid_icon {
                            float: left;
                        }
                        .table_name {
                            margin-left: 20px;
                            overflow: hidden;
                        }                
                    }
                    font: {
                        size: 16px;
                        weight: 500;
                    }
                    border: 1px solid #36ab00;
                    border-radius: 5px;
                    margin-bottom: 5px;
                    padding: 0 10px;
                    .ivu-icon {
                        color: #36ab00;
                    }
                    .ivu-icon-ios-trash {
                        cursor:  pointer;
                    }
                }
                
            }
        }
        
    }
    

</style>
