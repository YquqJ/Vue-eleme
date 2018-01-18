<template>
  <transition name="fade">
    <div class="detail-wrapper" v-show="showFlag" ref="detailScroll">
      <div class="food-content">
        <div class="image-header">
          <img :src="foodInfo.image" alt="">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{foodInfo.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{foodInfo.sellCount}}份</span>
            <span class="rating">好评率{{foodInfo.rating}}%</span>
          </div>
          <div class="price">
            <span class="new">￥{{foodInfo.price}}</span>
            <span class="old" v-show="foodInfo.oldPrice">￥{{foodInfo.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="foodInfo" @add="addFood"></cartcontrol>
          </div>
          <transition name="btn">
            <div class="addcart-btn" v-show="!foodInfo.count || foodInfo.count===0" @click="addFirst">加入购物车</div>
          </transition>
        </div>
        <split v-show="foodInfo.info"></split>
        <div class="introduce" v-show="foodInfo.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{foodInfo.info}}</p>
        </div>
        <split></split>
        <div class="ratings">
          <h1 class="title">商品评价</h1>
          <rating-select :ratings="foodInfo.ratings" :select-type="selectType" :only-content="onlyContent" 
          :desc="desc" @toggle="toggle" @choose="choose"></rating-select>
          <div class="rating-wrapper">
            <ul v-show="foodInfo.ratings && foodInfo.ratings.length">
              <li v-for="(rating,$index) in foodInfo.ratings" v-show="needShow(rating.rateType,rating.text)" class="rating-item border-1px">
                <div class="user">
                  <span class="username">{{rating.username}}</span>
                  <span class="avatar">
                    <img :src="rating.avatar" alt="" width="16" height="16">
                  </span>
                </div>
                <div class="time">{{rating.rateTime | formaDate}}</div>
                <div class="content">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                  {{rating.text}}
                </div>
              </li>
            </ul>
            <div v-show="!foodInfo.ratings || foodInfo.ratings.length===0" class="no-content">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
const POSITIVE=0;
const NEGATIVE=1;
const ALL=2;

import BScroll from 'better-scroll';
import cartcontrol from '@/components/cartcontrol/cartcontrol';
import split from '@/components/split/split';
import ratingSelect from '@/components/ratingSelect/ratingSelect';
import Vue from 'vue';
import {formaDate} from '@/common/js/date';
export default {
  data(){
    return {
      showFlag:false,
      ratings:{},
      selectType:ALL,
      onlyContent:true,
      desc:{
        all:"全部",
        positive:"推荐",
        negative:"吐槽"
      }
    }
  },
  props:{
      foodInfo:{
          type:Object
      }
  },
  methods:{
    show(){
      this.showFlag=true;
      this.selectType=ALL;
      // this.onlyContent=true;
      this.$nextTick(()=>{
        if(!this.detailScroll){
          this.detailScroll=new BScroll(this.$refs.detailScroll,{
            click:true
          })
        }else{
          this.detailScroll.refresh();
        }
      });
    },
    hide(){
      this.showFlag=false;
    },
    addFirst(event){
      if(!event._constructed){
        return;
      }
      //动画无效
      this.$emit('add',event.target);
      console.log(event.target)
      Vue.set(this.foodInfo,'count',1);
    },
    addFood(target){
      // console.log(target)
      //动画无效
      this.$emit('add',target);
    },
    toggle(){
      this.onlyContent=!this.onlyContent;
      this.$nextTick(()=>{
        this.detailScroll.refresh();
      });
    },
    choose(type){
      this.selectType=type;
      this.$nextTick(()=>{
        this.detailScroll.refresh();
      });
    },
    needShow(type,text){
      if(this.onlyContent && !text){
        return false;
      }
      if(this.selectType===ALL){
        return true;
      }else{
        return type===this.selectType;
      }
    }
  },
  filters:{
    formaDate(time){
      let date=new Date(time);
      return formaDate(date,'yyyy-MM-dd hh:mm');
    }
  },
  components:{
    cartcontrol,
    split,
    ratingSelect
  }
}
</script>

<style lang="stylus">
@import '../../common/stylus/aa.styl';
  .detail-wrapper
    position :fixed
    top:0
    left:0
    bottom :46px
    width :100%
    background :#fff
    &.fade-enter-active,&.fade-leave-active
      transition:all 0.5s
      transform :translate3d(0,0,0)
      opacity :1
    &.fade-enter,&.fade-leave-to
      transform :translate3d(100%,0,0)
      opacity :0
    .food-content
      .image-header
        position :relative
        width :100%
        height :0
        padding-top :100%
        img 
          position :absolute
          top:0
          left:0
          width :100%
          height :100%
        .back
          position :absolute
          top:10px
          left :3px
          border-radius :12px
          background :rgba(7,17,27,0.5)
          .icon-arrow_lift
            display :block
            padding :6px 12px
            font-size :20px
            color :#fff
      .content
        position :relative
        padding :18px
        background :#fff
        .title
          line-height :14px
          font-size:14px
          font-weight:700
          color :rgb(7, 17, 27)
          margin-bottom :10px
        .detail
          height :10px
          line-height :10px
          font-size:0
          margin-bottom:18px
          .sell-count,.rating
            line-height :10px
            font-size:10px
          .sell-count
            margin-right :12px
        .price
          line-height :24px
          .new
            margin-right:8px            
            font-size :14px
            font-weight:700
            color:red
          .old
            text-decoration:line-through
            font-size :10px
            color:rgb(147,153,159)
        .cartcontrol-wrapper
          position :absolute
          bottom:12px
          right:12px
        .addcart-btn
          position :absolute
          bottom:18px
          right:18px
          padding:0 12px
          height :22px
          line-height :22px
          box-sizing :border-box
          border-radius :16px
          font-size :10px
          color :#fff
          background :rgb(0,160,220)
          &.btn-enter-active,&.btn-leave-active
            transition:all 0.2s
            opacity :1
          &.btn-enter,&.btn-leave-to
            opacity :0
      .introduce     
        width :100%
        box-sizing :border-box
        padding :18px
        .title
          margin-bottom :6px
          line-height :14px
          font-size :14px
          font-weight:700
          color :rgb(7,17,27)
        .text
          padding :0 2px
          line-height :24px
          font-size:12px
          color :rgb(77,85,93)
      .ratings
        .title
          padding-top :18px
          margin-left :18px
          line-height :14px
          font-size :14px
          color :rgb(7,17,27)
        .rating-wrapper
          padding :0 18px
          .rating-item
            position :relative
            padding :16px 0
            border-1px(rgba(7,17,27,0.5))
            .user
              position :absolute
              top :16px
              right :0
              line-height :12px
              font-size:0
              .username
                display :inline-block
                vertical-align :top
                font-size :10px
                color :rgb(147,153,159)
              .avatar
                display :inline-block
                margin-left :6px
                vertical-align :top
                border-radius :50%
            .time
              line-height :12px
              margin-bottom :6px
              color :rgb(147,153,159)
              font-size:10px
            .content
              line-height :16px
              font-size :12px
              padding :0
              color :rgb(7,17,27)
              .icon-thumb_up,icon-thumb_down
                margin-right :4px
                line-height :16px
                font-size:12px
              .icon-thumb_up
                color :rgb(0,120,160)
              .icon-thumb_down
                color :rgb(147, 153, 159)
          .no-content
            padding :16px 0
            line-height :12px
            text-align :center
            font-size :12px
            color :rgb(147, 153, 159)
        
              

    

</style>


