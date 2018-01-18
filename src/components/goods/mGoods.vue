<template>
  <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,$Index) in goods" class="menu-item" :class="{'current':currentIndex===$Index}" 
          @click="selectMenu($Index,$event)">           
            <span class="text border-1px">
              <span class="icon" :class="shuzu[item.type]" v-show="item.type>0"></span>
              {{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper"  ref="foodsWrapper">
        <ul>
          <li v-for="(item,$Index) in goods" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item border-1px" @click="enterFoodDetail(food,$event)">
                <div class="icon">
                  <img :src="food.icon" alt="" width="54" height="54">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="new">￥{{food.price}}</span>
                    <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" @add="addFood"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart :select-foods="selectFoods" :sellerInfo="sellerInfo" ref="shopcart"></shopcart>
      <foodDetail :foodInfo="selectedFood" ref="food"></foodDetail>
  </div>
</template>

<script>
import axios from 'axios';
import BScroll from 'better-scroll';
import shopcart from '@/components/shopcart/shopcart';
import cartcontrol from '@/components/cartcontrol/cartcontrol';
import foodDetail from '@/components/foodDetail/foodDetail'
export default {
  data(){
    return{
      shuzu:['decrease','discount','special','guarantee','invoice'],
      goods:[],
      listHeight:[],
      scrollY:0,
      selectedFood:{}
    }
  },
  props:{
    sellerInfo:{
      type:Object
    }
  },
  computed:{
    //根据落点位置落在右侧列表哪个区域 得到对应的下标
    currentIndex(){
      for(let i=0;i<this.listHeight.length;i++){
        let height1=this.listHeight[i];
        let height2=this.listHeight[i+1];
        if(!height2 || (this.scrollY>=height1 && this.scrollY<height2)){
          return i;
        }
      }
      return 0;
    },
    selectFoods(){
      let choosefoods=[];
      this.goods.forEach((good)=>{
        good.foods.forEach((food)=>{
          if(food.count>0){
            choosefoods.push(food);
          }
        });
      });
      return choosefoods;
    }
  },
  created(){
    //利用axios获取数据
    axios.get('/api/goods')
    .then(response=>{
      this.goods=response.data.data;
      //$nextTrick() 等到dom加载完成后，计算dom属性
      this.$nextTick(()=>{
        this._initScroll();
        this._calculateHeight();
      })
    })
  },
  methods:{
    //初始化better-scroll
    _initScroll:function(){
      this.menuWrapper=new BScroll(this.$refs.menuWrapper,{
        //是否可被点击
        click:true
      });
      this.foodsWrapper=new BScroll(this.$refs.foodsWrapper,{
        //相当于探针
        probeType:3,
        click:true
      });
      //better-scroll自己的监听事件，得到落点位置
      this.foodsWrapper.on('scroll',(pos)=>{
        this.scrollY=Math.abs(Math.round(pos.y));
      });
      
    },
    //计算右侧列表每个区域的高度，累加存入数组
    _calculateHeight:function(){
      let item=this.$refs.foodsWrapper.getElementsByClassName("food-list-hook");
      let height=0;
      this.listHeight.push(height);
      for(let i=0;i<item.length;i++){
        height+=item[i].clientHeight;
        this.listHeight.push(height);
      }
    },
    //点击左侧菜单到指定区域
    selectMenu(index,event){
      //针对PC端，阻止派发better-scroll点击事件
      if(!event._constructed){
        return;
      }
      let foodList=this.$refs.foodsWrapper.getElementsByClassName("food-list-hook");
      let el=foodList[index];
      this.foodsWrapper.scrollToElement(el,300);
    },
    addFood(target){
      this._drop(target);
    },
    _drop(target){
      //异步执行
      this.$nextTick(()=>{
        this.$refs.shopcart.drop(target);
      })
      
    },
    enterFoodDetail(food,event){
      if(!event._constructed){
        return;
      }
      this.selectedFood=food;
      this.$refs.food.show();
    },
  },
  components:{
    shopcart,
    cartcontrol,
    foodDetail
  },
}
</script>

<style lang="stylus">
@import '../../common/stylus/aa.styl';
  .goods
    display flex
    position :absolute
    width :100%
    top:174px
    bottom :48px
    overflow hidden
    .menu-wrapper
      flex :0 0 80px
      width :80px
      background :#f3f5f7
      .menu-item
        display :table
        line-height :14px
        width :56px
        height :54px
        padding :0 12px
        &.current
          position relative
          background :#fff
          margin-top:-1px
          z-index :10
          .text
            border-none()
            font-weight:700
        .icon
          display :inline-block
          vertical-align :top
          margin-right :2px
          width :12px
          height :12px
          background-size :12px 12px
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
        .text
          display :table-cell
          vertical-align :middle
          width :56px
          height :54px
          font-size :12px
          border-1px(rgba(7,17,27,0.1))
    .foods-wrapper
      flex :1
      .food-list
        .title
          height :26px
          line-height :26px
          border-left:2px solid #d9dde1
          font-size :12px
          color:rgb(147,153,159)
          background-color :#f3f5f7
          padding-left :14px
        .food-item
          display :flex
          margin :18px
          padding-bottom:18px
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()
            margin-bottom:0
          .icon 
            margin-right :10px
          .content
            .name
              margin:2px 0 8px 0
              line-height :14px
              font-size:14px
              color:rgb(7,17,27)
            .desc,.extra
              font-size:10px
              line-height :10px
              color:rgb(147,153,159)
            .desc
              margin-bottom :8px
            .extra
              .count
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
              right :0
              bottom:12px


</style>


