<template>
  <div>
    <div class="shopcart">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrappar">
                    <div class="logo" :class="{'highlight':totalCount>0}">
                        <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                    </div>
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>            
                </div>
                <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
                <div class="desc">另需配送费￥{{sellerInfo.deliveryPrice}}元</div>           
            </div>
            <div class="content-right" :class="isenough" @click.stop.prevent="pay">
                <span class="pay" :class="isenough">{{payDesc}}</span>
            </div>    
        </div>
        <div class="ball-wrapper">    
                <div v-for="ball in balls">
                    <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
                        <div class="ball" v-show="ball.show">
                            <div class="inner inner-hook"></div>
                        </div>
                    </transition>
                </div>        
        </div>
        <transition name="fold">
            <div class="shopcart-list" v-show="listShow">
                <div class="list-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="emptyCart">清空</span>
                </div>
                <div class="list-content" ref="listContent">
                    <ul>
                        <li v-for="food in selectFoods" class="food-item">
                            <span class="name">{{food.name}}</span>
                            <div class="price">
                                <span>￥{{food.price*food.count}}</span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol :food="food"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
    <transition name="fade">
        <div class="list-mask" v-show="listShow" @click="hideMask"></div>
    </transition>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import cartcontrol from '@/components/cartcontrol/cartcontrol';
export default {
  data(){
      return {
          balls:[
              {
                  show:false
              },
              {
                  show:false
              },
              {
                  show:false
              },
              {
                  show:false
              },
              {
                  show:false
              }
          ],
          dropBall:[],
          fold:true,
      }
  },
  props:{
      sellerInfo:{
          type:Object
      },
      selectFoods:{
          type:Array,
          default(){
              return [];
          }
      }
  },
  computed:{
      totalPrice(){
          let total=0;
          this.selectFoods.forEach((food)=>{
              total+=food.price*food.count;
          })
          return total;
      },
      totalCount(){
          let count=0;
          this.selectFoods.forEach((food)=>{
              count+=food.count;
          })
          return count;
      },
      payDesc(){
          if(this.totalPrice===0){
              return `￥${this.sellerInfo.minPrice}元起送`;
          }else if(this.totalPrice<this.sellerInfo.minPrice){
              let cha=this.sellerInfo.minPrice-this.totalPrice;
              return `还差￥${cha}元起送`;
          }else{
              return `去结算`;
          }
      },
      isenough(){
          if(this.totalPrice<this.sellerInfo.minPrice){
              return 'no-enough';
          }else{
              return 'enough';
          }
      },
      listShow(){
          if(!this.totalCount){
              this.fold=true;
              return false;
          }
          let show=!this.fold;
          if(show){
              this.$nextTick(()=>{
                  if(!this.cartScroll){
                    this.cartScroll=new BScroll(this.$refs.listContent,{
                        click:true
                    });
                }else{
                    this.cartScroll.refresh();
                }
              });
              
              
          }
          return show;
      }
  },
  methods:{
      drop(el){
          for(let i=0;i<this.balls.length;i++){
              let ball=this.balls[i];
              if(!ball.show){
                  ball.show=true;
                  ball.el=el;
                  this.dropBall.push(ball);
                  return;
              }
          }
      },
      beforeDrop(el){
        let count=this.balls.length;
        while(count--){
            let ball=this.balls[count];
            if(ball.show){
                let rect=ball.el.getBoundingClientRect();
                let x=rect.left-32;
                let y=-(window.innerHeight-rect.top-22);
                // console.log(x+'----'+y)
                el.style.display='';
                el.style.webkitTransform=`translate3d(0,${y}px,0)`;
                el.style.transform=`translate3d(0,${y}px,0)`;
                let inner=el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform=`translate3d(${x}px,0,0)`;
                inner.style.transform=`translate3d(${x}px,0,0)`;

            }
        }
      },
      dropping(el,done){
          /* eslint-disable no-unused-vars */
            let rf = el.offsetHeight;
            this.$nextTick(()=>{
                // el.style.display='';
                el.style.webkitTransform='translate3d(0,0,0)';
                el.style.transform='translate3d(0,0,0)';
                let inner=el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform='translate3d(0,0,0)';
                inner.style.transform='translate3d(0,0,0)';
                el.addEventListener('transitionend', done);
          })    
      },
      afterDrop(el){
          let ball=this.dropBall.shift();
          if (ball) {
            ball.show = false;
            el.style.display = 'none';
          }

      },
      toggleList(){
          if(!this.totalCount){
              return;
          }
          this.fold=!this.fold;
      },
      emptyCart(){
          this.selectFoods.forEach((food)=>{
              food.count=0;
          });
      },
      hideMask(){
          this.fold=true;
      },
      pay(){
          if(this.totalPrice<this.sellerInfo.minPrice){
              return;
          }
          window.alert(`支付${this.totalPrice}元`);
          this.emptyCart();
      }
  },
  components:{
      cartcontrol
  }
}
</script>

<style lang="stylus">
@import '../../common/stylus/aa.styl'
    .shopcart
        position :fixed
        bottom :0
        left :0
        z-index :50
        width :100%
        height :48px
        .content
            display :flex
            background-color :#141d27
            font-size :0
            height :48px
            .content-left
                flex:1
                .logo-wrappar
                    display :inline-block
                    position :relative
                    vertical-align :top
                    top:-10px
                    margin :0 12px
                    padding :6px
                    width :56px
                    height :56px
                    border-radius :50%
                    background-color :#141d27
                    box-sizing :border-box
                    .num
                        position :absolute
                        top :0
                        right :0
                        width :24px
                        height :16px
                        line-height :16px
                        text-align :center
                        color :#fff
                        font-size :9px
                        background :rgb(255,20,20)
                        border-radius :16px
                        box-shadow :0 4px 8px 0 rgba(0,0,0,0.4)
                    .logo
                        width :100%
                        height :100%
                        background-color :#2b343c
                        text-align :center
                        border-radius :50%
                        &.highlight
                            background :rgb(0,160,220)
                        .icon-shopping_cart
                            font-size:24px
                            color :#80858a
                            line-height :44px
                            &.highlight
                                color :#fff
                .price
                    display :inline-block
                    vertical-align :top
                    margin-top:12px
                    padding-right :12px
                    line-height :24px
                    font-size :16px
                    font-weight:700
                    border-right :1px solid rgba(255,255,255,0.1)
                    color :rgba(255,255,255,0.4)
                    &.highlight
                        color :#fff
                .desc
                    display :inline-block
                    vertical-align :top
                    margin :12px 0 0 12px
                    line-height :24px
                    font-size :12px
                    color :rgba(255,255,255,0.4)
            .content-right
                flex :0 0 105px
                width :105px
                text-align :center
                &.no-enough
                    background :#2b333b
                &.enough
                    background-color :#00b43c
                .pay
                    height :48px
                    line-height :48px
                    text-align :center         
                    font-size:14px
                    font-weight:700                   
                    &.no-enough
                        color:rgba(255,255,255,0.4)
                    &.enough
                        color :#fff      
        .ball-wrapper
            .ball
                position :fixed
                left:32px
                bottom:22px
                z-index :200
                transition :all 0.4s cubic-bezier(.65,-0.15,.81,.35)
                .inner
                    width :16px
                    height :16px
                    border-radius :50%  
                    background-color :rgb(0,160,220)
                    transition :all 0.4s linear
        .shopcart-list
            position :absolute
            top: 0
            left :0
            z-index:-1
            width :100%
            transform:translate3d(0,-100%,0)
            &.fold-enter-active,&.fold-leave-active
                transition :all 0.5s
            &.fold-enter,&.fold-leave-to
                transform :translate3d(0,0,0)
            .list-header
                height:40px
                line-height :40px
                padding:0 18px
                background-color :#f3f5f7
                border-bottom: 1px solid rgba(7,17,27,0.2)
                .title
                    float :left
                    font-size :14px
                    font-weight:200
                    color:rgb(7,17,27)
                .empty
                    float :right
                    font-size:12px
                    color:rgb(0,160,220)
            .list-content
                padding :0 18px
                max-height :217px
                overflow :hidden
                background :#fff
                .food-item
                    position :relative
                    padding:12px 0
                    border-1px(rgba(7,17,27,0.1))
                    .name                      
                        line-height :24px
                        font-size:14px
                        color:rgb(7,17,27)
                    .price                    
                        position:absolute
                        bottom:12px
                        right:90px
                        line-height :24px
                        font-size: 14px
                        font-weight: 700
                        color: rgb(240, 20, 20)
                    .cartcontrol-wrapper
                        position:absolute
                        bottom:6px
                        right :0
    .list-mask
        position :fixed
        top:0
        left:0
        width :100%
        height :100%
        z-index :40
        background :rgba(7,17,27,0.6)
        &.fade-enter-active,&.fade-leave-active
            transition:all 0.5s
            opacity :1
        &.fade-enter,&.fade-leave-to
            opacity :0



</style>


