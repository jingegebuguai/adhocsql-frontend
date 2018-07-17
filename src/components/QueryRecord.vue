<template>
    <div class="main-table">
        <div class="table">
            <el-table
                :data="recordList"
                size = "mini"
                border
                :empty-text="style.tableEmptyText"
                :header-cell-style="style.tableHeaderCellStyle"
                :cell-style="style.tableCellStyle"
                highlight-current-row
                height="400"
                v-loading="loading"
                :element-loading-text="loadingMsg"
                element-loading-spinner="el-icon-loading"
                :default-sort="{prop: 'id', order:'descending'}"
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
                        <!-- <el-button v-if="scope.row.status == '进行中'" @click="handleLog(scope.row)" type="text" size="small">终止任务</el-button> -->
                        <el-button v-if="scope.row.status == '成功'" @click="handleResult(scope.row)" type="text" size="small">查询结果</el-button>
                        <el-button v-if="scope.row.status == '成功' || scope.row.status == '失败' || scope.row.status == '进行中'" @click="handleLog(scope.row)" type="text" size="small">日志</el-button>
                    </template>
                </el-table-column>        
            </el-table>       
        </div> 
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
        <!-- <Spin fix v-if="spinShow">
            <Icon type="load-c" size=25 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin> -->
    </div>
</template>

<script>
    import Vue from 'vue'
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
    import {table} from '~/components/table/table'
    import {tableStyle} from '~/components/table/style'

    require('~/scss/loading.scss')

    export default {
        data() {
            return {
                
                columnNav: table.recordTable,
                style: tableStyle,
                loadingMsg: '拼命加载中...',
                //height: 400,
                sizes: [20,50,100],
                responsePageInfo: {
                    limit: 20,
                    page: 1,
                    total: 0
                },
                requestPageInfo: {limit: 10, page: 1},
                loading: true,
                recordData: []
            }
        },
        mounted() {
            this.$store.dispatch('queryRecord/executeHistoryListAction', {page_num: this.responsePageInfo.page, limit: this.responsePageInfo.limit})

        },
        methods: {
            pageSizeChange(size) {
                this.responsePageInfo.limit = size
                this.$store.dispatch('queryRecord/executeHistoryListAction', {page_num: this.responsePageInfo.page, limit: size})

            },
            currentPageChange(page) {
                this.responsePageInfo.page = page
                this.$store.dispatch('queryRecord/executeHistoryListAction', {page_num: page, limit: this.responsePageInfo.limit})
            },
            handleResult(val) {
                this.updateCurExecuteStatus(true)
                this.updateRecordEvent('result')
                this.setIsClickRecordEvent(true)
                this.updateOperatorData(val)
                //this.$store.dispatch('queryRecord/executeHistoryResultAction', val.id)
            },
            handleLog(val) {
                this.setIsClickRecordEvent(true)
                this.updateCurExecuteStatus(true)
                this.updateRecordEvent('logger')
                this.updateOperatorData(val)
            },
            ...mapMutations('execute', [
                'updateCurExecuteStatus'
            ]),
            ...mapMutations('queryRecord', [
                'updateRecordEvent', 
                'setIsClickRecordEvent',
                'updateOperatorData'
            ])
        },

        computed: {
            ...mapState('queryRecord', {
                recordList: 'recordList',
                historyList_status: 'historyList_status',
                historyList_msg: 'historyList_msg',
                row: 'row'
            })
        },

        watch: {
            historyList_status(val) {
                if(val === 'success') {
                    this.loading = false
                }
                else {
                    this.loading = true
                }
            },
            // historyList_msg(val) {
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
            recordList(val) {
                this.recordData = val.slice(
                    (this.responsePageInfo.page-1)*this.responsePageInfo.limit,
                    this.responsePageInfo.page*this.responsePageInfo.limit)
                    this.responsePageInfo.total = this.row
            }
        }
    }
</script>


<style lang="scss">
   
    .main-table {
        height: 100%;
        width: 100%;
        display: flex;
        flex: {
            direction: column;
            wrap: nowrap;
        }
        //align-content: center;
        justify-content: center;
        .table {
            flex: 1;
            .el-table{
                overflow-x: scroll;
                overflow-y: scroll;

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
