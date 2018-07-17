<template>
    <div class="main-result-table">
        <div class="resultTop">
            <div class="task">任务ID:{{taskId}}</div>
            <div class="download" >            
                <div @click="uploadSql" class="upload"><Icon size="15" color="#36ab00" type="android-upload" ></Icon>上传为临时表</div>
                <span style="margin: 0 10px">|</span>
                <div @click="downloadExcel" class="download"><Icon size="15" color="#36ab00" type="android-download" ></Icon>导出excel</div>
            </div>
        </div>
        <div class="table">
            <el-table
                :data="curResult"
                size = "mini"
                border
                :empty-text="style.tableEmptyText"
                :header-cell-style="style.tableHeaderCellStyle"
                :cell-style="style.tableCellStyle"
                highlight-current-row
                v-loading="loading"
                :element-loading-text="loadingMsg"
                element-loading-spinner="el-icon-loading"
                :default-sort="{prop: 'id', order:'ascending'}"
                >
                <el-table-column v-for="col in columnNav"
                                        :label="col.label"
                                        :width="col.width"
                                        show-overflow-tooltip
                                        :align="col.align"
                                        :key="col.prop"
                                        :sortable="col.sortable">
                <template slot-scope="scope">
                    <span style="margin-left: 10px" v-if="scope.row[col.prop]">{{scope.row[col.prop] }}</span>
                    <span style="margin-left: 10px" v-if="scope.row[col.prop] == null">NULL</span>

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
            <div class="attention">
                    <span>注: 默认最多显示及导出10000条数据</span>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
    import {testTable} from '~/components/table/table'
    import {tableStyle} from '~/components/table/style'
    import {urlMap} from '~/url'


    export default {
        data() {
            return {
                taskId: 0,
                list: [],
                columnNav: [],
                style: tableStyle,
                loadingMsg: '拼命加载中...',
                sizes: [20,50,100],
                responsePageInfo: {
                    limit: 20,
                    page: 1,
                    total: 0
                },
                loading: true,
                executeResult: [],
                curResult: [],

            }
        },
        // props: {
        //     curExecuteData: {
        //         type: Object,
        //         required: true
        //     }
        // },
        methods: {
            pageSizeChange(size) {
                this.responsePageInfo.limit = size
                this.curResult = this.executeResult.slice(
                    (this.responsePageInfo.page-1)*this.responsePageInfo.limit,
                    this.responsePageInfo.page*this.responsePageInfo.limit)
            },
            currentPageChange(page) {
                this.responsePageInfo.page = page
                this.curResult = this.executeResult.slice(
                    (page-1)*this.responsePageInfo.limit, 
                    page*this.responsePageInfo.limit)       
            },
            downloadExcel() {

                this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                    }).then(() => {
                        //console.log('url', urlMap.baseUrl + urlMap.record.exportSql + this.operatorData.id)
                        location.href = urlMap.record.exportSql + '/' + this.taskId
                    }).catch(() => {
                        this.$message({
                        type: 'info',
                        message: '已取消导出'
                    });
                });    
            },
            uploadSql() {
                this.updateTemproraryFormVisible(true)
            },
            //处理执行结果
            dealExecuteData(val) {
                //this.loading = false
                let index = this.curExecuteIndexAndFlag.slice(0, this.curExecuteIndexAndFlag.indexOf('_'))
                let data = val.filter(ele => 
                    index == ele.executeIndex
                )
                if(data.length !== 0) {
                    this.loading = false
                    this.columnNav = []
                    this.taskId = data[0].taskId
                    this.loading = (this.taskId == 0? true:false)
                    this.updateCurSql(data[0].sql)
                    this.updateExecuteTime(data[0].createTime)
                    if(data[0].tableColumn.length !== 0) {
                        //分页
                        this.executeResult = data[0].executeResult
                        this.curResult = data[0].executeResult.slice(
                            (this.responsePageInfo.page-1)*this.responsePageInfo.limit,
                            this.responsePageInfo.page*this.responsePageInfo.limit)
                            this.responsePageInfo.total = data[0].executeResult.length

                        data[0].tableColumn.forEach((ele, index) => {
                            let column = {}
                            column.prop = ele
                            column.label = data[0].label[index]
                            column.align = 'center'
                            this.columnNav.push(column)
                        });
                        data[0]
                    } else {
                        this.columnNav = []
                    }
                } else {
                    this.columnNav = []
                    this.taskId = 0
                }
            },
            ...mapMutations('temprorary', [
                'updateTemproraryFormVisible',
                'updateCurSql',
                'updateExecuteTime'
            ]),
            ...mapMutations('execute', [
                'updateExecutedSqlList'
            ])        
        },
        computed: {
            ...mapState('queryRecord', {
                operatorData: 'operatorData'
            }),
            ...mapState('execute', {
                curExecuteIndexAndFlag: 'curExecuteIndexAndFlag',
                executedSqlList: 'executedSqlList'
            }),
            ...mapState('queryBox', {
                execute_status: 'execute_status',
                executeList: 'executeList',
                preExecuteInfo: 'preExecuteInfo'
            }),
            ...mapState('temprorary', {
                temporaryForm_msg: 'temporaryForm_msg',
                temporaryForm_status: 'temporaryForm_status'
            }),
            ...mapState('queryRecord', {
                historyResult_status: 'historyResult_status'
            })
        },
        mounted() {
            this.loading = true
            if(this.execute_status === 'success' || this.historyResult_status === 'success') {
                //this.loading = false

            }
            this.dealExecuteData(this.executeList)

        },
        watch: {
            preExecuteInfo(val) {
                this.loading = true
            },
            executeList(val) {
                this.dealExecuteData(val)
            },
            execute_status(val) {
                if(val === 'success' || val === 'error') {
                    this.loading = false
                    this.dealExecuteData(this.executeList)
                }
                else {
                    this.loading = true
                }      
            },
            historyResult_status(val) {
                if(val === 'success' || val === 'error') {
                    this.loading = false
                    this.dealExecuteData(this.executeList)
                }
                else {
                    this.loading = true
                }   
            },
            curExecuteIndexAndFlag(val) {
                this.dealExecuteData(this.executeList)
            }
        }
    }
</script>


<style lang="scss">
    .main-result-table {
        height: 100%;
        width: 100%;
        display: flex;
        flex: {
            direction: column;
            wrap: nowrap;
        }
        justify-content: flex-start;
        align-content: center;
        .resultTop {
            display: flex;
            flex: {
                direction: row;
                wrap: nowrap;
            }
            justify-content: space-between;
            align-content: center;
            margin-bottom: 1%;
            font: {
                size: 12px;
                bold: 100;
            }
            .download {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                cursor: pointer;
                .ivu-icon {
                    margin-right: 5px;
                }
            }
        }
        .table {
            //flex: 1;
            height: 100%;
            width: 100%;
            .el-table {
                height: 100%;
                width: 100%;
                overflow: scroll;
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
