import Vue from 'vue'
import Router from 'vue-router'
import mGoods from '@/components/goods/mGoods'
import mRatings from '@/components/ratings/mRatings'
import mSeller from '@/components/seller/mSeller'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'HelloWorld',
      component: mGoods
    },{
      path:'/goods',
      name:'goods',
      component:mGoods,
    },{
      path:'/ratings',
      name:'ratings',
      component:mRatings
    },{
      path:'/seller',
      name:'seller',
      component:mSeller
    }
  ]
})

