<template>
    <div class="main-table">
        <div class="table">
            <el-table
                :data="collectData"
                size = "mini"
                border
                :empty-text="style.tableEmptyText"
                :header-cell-style="style.tableHeaderCellStyle"
                :cell-style="style.tableCellStyle"
                highlight-current-row
                :height="400"
                v-loading="loading"
                :element-loading-text="loadingMsg"
                element-loading-spinner="el-icon-loading"
                :default-sort="{prop: 'id', order:'ascending'}"
                >
                <el-table-column v-for="col in columnNav"
                                        :prop="col.prop"
                                        :label="col.label"
                                        :width="col.width"
                                        show-overflow-tooltip
                                        :align="col.align"
                                        :key="col.prop"
                                        :sortable="col.sortable">
                        </el-table-column>
                <el-table-column label="操作"  fixed="right" align="center">
                     <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查询</el-button>
                        <el-button @click="editSql(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="deleteSql(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>        
            </el-table>        
            <div class="buttom">
                <div class="table-buttom">
                    <div class="table-buttom-left">
                        每页显示 {{responsePageInfo.limit}} 条
                    </div>
                    <div class="table-buttom-right">
                        <el-pagination @size-change="pageSizeChange"
                                    @current-change="currentPageChange"
                                    background
                                    layout="total, sizes, prev, pager, next,jumper"
                                    :current-page=responsePageInfo.page
                                    :page-size=responsePageInfo.limit
                                    :page-sizes="sizes"
                                    :total=responsePageInfo.total>
                        </el-pagination>
                    </div>
                </div>
                <!-- <div class="attention">
                        <span>注: 默认最多显示5000条查询结果</span>
                </div> -->
            </div>
        </div>
    </div>    
</template>

<script>
    import Vue from 'vue'
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
    import {table} from '~/components/table/table'
    import {tableStyle} from '~/components/table/style'

    export default {
        data() {
            return {
                list: [
                    {
                        name: 'sql',
                        id: 1,
                        sql: 'sql',
                        time: 0
                    }
                ],
                columnNav: table.collectTable,
                style: tableStyle,
                loadingMsg: '拼命加载中...',
                height: 400,
                sizes: [20,50,100],
                responsePageInfo: {
                    limit: 20,
                    page: 1,
                    total: 0
                },
                requestPageInfo: {limit: 10, page: 1},
                loading: true,
                collectData: []
            }
        },
        methods: {
            pageSizeChange(size) {
                this.responsePageInfo.limit = size
                this.$store.dispatch('collect/collectListAction', {page: this.responsePageInfo.page, limit: size})
            },
            currentPageChange(page) {
                this.responsePageInfo.page = page
                this.$store.dispatch('collect/collectListAction', {page: page, limit: this.responsePageInfo.limit})
            },
            handleClick(val) {
                this.updateQueryBoxStatus(true)
                this.updateOperateData(val)
                this.setIsClickCollectQueryButton(true)
            },
            editSql(val) {
                this.updateOperateData(val)
                this.setIsClickCollectEditButton(true)
                this.updateDialogFormVisible(true)
            },
            deleteSql(val) {
                this.updateOperateData(val)
                this.$confirm('此操作将删除收藏的sql, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                    }).then(() => {
                        this.$store.dispatch('collect/deleteCollectSql', val)
                    }).catch(() => {
                        this.$message({
                        type: 'info',
                        message: '已取消导出'
                    });
                });
            },

            ...mapMutations('collect', [
                'updateDialogFormVisible',
                'updateOperateData',
                'setIsClickCollectQueryButton',
                'setIsClickCollectEditButton',

            ]),
            ...mapMutations('queryBox', [
                'updateQueryBoxStatus',
            ]),        
        },
        mounted() {
            let val = this.requestPageInfo
            this.$store.dispatch('collect/collectListAction', {page: this.responsePageInfo.page, limit: this.responsePageInfo.limit})
        },
        computed: {
            ...mapState('collect', {
                collectList_status: 'collectList_status',
                collectList_msg: 'collectList_msg',
                collectList: 'collectList',
                deleteSql_status: 'deleteSql_status',
                deleteSql_msg: 'deleteSql_msg',
                modifySql_status: 'modifySql_status',
                modifySql_msg: 'modifySql_msg',
                row: 'row'
            })
        },

        watch: {
            collectList(val) {
                this.collectData = val.slice(
                    (this.responsePageInfo.page-1)*this.responsePageInfo.limit,
                    this.responsePageInfo.page*this.responsePageInfo.limit)
                    this.responsePageInfo.total = this.row
            },
            collectList_status(val) {
                if(val === 'success') {
                    this.loading = false
                }
                else {
                    this.loading = true
                }
            },
            // collectList_msg(val) {
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
            deleteSql_msg(val) {
                if(val == '') {
                    return
                } else {
                    this.$notify(
                        {
                            type: val.indexOf('成功') != -1? 'success':'error',
                            message: val,
                            duration: 500
                        }
                    )
                    if(val.indexOf('成功') != -1) {
                        this.$store.dispatch('collect/collectListAction', {page: this.responsePageInfo.page, limit: this.responsePageInfo.limit})
                    }                    
                }
            },
            modifySql_msg(val) {
                if(val == '') {
                    return
                } else {
                    this.$notify(
                        {
                            type: val.indexOf('成功') != -1? 'success':'error',
                            message: val,
                            duration: 500
                        }
                    )
                    if(val.indexOf('成功') != -1) {
                        this.$store.dispatch('collect/collectListAction', {page: this.responsePageInfo.page, limit: this.responsePageInfo.limit})
                    }
                    
                }
            }
        }

    }
</script>


<style lang="scss">
    .main-table {
        height: 100%;
        display: flex;
        flex: {
            direction: column;
            wrap: nowrap;
        }
        align-content: center;
        justify-content: center;
        .table {
            flex: 1;
            .el-table{
            }
        }
        .buttom {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            align-items: center;
            .table-buttom {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .table-buttom-left {
                    line-height: 10px;
                    font-size: 13px;
                }
                .table-buttom-right {

                }
                .attention {
                    font: {
                        size: 12px;
                        bold: 100;
                    }
                }
            }
        }
    }
</style>
