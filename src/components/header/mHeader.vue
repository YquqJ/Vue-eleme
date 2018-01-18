<template>
  <div class="header">
      <div class="content-wrapper">
        <div class="avatar">
          <img :src="seller.avatar" alt="" width="64" height="64">
        </div>
        <div class="content">
          <div class="title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
          </div>
          <div class="description">
            {{seller.description}}/{{seller.deliveryTime}}分钟后送达
          </div>
          <div v-if="seller.supports" class="supports">
            <span class="icon" :class="shuzu[seller.supports[0].type]"></span>
            <span class="text">{{seller.supports[0].description}}</span>          
          </div>
          <div v-if="seller.supports" class="supports-count" @click="showMask">
            <span class="count">{{seller.supports.length}}个</span>
            <i class="icon-keyboard_arrow_right"></i>
          </div>
        </div>
      </div>
      <div class="bulletin-wrapper" @click="showMask">
        <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
      <div class="background">
        <img :src="seller.avatar" alt="">
      </div>
      <transition name="fade">
        <div v-show="isMask" class="mask">
          <div class="mask-wrapper clearfix">
            <div class="detail-main">
              <h1 class="name">{{seller.name}}</h1>
              <div class="star-wrapper">
                <star :size="48" :score="seller.score"></star>
              </div>
              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <ul v-if="seller.supports" class="supports">
                <li v-for="(item,index) in seller.supports" class="supports-item">
                  <span class="icon" :class="shuzu[seller.supports[index].type]"></span>
                  <span class="description">{{seller.supports[index].description}}</span>
                </li>
              </ul>
              <div class="title">
                <div class="line"></div>
                <div class="text">商家公告</div>
                <div class="line"></div>
              </div>
              <div class="bulletin">
                <p>{{seller.bulletin}}</p>
              </div>
            </div>
          </div>
          <div class="detail-close" @click="hideMask">
            <i class="icon-close"></i>
          </div>
        </div>
      </transition>
  </div>
</template>

<script>
import star from "@/components/star/star"
export default {
  data(){
    return{
      shuzu:['decrease','discount','special','guarantee','invoice'],
      isMask:false
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  methods:{
    showMask:function(){
      this.isMask=true;
    },
    hideMask:function(){
      this.isMask=false;
    }
  },
  components:{
    star
  }
};
</script>

<style lang="stylus">
@import "../../common/stylus/aa.styl";
  .header
    position :relative
    color:#fff
    overflow :hidden
    background-color :rgba(7,17,27,0.5)
    .content-wrapper
      position relative
      padding :24px 12px 18px 24px
      font-size:0
      .avatar
        display:inline-block
        vertical-align :top
        margin-right :16px
      .content
        display:inline-block
        font-size :14px
        .title
          margin :2px 0 8px 0
          .brand
            display :inline-block
            vertical-align :top
            width :30px
            height :18px
            bg-img('brand')
            background-size :30px 18px
            background-repeat no-repeat
          .name
            margin-left :6px
            font-size :18px
            line-height :18px
            font-weight :bold 
          .star-wrapper
            text-align :center
            width :100%
        .description
          font-size :12px
          line-height :12px
          margin-bottom:10px
        .supports
          .icon
            display :inline-block
            vertical-align :middle
            margin-right :4px
            width :12px
            height :12px
            background-size :12px 12px
            background-repeat no-repeat
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
          .text
            display :inline-block
            font-size :10px
            line-height :12px
      .supports-count
        position :absolute
        right :12px
        bottom :14px
        padding :0 8px
        height :24px
        border-radius :14px
        background :rgba(0,0,0,0.2)
        text-align :center
        .count
          line-height :24px
          font-size :10px
        i
          line-height :24px
          font-size :8px
    .bulletin-wrapper
      position relative
      height :28px
      line-height :28px
      padding :0 22px 0 12px
      white-space :nowrap
      overflow :hidden
      text-overflow :ellipsis    
      background-color :rgba(7,17,27,0.2)
      .bulletin-title
        display inline-block
        vertical-align :top
        margin-top :8px
        width :22px
        height :12px
        bg-img('bulletin')
        background-size :22px 12px
        background-repeat :no-repeat
      .bulletin-text
        vertical-align :top
        margin :0 4px
        font-size :10px
      .icon-keyboard_arrow_right
        position :absolute
        right :12px
        top:8px
        font-size:10px
    .background
      position :absolute
      left:0
      top:0
      width :100%
      height :100%
      z-index :-1
      filter :blur(10px)
      img 
        width :100%
        height :100%
    .mask
      position :fixed
      overflow :auto
      width :100%
      height :100%
      top:0
      left:0      
      z-index :100
      backdrop-filter :blur(10px)
      background: rgba(7, 17, 27, 0.8)
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s
      &.fade-enter, &.fade-leave-to
        opacity: 0
        background: rgba(7, 17, 27, 0)
      .mask-wrapper
        min-height :100%
        width :100%
        .detail-main
          margin-top :64px
          padding-bottom :64px
          .name
            font-size :16px
            line-height :16px
            font-weight:700
            text-align :center
          .star-wrapper
            margin-top :18px
            padding :2px 0
            text-align :center
          .title
            display :flex
            width :80%
            margin :28px auto 24px auto
            .line
              flex:1
              position :relative
              border-top:1px solid rgba(255,255,255,0.2)
              top:8px
            .text
              padding :0 12px
              font-size :14px
              font-weight:700
          .supports
            width :80%
            margin :0 auto
            .supports-item
              padding :0 12px
              margin-bottom:12px
              font-size :0
              &:last-child
                margin-bottom:0
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
                font-size :12px
                line-height :16px
          .bulletin
            width :80%
            margin :0 auto
            line-height :24px
            p
              padding :0 12px
              font-size :12px
              color :rgba(255,255,255,0.8)
      .detail-close
        position relative
        width :32px
        height :32px
        font-size :32px
        margin :-64px auto 0 auto
        clear :both

</style>


