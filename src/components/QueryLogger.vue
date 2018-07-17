<template>
    <div class="log">
        <div style="font-size: 16px; font-weight: 900">sql:</div>
        <div style="margin-left: 20px;color: #36ab00;font-weight: 900">{{sql}}</div>
        <br>
        <div style="font-size: 16px; font-weight: 900">log信息:</div>
        <div>        
            <span style="margin-left: 20px;color: #36ab00;font-weight: 900">TASK({{id}})</span><span style="font-weight:900">{{createTime}}</span>
            <span v-if="logger.indexOf('成功') !== -1" style="color: #36ab00;font-weight: 900">{{logger}}</span>
            <span v-if="logger.indexOf('成功') == -1" style="color: red;font-weight: 900">{{logger}}</span>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { mapMutations, mapState } from 'vuex';
    export default {
        data() {
            return{
                logger: '',
                loading: true,
                createTime: '',
                durationTime: '',
                sql: '',
                id: '',
            }
        },
       
        mounted() {
            if(this.execute_status === 'success' || this.historyLog_status === 'success') {
                this.loading = false

            }
            this.dealExecuteData(this.executeList)

        },
        methods: {
            ...mapMutations('queryBox', [
            ]),
            dealExecuteData(val) {
                let index = this.curExecuteIndexAndFlag.slice(0, this.curExecuteIndexAndFlag.indexOf('_'))
                let data = val.filter(ele => 
                    index == ele.executeIndex
                    //this.curExecuteIndexAndFlag.indexOf(ele.executeIndex) !== -1   
                )

                this.logger = (data.length == 0? '任务执行中，请耐心等候...' : data[0].executeLog)
                this.createTime = (data.length == 0? '0000-00-00 00:00:00' : data[0].createTime)
                this.durationTime = (data.length == 0? '0' : data[0].durationTime)
                this.id = (data.length == 0? '' : data[0].taskId)
                if(data.length !==0){
                    this.sql = data[0].sql
                } else {
                    let element = this.preExecuteInfo.filter(ele => 
                        index == ele.index
                    )
                    this.sql = element[0].sql
                }
            }
        },
        computed: {
            ...mapState('queryBox', {
                executeList: 'executeList',
                execute_status: 'execute_status',
                preExecuteInfo: 'preExecuteInfo'
            }),
            ...mapState('execute', {
                curExecuteIndexAndFlag:'curExecuteIndexAndFlag'
            })
        },
        watch: {
            executeList(val) {
                this.dealExecuteData(val)
            },
            execute_status(val) {
                if(val === 'success') {
                    this.loading = false
                    this.dealExecuteData(this.executeList)
                }
                else {
                    this.loading = true
                }      
            },
            historyLog_status(val) {
                if(val === 'success') {
                    this.loading = false
                    this.dealExecuteData(this.executeList)
                }
                else {
                    this.loading = true
                }  
            },
            curExecuteIndexAndFlag (val) {
                //console.log('wat', val)
                this.dealExecuteData(this.executeList)
            }
        }
    }
</script>

   

<style lang="scss">
    .log {
        background: #fff;
        width: 100%;
        height: 100%;
    }
</style>
