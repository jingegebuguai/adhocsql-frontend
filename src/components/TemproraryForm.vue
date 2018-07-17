<template>
    <div>
        <el-dialog title="存为临时表" :visible.sync="formVisible">
            <el-form :model="form" :rules="rules" ref="ruleForm"  :label-position="position">
                <el-form-item label="表名" :label-width="formLabelWidth" prop="name">
                    <el-input placeholder="4~16位字母、数字或下划线，首字符为字母" v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="执行时间" :label-width="formLabelWidth">
                    <el-input disabled v-model="form.time" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="创建表SQL" :label-width="formLabelWidth"  prop="sql">
                    <el-input disabled type="textarea" v-model="form.sql"></el-input>
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

    export default {
        
        data() {

            let nameValidate = (rule, value, callback) => {
                if(!value) {
                    return callback(new Error('请输入收藏sql名称'))
                } 
                let reg = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
                if(reg.test(value) !== true) {
                    return callback(new Error('请输入4~16位字母开头,字母数字下划线组成的名称'))
                } else {
                    callback()
                }
            }
            return {
                form: {
                    name: '',
                    time: '',
                    sql: '',
                },
                formLabelWidth: '80px',
                formVisible: false,
                position: 'left',
                rules: {
                    name: [
                        {
                            validator: nameValidate, trigger: 'blur'
                        }
                    ],
                    
                }
            }
        },
        methods: {
            cancel() {
                this.formVisible = false
            },
            submit() {
                let reg = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
                if(reg.test(this.form.name) === true) {
                    this.$store.dispatch('temprorary/temporaryFormAction', this.form)
                } else {
                    this.$notify(
                        {
                            type: 'error',
                            message: '上传临时表失败！名称为空或格式不正确-_-|',
                            duration: 1500
                        }
                    )
                }
                
            },
            ...mapMutations('temprorary', [
                'updateTemproraryFormVisible'
            ])
        },
        computed: {
            ...mapState('temprorary', {
                dialogFormVisible: 'dialogFormVisible',
                curSql: 'curSql',
                executeTime: 'executeTime',
                temporaryForm_msg: 'temporaryForm_msg'
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

                this.updateTemproraryFormVisible(val)
            },
            curSql(val) {
                this.form.sql = val
            },
            executeTime(val) {
                this.form.time = val
            },
            temporaryForm_msg(val) {
                if(val == '') {
                    return
                } else {
                    this.$notify(
                        {
                            type: val.indexOf('成功') != -1? 'success':'error',
                            message: val,
                            duration: 1000
                        }
                    )
                }
                if(val.indexOf('成功') !== -1) {
                    this.$store.dispatch('temprorary/temporaryListAction')
                    this.formVisible = false
                }
            }
        }
    }
</script>

<style lang="scss">
    .el-form {
        margin: 15px 15px;

    }
    .el-textarea__inner {
        height: 200px;
    }

</style>

