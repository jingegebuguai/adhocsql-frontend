<template>
    <div>
        <el-dialog title="收藏" :visible.sync="formVisible">
            <el-form :model="form" :rules="rules" ref="ruleForm"  :label-position="position">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="执行sql" :label-width="formLabelWidth"  prop="sql">
                    <el-input type="textarea" v-model="form.sql"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>    
</template>

<script>
    
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
    //require('~/scss/dialog.scss')
    export default {
        
        data() {
            return {
                form: {
                    name: '',
                    sql: ''
                },
                formLabelWidth: '80px',
                formVisible: false,
                position: 'left',
                rules: {
                    name: [
                        {
                            required: true, message: '请输入收藏sql名称', trigger: 'blur'
                        }
                    ],
                    sql: [
                        {
                            required: true, message: '请输入sql语句', trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            cancel() {
                this.formVisible = false
                this.setIsClickCollectEditButton(false)
            },
            submit() {
                if(this.isClickCollectEditButton === false) {
                    this.$store.dispatch('collect/collectSqlAction', this.form)
                    this.formVisible = false
                } else {
                    this.$store.dispatch('collect/modifyCollectSql', this.form)
                    this.setIsClickCollectEditButton(false)
                    this.formVisible = false

                }
            },
            ...mapMutations('collect', [
                'updateDialogFormVisible',
                'setIsClickCollectEditButton'
            ])
        },
        computed: {
            ...mapState('collect', {
                dialogFormVisible: 'dialogFormVisible',
                collect_status: 'collect_status',
                collect_msg: 'collect_msg',
                isClickCollectEditButton: 'isClickCollectEditButton',
                opreatorData: 'opreatorData',
                modifySql_status: 'modifySql_status',
                modifySql_msg: 'modifySql_msg'
            }),
            ...mapState('queryBox', {
                curQueryCodeList: 'curQueryCodeList',
            })
        },
        watch: {
            dialogFormVisible: function(val) {
                //console.log(val)
                this.formVisible = val
            },
            formVisible: function(val) {
                this.updateDialogFormVisible(val)
            },
            curQueryCodeList: function(val) {
                //console.log('val',val)
                if(this.isClickCollectEditButton !== true) {
                    this.form.sql = ''
                    this.curQueryCodeList.forEach(element => {
                        if(this.curQueryCodeList.indexOf(element) !== this.curQueryCodeList.length - 1) {
                            this.form.sql += element + ';' + '\n\n'
                        } else {
                            this.form.sql += element
                        }
                    })
                }
            },
            isClickCollectEditButton(val) {
                this.form.sql = ''
                let data = this.opreatorData.sql_content.split(';')
                data.forEach(element => {
                        if(this.curQueryCodeList.indexOf(element) !== this.curQueryCodeList.length - 1) {
                            this.form.sql += element + ';' + '\n\n'
                        } else {
                            this.form.sql += element
                    }
                })
                this.form.name = this.opreatorData.query_name
            },
            collect_msg(val) {
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
                }
            },
            
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    
    @import "./src/scss/dialog.scss";

    .el-form {
        margin: 15px 15px;
        
    }
    .el-textarea__inner {
        height: 200px;
    }

</style>

