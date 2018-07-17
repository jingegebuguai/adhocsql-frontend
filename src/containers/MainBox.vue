<template>
    <drag-zone class="mainBox"  :options="{ direction: 'vertical' }">  
        <drag-content class="query">
            <div class="query_tab" ref="queryTab">
                <el-tabs v-model="editableTabsValue" closable @tab-remove="removeTab" @tab-click="tabClick" type="card">
                    <el-tab-pane
                        :key="item.name"
                        v-for="item in editableTabs"
                        :label="item.title"
                        :name="item.name"
                    >
                    </el-tab-pane>
                </el-tabs>
            </div>
        
            <div class="code" v-if="flag === 'queryBox'">
                <codemirror ref="editorCode" v-model="code" :options="cmOption" @cursorActivity="onCursorActivity" 
                    @ready="onReady" @focus="onFocus" @input="onCodeChange"></codemirror>
            </div>
            <div class="record" v-if="flag === 'recordBox'" >
                <query-record></query-record>
            </div>
            <div>
                <collect-form></collect-form>
            </div>
            <div class="collect" v-if="flag === 'collectBox'">
                <collect-list></collect-list>
            </div>
            <div>
                <temprorary-form></temprorary-form>
            </div>
        </drag-content>
        <drag-handle   class="handle">
            <Icon type="more" size="18"></Icon>        
        </drag-handle>
        <drag-content class="execute"  v-if="executeFlag === 'execute'">
            <div class="result_tab">
                <el-tabs v-model="exectueTabsValue" closable @tab-remove="removeExecuteTab" @tab-click="executeTabClick" type="card">
                    <el-tab-pane
                        :key="item.name"
                        v-for="item in executeTabs"
                        :label="item.title"
                        :name="item.name"
                    >
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="logger" v-if="executeChoiceFlag === 'logger'"> 
                <query-logger></query-logger>
            </div>
            <div class="result"  v-if="executeChoiceFlag === 'result'">
                <query-result ></query-result>
            </div>
        </drag-content>
        <drag-content class="reference" v-if="executeFlag !== 'execute'">
            <div></div>
        </drag-content>
        
        <!--div class="collect">
        
        </div>
        <div class="list">
        
        </div>
        <div class="temprorary">
        </div> -->
    </drag-zone>
</template>

<script>
    import Vue from 'vue'
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
    import 'codemirror/mode/sql/sql.js'
    require('codemirror/addon/hint/show-hint.js')
    require('codemirror/addon/hint/show-hint.css')
    require('codemirror/addon/hint/sql-hint.js')
    require('codemirror/addon/selection/active-line.js')

    import QueryLogger from '~/components/QueryLogger.vue'
    import QueryResult from '~/components/QueryResult.vue'
    import QueryRecord from '~/components/QueryRecord.vue'
    import CollectForm from '~/components/CollectForm.vue'
    import CollectList from '~/components/CollectList.vue'
    import TemproraryForm from '~/components/TemproraryForm.vue'

    import dragZone from '~/components/common/zone.vue'
    import dragHandle from '~/components/common/handle.vue'
    import dragContent from '~/components/common/content.vue'

    
    export default {
        
        components: {
            QueryLogger,
            QueryResult,
            QueryRecord,
            CollectForm,
            CollectList,
            TemproraryForm,
            dragContent,
            dragHandle,
            dragZone
        },

        data() {
            return {
                code: '',
                initCode: '',
                cmOption: {
                    tabSize: 4,
                    styleActiveLine: false,
                    lineNumbers: true,
                    line: true,
                    extraKeys: { "Ctrl": "autocomplete" },
                    foldGutter: true,
                    styleSelectedText: true,
                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                    highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
                    mode: 'text/x-mysql',
                    mode: 'text/x-mysql',
                    dragDrop: true,
                },
                //查询框
                editableTabsValue: '',
                editableTabs: [],
                tabIndex: 0,
                flag: 'queryBox',
                //执行结果框
                exectueTabsValue: '',
                executeTabs: [],
                executeIndex: 0,
                executeFlag: '',
                executeChoiceFlag: '',

                //执行数据
                curExecuteData: {},
                //查询记录框
                // recordFlag: '',
                // recordTabsValue: '',
                // recordTabs: [],
                // recordIndex: 0,
                clickCollectFormStatus: false,
                executeObject: []
                }
        },
        methods: {
            onReady(val) {
                //console.log('ready-->', val)
            },
            onFocus(val) {
                //console.log('focus-->', val)
            },
            onCodeChange(newCode) {
                this.code = newCode
            },
            //光标选中
            onCursorActivity(val) {
                let _this = this
                let curPreCode = ''
                Vue.nextTick(function(){
                    curPreCode = _this.$refs.editorCode.editor.getSelection()
                    _this.updateCurPreQueryCode(curPreCode.trim())
                })
            },
            //移除查询框
            removeTab(targetName) {
                let tabs = this.editableTabs
                let _this = this
                let activeName = this.editableTabsValue
                if(activeName.indexOf('record') !== -1) {
                    this.updateIsHasQueryRecordBox(false)
                }
                else if(activeName.indexOf('collect') !== -1) {
                    this.updateIsHasCollectBox(false)
                }
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            this.queryListData.filter((ele) => {
                                ele.index === targetName
                            })
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                                this.queryListData.forEach(ele => {
                                    if(ele.index === activeName) {
                                        _this.code = ele.code
                                    }
                                })
                            }
                        }
                    });
                }
                this.editableTabsValue = activeName

                this.choiceFlag(activeName)

                this.editableTabs = tabs.filter(tab => tab.name !== targetName)
                this.queryListData.filter(ele => {
                    ele.index !== targetName
                })
            },
            //根据activeName选出标志
            choiceFlag(activeName) {
                let _this = this
                if(activeName.indexOf('query') !== -1) {
                    this.flag = 'queryBox'
                    this.queryListData.forEach(ele => {
                        if(ele.index + '_query'=== activeName) {
                            _this.code = ele.code
                            
                            console.log('queryListData', this.queryListData)
                        }
                    })
                    this.updateFlag('queryBox')
                }
                else if(activeName.indexOf('record') !== -1) {
                    this.flag = 'recordBox'
                    this.updateFlag('recordBox')
                }
                else if(activeName.indexOf('collect') !== -1) {
                    this.flag = 'collectBox'
                    this.updateFlag('collectBox')
                }
            },
            tabClick() {
                //console.log(this.queryListData)
                let activeName = this.editableTabsValue
                this.choiceFlag(activeName)
                
            },
            //执行选中框点击事件
            executeTabClick() {
                //console.log('click', this.exectueTabsValue)
                let activeName = this.exectueTabsValue
                let suffix = activeName.substring(activeName.indexOf('_') + 1)
                this.executeChoiceFlag = suffix
                this.updateCurExecuteIndexAndFlag(this.exectueTabsValue)

            },

            //添加查询框
            addQueryBox() {
                let newTabName = ++this.tabIndex + ''
                this.editableTabs.push ({
                    title: '查询框',
                    name: newTabName + '_query'
                })
                this.editableTabsValue = newTabName + '_query'
                this.flag = 'queryBox'
                this.updateQueryBoxStatus(false)
                
                if(this.isClickCollectQueryButton === true) {
                    this.queryListData.push ({
                        index: newTabName,
                        code: this.opreatorData.sql_content
                    })
                    this.code = this.opreatorData.sql_content
                    this.setIsClickCollectQueryButton(false)
                } else {
                    this.queryListData.push ({
                        index: newTabName,
                        code: this.initCode
                    })
                    this.code = this.initCode
                }
                this.editableTabsValue = newTabName + '_query'
                this.updateFlag('queryBox')
            },
            //添加查询结果框
            addLoggerAndResultBox(newExecuteTabName) {
                if(this.recordEvent == 'result' && this.isClickRecordEvent === true) {
                    this.executeTabs.push (
                        {
                            title: '查询结果#' + this.executeIndex,
                            name: newExecuteTabName + '_result'
                        }
                    )
                } else if(this.recordEvent == 'logger' && this.isClickRecordEvent === true) {
                    this.executeTabs.push (
                        {
                            title: '日志#' + this.executeIndex,
                            name: newExecuteTabName + '_logger'
                        }
                    )
                } else {
                    this.executeTabs.push (
                        {
                            title: '日志#' + this.executeIndex,
                            name: newExecuteTabName + '_logger'
                        },{
                            title: '查询结果#' + this.executeIndex,
                            name: newExecuteTabName + '_result'
                        }
                    )
                }
                
     
            },  
            //移除执行框
            removeExecuteTab(targetName) {
                let tabs = this.executeTabs
                let _this = this
                let activeName = this.exectueTabsValue;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name
                            }
                        }
                    });
                }
                this.exectueTabsValue = activeName
                let suffix = activeName.substring(activeName.indexOf('_') + 1)
                this.executeChoiceFlag = suffix
                this.executeTabs = tabs.filter(tab => tab.name !== targetName)
                if(this.executeTabs.length == 0) {
                    this.executeFlag = ''
                }
                this.updateCurExecuteIndexAndFlag(this.exectueTabsValue)
            },
            //添加/跳转查询记录框
            addQueryRecordBox() {
                let newTabName = ++this.tabIndex + ''
                this.editableTabs.push ({
                    title: '查询记录',
                    name: newTabName + '_record'
                })
                this.editableTabsValue = newTabName + '_record'
                this.flag = 'recordBox'
                this.updateQueryRecordStatus(false)
                this.updateFlag('recordBox')
            },
            addCollectListBox() {
                let newTabName = ++this.tabIndex + ''
                this.editableTabs.push ({
                    title: '收藏列表',
                    name: newTabName + '_collect'
                })
                this.editableTabsValue = newTabName + '_collect'
                this.flag = 'collectBox'
                this.updateCollectListStatus(false)
                this.updateFlag('collectBox')
            },
            //执行初始化框
            initExecute(val) {
                let newExecuteTabName = ++this.executeIndex + ''

                this.addLoggerAndResultBox(newExecuteTabName)
                
                
                this.flag = 'queryBox'
                this.updateCurExecuteStatus(false)
                this.exectueTabsValue = newExecuteTabName + '_result'

                this.executeFlag = 'execute'
                this.executeChoiceFlag = 'result'
                this.$store.dispatch('queryBox/executeAction', {multiStatus: false, sql: val, index: this.executeIndex})
            
                
            },
            ...mapMutations('queryBox', [
                'updateQueryBoxStatus',
                'updateCurQueryCodeList',
                'updateQueryListData',
                'updateCurPreQueryCode',
                'updateExecuteList',
                'updateIsQuerySuccess'
            ]),
            ...mapMutations('execute', [
                'updateCurExecuteStatus',
                'updateAllExecuteStatus',
                'updateCurExecuteIndexAndFlag'
            ]),
            ...mapMutations('queryRecord', [
                'updateQueryRecordStatus',
                'setIsClickRecordEvent',
                'updateIsHasQueryRecordBox'
            ]),
            ...mapMutations('common', [
                'updateFlag'
            ]),
            ...mapMutations('collect', [
                'updateDialogFormVisible',
                'updateCollectListStatus',
                'setIsClickCollectQueryButton',
                'setIsClickCollectQueryButton',
                'updateIsHasCollectBox'
            ]),
            ...mapMutations('temprorary', [
                'updateTemproraryListStatus'
            ]),
            ...mapMutations('resource', [
                'updateResourceTitle'
            ])

        },
        computed: {
            hasHandle() {
                return this.flag = 'queryBox'? false : true
            },
            codemirror() {
                console.log('mirror-->',this.$refs.editorCode.codemirror)
            },
            ...mapState('queryBox', {
                isClickQueryBox: 'isClickQueryBox',
                curQueryCodeList: 'curQueryCodeList',
                queryListData: 'queryListData',
                executeList: 'executeList',
                curPreQueryCode: 'curPreQueryCode',
                isQuerySuccess: 'isQuerySuccess',
            }), 
            ...mapState('execute', {
                isClickCurExecute: 'isClickCurExecute',
                isClickAllExecute: 'isClickAllExecute',
                
            }),
            ...mapState('queryRecord', {
                isClickQueryRecordBox: 'isClickQueryRecordBox',
                isClickCollectQueryButton: 'isClickCollectQueryButton',
                recordEvent: 'recordEvent',
                isClickRecordEvent: 'isClickRecordEvent',
                operatorData: 'operatorData',
                isHasQueryRecordBox: 'isHasQueryRecordBox'
            }),
            ...mapState('common', {
                commonFlag: 'flag'
            }),
            ...mapState('collect', {
                dialogFormVisible: 'dialogFormVisible',
                isClickCollectList: 'isClickCollectList',
                isClickCollectQueryButton: 'isClickCollectQueryButton',
                opreatorData: 'opreatorData',
                isHasCollectBox: 'isHasCollectBox'
            }),
            ...mapState('temprorary', {
                isClickTemproraryList: 'isClickTemproraryList'
            }),
            ...mapState('resource', {
                resourceTitle: 'resourceTitle',
                isClickResource: 'isClickResource'
            }) 
        },
        mounted() {
            //默认页是否初始化一个输入框
            //console.log(this.isClickQueryBox)
            this.addQueryBox()
            //console.log(this.resourceTitle)
        },
        watch: {
            isQuerySuccess(val) {
                if(val == false) {
                    this.exectueTabsValue = this.executeIndex + '_logger'
                    this.executeFlag = 'execute'
                    this.executeChoiceFlag = 'logger'
                    this.updateIsQuerySuccess(true)
                }
            },

            isClickQueryBox: function(val) {
                //console.log('val-->', val)
                if(val == true) {
                    this.addQueryBox()
                }
            },
            //收藏列表查询按钮
            isClickCollectQueryButton: function(val) {
                if(val == true) {
                    this.addQueryBox()
                }
            },
            isClickAllExecute(val) {
                if(val == true && this.curQueryCodeList.length != 0) {
                    //console.log(this.curQueryCodeList)
                    this.updateCurExecuteStatus(true)
                    let _this = this
                    this.curQueryCodeList.forEach(sql => {
                        //console.log('sql', sql)
                        this.initExecute(sql)
                    })
                    this.updateCurExecuteIndexAndFlag(this.exectueTabsValue)
                }
                this.updateAllExecuteStatus(false)
            },
            isClickCurExecute: function(val) {
                //初始化全部执行的tabs，index
                if(val === true && this.isClickRecordEvent === false) {
                    this.initExecute(this.curPreQueryCode)
                }
                this.updateCurExecuteIndexAndFlag(this.exectueTabsValue)
            },
            isClickQueryRecordBox: function(val) {
                if(val == true && this.isHasQueryRecordBox == false) {
                    this.addQueryRecordBox()
                    this.updateIsHasQueryRecordBox(true)
                }else if(val == true && this.isHasQueryRecordBox == true) {
                    this.editableTabs.forEach(ele => {
                        if(ele.name.indexOf('record') !== -1) {
                            this.updateQueryRecordStatus(false)
                            this.editableTabsValue = ele.name
                            this.flag = 'recordBox'
                            this.updateFlag('recordBox')
                        }
                    })
                }
                //this.$store.dispatch('queryRecord/executeHistoryListAction')
            },
            isClickCollectList: function(val) {
                if(val == true && this.isHasCollectBox == false) {
                    this.addCollectListBox()
                    this.updateIsHasCollectBox(true)
                } else if(val == true && this.isHasCollectBox == true) {
                    this.editableTabs.forEach(ele => {
                        if(ele.name.indexOf('collect') !== -1) {
                            this.updateCollectListStatus(false)
                            this.editableTabsValue = ele.name
                            this.flag = 'collectBox'
                            this.updateFlag('collectBox')
                        }
                    })
                }
            },
            code: function(val) {
                    let activeName = this.editableTabsValue
                    this.queryListData.map(ele => {
                        if(activeName === ele.index + '_query') {
                            ele.code = val
                    }
                    let codeList = []
                    val.split(';').forEach(data => {
                        
                        if(data.trim().length >= 1) {
                            codeList.push(data.trim())
                        }
                    })
                    //console.log(codeList)
                    this.updateCurQueryCodeList(codeList)
                    // let _this = this
                    // Vue.nextTick(function(){
                    //     console.log(_this.$refs.editorCode)
                    // })
                })
       
            },

            isClickResource: function(val) {
                if(val === true) {
                    this.code = this.code + ' ' + this.resourceTitle
                }
                this.updateResourceTitle({title:this.resourceTitle, click:false})
            },
            
            

            isClickRecordEvent(val) {
                if(val === true && this.isClickCurExecute === true) {
                    let newExecuteTabName = ++this.executeIndex + ''
                    this.addLoggerAndResultBox(newExecuteTabName)
            
                    this.updateCurExecuteStatus(false)
                    this.setIsClickRecordEvent(false)
                    if(this.recordEvent === 'result') {
                        this.exectueTabsValue = newExecuteTabName + '_result'
                        this.executeFlag = 'execute'
                        this.executeChoiceFlag = 'result'
                        //console.log(this.operatorData)
                        this.$store.dispatch('queryRecord/executeHistoryResultAction', {index: this.executeIndex, sql: this.operatorData.sql_content, id: this.operatorData.id, create_time: this.operatorData.create_time})
                    }
                    if(this.recordEvent === 'logger') {
                        this.exectueTabsValue = newExecuteTabName + '_logger'
                        this.executeFlag = 'execute'
                        this.executeChoiceFlag = 'logger'
                        this.$store.dispatch('queryRecord/executeHistoryLogAction', {index: this.executeIndex, sql: this.operatorData.sql_content, id: this.operatorData.id, create_time: this.operatorData.create_time})

                    }
                    this.updateCurExecuteIndexAndFlag(this.exectueTabsValue)

                }

            },
            // isClickCollectQueryButton(val) {
            //     if(val == true) { 
            //         this.addQueryBox()
            //     }
            // }
            
        }
    }
</script>

<style lang="scss">

    $theme_color: #36ab00;

    @mixin tabScss {
        background: #fff;
        .el-tabs__header {
            margin: 0;
        }
        .el-tabs__nav-next, .el-tabs__nav-prev {
            line-height: 30px;
        }
        .el-tabs__item {
            padding: 0;
            text-align: center;
            width: 120px;
            height: 30px;
            line-height: 30px;
        }
        .el-tabs--border-card > .el-tabs__content {
            padding: 0;
        }
        .el-tabs--card > .el-tabs__header .el-tabs__nav {
            height: 30px;
            border: {
                width: 1px; 
                style: solid;
                color: $theme_color;
                bottom: none;
                left: none;
            }
        }
        .el-tabs--card > .el-tabs__header .el-tabs__item {
            border-left: 1px solid $theme_color;
        }
        .el-tabs--card > .el-tabs__header .el-tabs__item.is-active.is-closable {
            background: #f3faf3;
        }
    }

    @mixin flexScss {
        display: flex;
        flex: {
            direction: column;
            wrap: nowrap; 
        }
        justify-content: flex-start;
    }

    .drag-zone .mainBox {
        margin: 0 auto;
        position: relative;
        // clear: both;
        // overflow: hidden;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        width: 100%;
        height: 100%;
        
        .query {
            width: 100%;
            height: 35%;
            @include flexScss;
            .query_tab {
                height: 30px;
                @include tabScss;
            }
            .code, .record, .collect {
                height: 100%;
                width: 100%;
                border: 1px solid $theme_color;
                padding: 1%;
            }
            .code {
                .CodeMirror {
                    height: 100%;
                    .CodeMirror-scroll {
                        height: 100%;
                        padding-bottom: 0px;
                        //overflow:inherit;
                    }
                    .CodeMirror-scroll, .CodeMirror-sizer, .CodeMirror-linenumber {
                        //background: #f3faf3;
                        background: #fff;
                    }
                    .CodeMirror-gutters {
                        background-color: #e9e9e9;
                    }
                    .CodeMirrir-activeline-background {
                        background: #f0f;
                    }
                    .CodeMirror-selected{
                        //background: $theme_color;
                        background: #9fd19f		;
                    }
                    .CodeMirrir-focued .CodeMirror-selected {
                        background: $theme_color;
                    }
                    .CodeMirror-line > span > span::-moz-selection {
                        background: $theme_color;
                    }
                    .CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection { 
                        background: $theme_color; 
                    }
                    .CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection { 
                        background: $theme_color; 
                    }

                }      
               
            }
        }
        .handle {
            margin: {
                top: 30px;
                left: 50%;
                bottom: 10px;
            }
        }
        .hasHandle {
            margin-top: 40px;
        }
        .execute {
            //height: 50%;
            flex: 1;
            width: 100%;
            min-height: 10%;
            @include flexScss;
            .result_tab {
                //height: 30px;
                @include tabScss;
            }
            .result {
                width: 100%;
                .el-table:before{
                    height: 0;
                }
            }
            .logger {
                //width: calc(100%+30px);
                width: 100%;
            }
            .result, .logger{
                width: 100%;
                height: 90%;
                border: 1px solid $theme_color;
                padding: 1%;
                clear: both;
            }
        }
        .reference {
            margin-top: 30px;
            height: 50%;
            background: #f4f4f4;
            clear: both;
            overflow: hidden;
        }
    }
</style>
