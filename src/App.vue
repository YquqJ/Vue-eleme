<template>
  <div id="app">
    <m-header :seller="seller"></m-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :sellerInfo="seller" />
    </keep-alive>
  </div>
</template>

<script>
import mHeader from "@/components/header/mHeader";
import axios from 'axios';
import {urlParse} from '@/common/js/util';
const ERR_OK = 0;

export default {
  name: "app",
  data(){
    return {
      goods:{},
      seller:{
        id:(()=>{
          let queryParam=urlParse();
          return queryParam.id;
        })()
      }
    }
  },
  components: {
    mHeader
  },
  created(){
    axios.get('/api/seller?id='+this.seller.id)
    .then(response=>{
      console.log(this.seller.id)
      this.seller=response.data.data;
      if(response.data.errno==ERR_OK){
        this.seller = Object.assign({}, this.seller, response.data.data);
      }
    })
    .catch(error=>{
      console.log(error);
      alert('网络请求错误');
    });
    axios.get('/api/goods')
    .then(response=>{
      this.goods=response.data;
    })
    .catch(error=>{
      console.log(error);
      alert('网络请求错误')
    })
  }
  
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './common/stylus/aa.styl'
#app {
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    // border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    border-1px(rgba(7, 17, 27, 0.1));

    .tab-item {
      flex: 1;
      height: 40px;
      text-align: center;

      & > a {
        display: block;
        text-decoration: none;
        font-size: 14px;
        color: #000;
      }

      & .router-link-active {
        // border-bottom:2px solid red;
        color: red;
      }
    }
  }
}
</style>
