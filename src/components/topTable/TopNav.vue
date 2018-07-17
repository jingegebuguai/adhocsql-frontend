<template>
    <div class="top" >
        <Menu :default-active="$route.path" :mode="mode" :theme="theme" @on-select="onSelect" active-name="1">
            <MenuItem name="query" index="/query-box">
                <Icon type="ios-plus-outline"></Icon>                
                新增查询框
            </MenuItem>
            <div class="line">|</div>
            <MenuItem name="allExecute">
                <Icon type="social-youtube-outline"></Icon>
                执行
            </MenuItem>
            <div class="line">|</div>
            <MenuItem name="curExecute">
                <Icon type="social-youtube-outline"></Icon>     
                执行选中
            </MenuItem>
            <div class="line">|</div>
            <MenuItem name="record">
                <Icon type="android-time"></Icon>     
                查询记录
            </MenuItem> 
            <div class="line">|</div>
            <MenuItem name="collectForm">
                <Icon type="android-star-outline"></Icon>                
                收藏
            </MenuItem>
            <div class="line">|</div>
            <MenuItem name="collectList">
                <Icon type="ios-list-outline"></Icon>                
                收藏列表
            </MenuItem>
            
          
        </Menu>
        <!-- <p>Change theme</p>
        <RadioGroup v-model="theme1">
            <Radio label="light"></Radio>
            <Radio label="dark"></Radio>
            <Radio label="primary"></Radio>
        </RadioGroup> -->
    </div>
</template>
<script>
    import Vue from 'vue'
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
    export default {
        data () {
            return {
                theme: 'light',
                mode: 'horizontal',
            }
        },
        methods: {
            onSelect(name) {
                if(name === 'query') {
                    this.updateQueryBoxStatus(true)
                }
                else if(name === 'allExecute' && this.commonFlag === 'queryBox') {
                    this.updateAllExecuteStatus(true)
                }
                else if(name === 'curExecute' && this.commonFlag === 'queryBox' && this.curPreQueryCode !== '') {
                    this.updateCurExecuteStatus(true)
                }
                else if(name === 'record') {
                    this.updateQueryRecordStatus(true)
                }
                else if(name === 'collectForm' && this.commonFlag === 'queryBox') {
                    this.updateDialogFormVisible(true)
                } 
                else if(name === 'collectForm' && this.commonFlag !== 'queryBox') {
                    this.$Message.warning({
                        content: '请点击对应的查询框收藏^v^',
                        duration: 3,
                        closable: true
                    });
                }
                else if(name === 'collectList') {
                    this.updateCollectListStatus(true)
                }
                // else if(name === 'temprorary' && this.commonFlag === 'queryBox') {
                //     this.updateTemproraryFormVisible(true)
                // }
                // else if(name === 'temprorary' && this.commonFlag !== 'queryBox') {
                //     this.$Message.warning({
                //         content: '请点击对应的查询框收藏^v^',
                //         duration: 3,
                //         closable: true
                //     });
                // }
            },
            ...mapMutations('queryBox', [
                'updateQueryBoxStatus',
                
            ]),
            ...mapMutations('execute', [
                'updateCurExecuteStatus',
                'updateAllExecuteStatus'
            ]),
            ...mapMutations('queryRecord', [
                'updateQueryRecordStatus',
            ]),
            ...mapMutations('collect', [
                'updateDialogFormVisible',
                'updateCollectListStatus'
            ]),
            ...mapMutations('temprorary', [
                'updateTemproraryFormVisible'
            ]) 
        },
        computed: {
            
            ...mapState('queryBox', {
                isClickQueryBox: 'isClickQueryBox',
                curPreQueryCode: 'curPreQueryCode',
            }),
            ...mapState('execute', {
                isClickCurExecte: 'isClickCurExecute',
                isClickAllExecte: 'isClickAllExecute'
            }),
            ...mapState('common', {
                commonFlag: 'flag'
            })
        }
    }
</script>

<style lang="scss">
    $theme-color: #36ab00;
    .top {
        .ivu-menu-item {
            font: {
                size: 14px;
                weight: 600; 
            }
        }
        .ivu-menu-horizontal {
            height: 41px;
            line-height: 41px;
            .line {
                float: left;
                display: inherit;
                color: $theme-color;
            }
        }
        .ivu-icon {
            color: $theme-color
        }
        .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover, .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu-active, .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu:hover{
            color: $theme-color;
            border:0;

            //border-bottom: 2px solid $theme-color;
        }
        .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item, .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu {
            border-bottom: 0;
        }
        .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active {
            border: 0;
            color: #495060;


        }
        .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item {
            //color: #36ab00;
        }
         .ivu-menu-submenu{
             
            // &:after {
            // content: '';
            // height: 50%;
            // display: inline-block;
            // vertical-align: middle;
            // border-right: 1px solid #36ab00;
            // }
        }
        
    }
</style>

