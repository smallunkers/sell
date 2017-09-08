// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
// import router from './router';
import VueResourse from 'vue-resource';
import VueRouter from 'vue-router';
import goods from './components/goods/goods.vue';
import ratings from './components/ratings/ratings.vue';
import seller from './components/seller/seller.vue';

import './common/stylus/index.styl';
Vue.use(VueRouter);
Vue.use(VueResourse);

// let app = Vue.extend(App);
Vue.config.productionTip = false;

/* eslint-disable no-new */

const routes = [
  {
    path: '/goods',
    component: goods
  },
  {
    path: '/ratings',
    component: ratings
  },
  {
    path: '/seller',
    component: seller
  }
];
let router = new VueRouter({
   routes
});
// router.map({
//   '/goods': {
//      component: goods
//   }
// });
//  1.0版本
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
  data: {
    eventHub: new Vue()
  }
});
router.push('/goods'); // 设置默认路由页
// router.start(app, '#app');
