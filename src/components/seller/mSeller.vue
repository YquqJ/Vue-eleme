<template>
  <div class="seller" ref="sellerScroll">
      <div class="seller-content">
        <div class="overview">
          <h1 class="title">{{sellerInfo.name}}</h1>
          <div class="desc border-1px">
            <star :size="36" :score="sellerInfo.score"></star>
            <span class="text">({{sellerInfo.ratingCount}})</span>
            <span class="text">月售{{sellerInfo.sellCount}}单</span>
          </div>
          <ul class="remark">
            <li class="block">
              <h2>起送价</h2>
              <div class="content">
                <span class="stress">{{sellerInfo.minPrice}}</span>元
              </div>           
            </li>
            <li class="block">
              <h2>商家配送</h2>
              <div class="content">
                <span class="stress">{{sellerInfo.deliveryPrice}}</span>元
              </div>           
            </li>
            <li class="block">
              <h2>平均配送时间</h2>
              <div class="content">
                <span class="stress">{{sellerInfo.deliveryTime}}</span>分钟
              </div>           
            </li>
          </ul>
          <div class="favourite">
            <span class="icon-favorite" :class="{'active':favourite}" @click="toggleLike"></span>
            <div class="text">{{favouriteText}}</div>
          </div>
        </div>
        <split></split>
        <div class="bulletin">
          <h1 class="title">公告与活动</h1>
          <p class="content border-1px">{{sellerInfo.bulletin}}</p>
          <ul v-if="sellerInfo.supports" class="supports">
              <li v-for="(item,index) in sellerInfo.supports" class="supports-item border-1px">
                <span class="icon" :class="shuzu[sellerInfo.supports[index].type]"></span>
                <span class="description">{{sellerInfo.supports[index].description}}</span>
              </li>
          </ul>
        </div>
        <split></split>
        <div class="pics">
          <h1 class="title border-1px">商家实景</h1>
          <div class="pics-wrapper" ref="picScroll">
            <ul class="pics-list" ref="picsList">
              <li v-for="pic in sellerInfo.pics" class="pic-item">
                <img :src="pic" alt="" width="120" height="90">
              </li>
            </ul>
          </div>
        </div>
        <split></split>
        <div class="info">
          <h1 class="title">商家信息</h1>
          <ul>
            <li v-for="item in sellerInfo.infos" class="info-item">{{item}}</li>
          </ul>
        </div>
      </div>
  </div>
</template>

<script>
import star from '@/components/star/star';
import split from '@/components/split/split';
import BScroll from 'better-scroll';
import {saveToLocal,loadFromLocal} from '@/common/js/store';
export default {
  data(){
    return{
      shuzu:['decrease','discount','special','guarantee','invoice'],
      favourite:(()=>{
        loadFromLocal(this.sellerInfo.id,'favourite',false)
      })()
    }
  },
  props:{
    sellerInfo:{
      type:Object,
      default(){
        return {};
      }
    }
  },
  components:{
    star,
    split
  },
  watch:{
    'sellerInfo'(){
      this._initScroll();
      this._initPics();
    }
  },
  mounted(){
    this.$nextTick(()=>{
      this._initScroll();
      this._initPics();
    })
  },
  methods:{
    _initScroll(){
      if(!this.sellerScroll){
        this.sellerScroll=new BScroll(this.$refs.sellerScroll,{
          click:true
        })
      }else{
        this.sellerScroll.refresh();
      }
    },
    _initPics(){
      if(this.sellerInfo.pics){
        let picWidth=120;
        let marginWidth=6;
        let width=(picWidth+marginWidth)*this.sellerInfo.pics.length-marginWidth;
        this.$refs.picsList.style.width=width+"px";
        this.$nextTick(()=>{
          if(!this.picScroll){
            this.picScroll=new BScroll(this.$refs.picScroll,{
              scrollX:true,
              eventPassthrough: 'vertical'
            });
          }else{
            this.picScroll.refresh();
          }
        });    
      }  
    },
    toggleLike(event){
      if(!event._constructed){
        return;
      }
      this.favourite=!this.favourite;
      saveToLocal(this.sellerInfo.id,'favourite',this.favourite);
    }
  },
  computed:{
    favouriteText(){
      return this.favourite?'已收藏':'收藏'
    }
  }
}
</script>

<style lang="stylus">
@import '../../common/stylus/aa.styl';
  .seller
    position :fixed
    top:174px
    bottom :0
    left :0
    width :100%
    overflow :hidden
    .seller-content
      .overview
        position :relative
        padding :18px
        .title
          margin-bottom :8px
          line-height :14px
          font-size :14px
          color :rgb(7,17,27)
        .desc
          padding-bottom :18px
          font-size:0
          border-1px(rgba(7,17,27,0.2))
          .star
            display :inline-block
            vertical-align :top
            margin-right :8px
          .text
            display :inline-block
            vertical-align :top
            margin-right :12px
            line-height :18px
            font-size :10px
            color :rgb(77,85,93)
        .remark
          display :flex
          padding-top :18px
          .block
            flex :1
            text-align :center
            border-right :1px solid rgba(7,17,27,0.2)
            &:last-child
              border-right :none
            h2
              line-height :10px
              margin-bottom :4px
              font-size :10px
              color :rgb(147,153,159)
            .content
              line-height :24px
              font-size :10px
              font-weight :400
              color :rgb(7,17,27)
              .stress
                font-size :24px
        .favourite
          position :absolute
          top:18px
          right :11px
          width :50px
          text-align :center
          .icon-favorite
            display :block
            margin-bottom: 4px
            line-height :24px
            font-size :24px
            color: #d4d6d9
            &.active
              color :rgb(240,20,20)
          .text
            line-height :10px
            font-size :10px
            color :rgb(77, 85, 93)
      .bulletin
        padding :18px 18px 0
        .title
          margin-bottom :8px
          line-height :14px
          font-size :14px
          color :rgb(7,17,27)
        .content
          padding :0 12px 16px
          line-height :24px
          font-size :12px
          font-weight :200
          color :rgb(240,20,20)
          border-1px(rgba(7,17,27,0.1))
        .supports
          .supports-item
            padding :16px 12px
            border-1px(rgba(7,17,27,0.1))
            font-size :0
            &:last-child
              border-none()
            .icon
              display :inline-block
              vertical-align :top
              margin-right :6px
              width :16px
              height :16px
              background-size :16px 16px
              background-repeat :no-repeat
              &.decrease
                bg-img('decrease_1')
              &.discount
                bg-img('discount_1')
              &.guarantee
                bg-img('guarantee_1')
              &.invoice
                bg-img('invoice_1')
              &.special
                bg-img('special_1')
            .description
              display :inline-block
              vertical-align :top
              font-size :12px
              line-height :16px
      .pics
        padding :18px
        .title
          margin-bottom :12px
          line-height :14px
          font-size :14px
          color :rgb(7,17,27)
        .pics-wrapper
          width :100%
          overflow :hidden
          white-space :nowrap
          .pics-list
            width :700px
            font-size :0
            .pic-item
              display :inline-block
              margin-right :6px
              width :120px
              height :90px
              &:last-child
                margin :0
      .info
        padding :18px 18px 0 18px
        .title
          padding-bottom :12px
          line-height :14px
          font-size :14px
          color :rgb(7,17,27)
          border-1px(rgba(7,17,27,0.1))
        .info-item
          padding :16px 12px
          line-height: 16px
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
          &:list-child
            border-none()
</style>


