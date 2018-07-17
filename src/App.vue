<template>
  <drag-zone class="zone">
    <drag-content class="left">
      <div class="item i1">
        <left-table></left-table>
      </div>
    </drag-content>
    <drag-handle class="handle">
      <Icon type="android-more-vertical" size="20"></Icon>
    </drag-handle>
    <drag-content class="right">
  
      <div class="head">
        <top-nav></top-nav>
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
    
  </drag-content>
  </drag-zone>
 
</template>

<script>

  import Vue from 'vue'
  import TopNav from '~/components/topTable/TopNav.vue'
  import LeftTable from '~/containers/LeftTable.vue'
  //import ElContainer from "element-ui/packages/container/src/main"
  import dragZone from '~/components/common/zone.vue'
  import dragHandle from '~/components/common/handle.vue'
  import dragContent from '~/components/common/content.vue'

  import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'


  export default {
    components: {
      TopNav,
      LeftTable,
      //ElContainer,
      dragContent,
      dragHandle,
      dragZone
    },
    mounted() {
      //创建RTCPeerConnection接口
      let conn = new RTCPeerConnection({
          iceServers: []
        }) 
      let noop = function(){}
      let _this = this
      conn.onicecandidate = function(ice){
        if (ice.candidate){
          //使用正则获取ip
          let ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
          let ip_addr = ip_regex.exec(ice.candidate.candidate)[1];
          _this.updateIp(ip_addr)
          conn.onicecandidate = noop
        }
      }
      //随便创建一个叫狗的通道(channel)
      conn.createDataChannel('author:zhangjin')
      //创建一个SDP协议请求
      conn.createOffer(conn.setLocalDescription.bind(conn),noop)


    },
    
    methods: {
      ...mapMutations('queryBox', [
        'updateIp'
      ])
    }
    
  }

</script>


<style lang="scss">
  .zone {    
    font: {
      size: 14px;
      family: "Tahoma, Helvetica, Arial, 微软雅黑, sans-serif;";
    } 
    height: 900px;    

    width: 100%;
    margin: 0 auto;
    //position: relative;
    clear: both;
    //overflow: hidden;
    display: flex;
    justify-content: space-between;
    .zone, .handle {
      //width: 10px;
      height: 20px;
      // background: #2196f3;
      margin: {
        left: 10px;
        right: 10px;
        top: 450px;
      }
    }
    .left {
      width: 18%;
      min-width: 15%;
      height: 100%;
      background: #fff;
      .item {
        height: 100%;
      }
    }

  
    .right {
      flex: 5;
      width: 80%;
      height: 900px;
      display: flex;
      flex: {
        direction: column;
        wrap: nowrap;
      }
      justify-content: flex-start;
      .head {
        height: 41px;
        max-height: 41px;
        min-height: 41px;
      }
      .main {
        flex-grow: 1;
        height: 859px;
        margin-top: 10px;
      }
    }   
    }
 
    
</style>

<style lang="scss">
    body {
        background: #f4f4f4;
        
    }
</style>