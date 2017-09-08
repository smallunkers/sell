<template>
    <div>
      <div class="shopcart">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight':totalCount > 0}">
                        <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                    </div>
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highlight':totalPrice > 0}">￥{{totalPrice}}</div>
                <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <div class="content-right" @click.stop.prevent="pay">
                <div class="pay" :class="payClass">
                    {{payDesc}}
                </div>
            </div>
        </div>
        <div class="ball-container">
              <transition name="drop" @before-enter="beforeEnter" @after-enter="afterEnter" @enter="dropping" v-for="ball in balls">
                <div   class="ball" v-show="ball.show" >
                    <div class="inner inner-hook"></div>
                </div>
              </transition>
        </div>
        <transition name="fold">
          <div class="shopcart-list" v-show="listShow">
            <div class="list-header">
                <h1 class="title">购物车</h1>
                <span class="empty" @click="empty">清空</span>
            </div>
            <div class="list-content" ref="listContent">
                <ul>
                    <li class="food" v-for="food in selectFoods">
                        <span class="name">{{food.name}}</span>
                        <div class="price" >
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
        <div class="list-mask" v-show="listShow"　@click="hideList">
        </div>
      </transition>
    </div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import BSscroll from 'better-scroll';
    export default {
        props: {  // 用于接受父组件传递过来的数据
          deliveryPrice: {
            type: Number,
            default: 0
          },
          minPrice: {
            type: Number,
            default: 0
          },
          selectFoods: {
            type: Array,
            default () {
              return [
                {
                  count: 1,
                  price: 100
                }
              ];
            } // 当type为数组或对象时，default需要return
          }
        },
        data () {
          return {
            balls: [
              {
                show: false
              },
              {
                show: false
              },
              {
                show: false
              },
              {
                show: false
              },
              {
                show: false
              }
            ],
            dropBalls: [],
//            listShow: false,
            fold: true
          };
        },
        created () {
          this.$root.eventHub.$on('cart.add', (el) => { // 找到隐藏的小球，添加到下落的小球里
            for (let i = 0; i < this.balls.length; i++) {
              let ball = this.balls[i];
              if (!ball.show) {
                ball.show = true;
                ball.el = el;
                this.dropBalls.push(ball);
                return;
              }
            }
          });// $root是根组件，eventHub是一个空对象，事件派发中心，$on监听事件'cart.add',然后回调drop函数。
        },
        computed: {
          totalPrice () {
            let total = 0;
            this.selectFoods.forEach((food) => {
              total += food.count * food.price;
            });
            return total;
          },
          totalCount () {
            let count = 0;
            this.selectFoods.forEach((food) => {
              count += food.count;
            });
            return count;
          },
          payDesc () {
            if (this.totalPrice === 0) {
                return `￥${this.minPrice}元起送`;
            } else if (this.totalPrice < this.minPrice) {
                let diff = this.minPrice - this.totalPrice;
                return `还差￥${diff}元起送`;
            } else {
                return '去结算';
            }
          },
          payClass () {
            if (this.totalPrice >= this.minPrice) {
              return 'enough';
            } else {
              return 'not-enough';
            }
          },
          listShow () {
            if (!this.totalCount) {
              // 未选择
                this.fold = true;
                // 默认选择
                return false;
            }
            let show = !this.fold;
            if (show) {
              this.$nextTick(() => {
                if (!this.scroll) {
                  this.scroll = new BSscroll(this.$refs['listContent'], {
                    click: true
                  });
                } else {
                  this.scroll.refresh();
                }
              });
            }
            return show;
          }
        },
        methods: {
          pay () {
            if (this.totalPrice < this.minPrice) {
              return;
            }
            window.alert(`支付${this.totalPrice}元`);
          },
          hideList () {
            this.fold = true;
          },
          empty () {
            this.selectFoods.forEach((food) => {
              food.count = 0;
            });
          },
          toggleList () {
            if (!this.totalCount) {
              return;
            }
            this.fold = !this.fold;
          },
          beforeEnter (el) {
            let count = this.balls.length;
            while (count--) {
              let ball = this.balls[count];
              if (ball.show) {
                let rect = ball.el.getBoundingClientRect(); // 获得元素相当于适口的位置偏移
                let x = rect.left - 32; // cartconrol 与小球最终落的差值
                let y = -(window.innerHeight - rect.top - 22);
                el.style.display = ''; // 先设置为空，这样清楚v-show的display:none样式
                el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                el.style.transform = `translate3d(0,${y}px,0)`;
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                inner.style.transform = `translate3d(${x}px,0,0)`;
              }
            }
          },
          dropping (el, done) {
            /* eslint-disable no-unused-vars */
            let rf = el.offsetHeight;   // 重绘
            this.$nextTick(() => {
              el.style.display = '';
              el.style.webkitTransform = 'translate3d(0,0,0)';
              el.style.transform = 'translate3d(0,0,0)';
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = 'translate3d(0,0,0)';
              inner.style.transform = 'translate3d(0,0,0)';
            });
            done();
          },
          afterEnter (el) {
            let ball = this.dropBalls.shift();
            if (ball) {
              ball.show = false;
              el.style.display = 'none';
            }
          }
        },
      components: {
        cartcontrol
      }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl"
.shopcart
  position : fixed
  z-index : 50
  left : 0
  bottom :  0
  width : 100%
  height : 46px
  .content
    display : flex
    background : #141d27
    font-size : 0
    .content-left
      flex:1
      .logo-wrapper
        display : inline-block
        position: relative
        top : -10px
        margin : 0 12px
        padding : 6px
        width :56px
        height : 56px
        box-sizing : border-box
        vertical-align : top
        border-radius : 50%
        background : #141d27
        .logo
          width : 100%
          height : 100%
          border-radius : 50%
          background : #2b343c
          text-align :center
          &.highlight
            background : rgb(0, 160, 220)
          .icon-shopping_cart
            font-size : 24px
            color : #80858a
            line-height :44px
            &.highlight
              color : #fff
        .num
          position :absolute
          top : 0
          right: 0
          width : 24px
          height : 16px
          line-height : 16px
          text-align : center
          border-radius :16px
          font-size :9px
          font-weight : 700
          color : #fff
          background : rgb(240, 20, 20)
          box-shadow : 0 4px 8px 0 rgba(0, 0, 0, 0.4)
      .price
        display : inline-block
        vertical-align :top
        line-height :24px
        margin-top: 12px
        box-sizing :border-box
        border-right:1px solid rgba(255, 255, 255, 0.1)
        padding-right :12px
        font-size :16px
        font-weight :700
        color : rgba(255, 255, 255, 0.4)
        &.highlight
          color : #fff
      .desc
        display : inline-block
        vertical-align : top
        line-height :24px
        margin : 12px 0 0 12px
        font-size:10px
        font-weight :700
        color : rgba(255, 255, 255, 0.4)
    .content-right
      flex:0 0 105px
      width : 105px
      .pay
        font-size :12px
        height:48px
        text-align :center
        line-height : 48px
        color : rgba(255, 255, 255, 0.4)
        font-weight : 700
        background : #2b333b
        &.not-enough
          background :#2b333b
        &.enough
          color: #fff
          background : #00b43c
  .ball-container
    .ball
      position :fixed
      left:32px
      bottom : 22px
      z-index : 200
      transition : all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
      .inner
        width:16px
        height:16px
        border-radius : 50%
        background :rgb(0, 160, 220)
        transition : all 0.4s linear
  .shopcart-list
    position:absolute
    top: 0
    left : 0
    z-index :-1
    width :100%
    transform : translate3d(0,-100%,0)
    background :white
    &.fold-enter-active,&.fold-leave-active
      transition : all 0.5s
    &.fold-enter,&.fold-leave-active
      transform: translate3d(0,0,0)
    .list-header
      line-height :40px
      height : 40px
      padding : 0 18px
      background :#f3f5f7
      border-bottom :1px solid #rgba(7,17,27,0.1)
      .title
        float:left
        font-size: 14px
        color : rgb(7,17,27)
      .empty
        float:right
        font-size : 12px
        color: rgb(0,160,220)
    .list-content
      padding :0 18px
      max-height: 217px
      background :#fff
      overflow:hidden
      .food
        position :relative
        padding :12px 0
        box-sizing :border-box
        border-1px(rgba(7,17,27,0,1))
        .name
          line-height : 24px
          font-size : 14px
          color : rgb(7,17,27)
        .price
          position :absolute
          right:90px
          bottom:12px
          line-height:24px
          font-size:14px
          font-weight :700
          color:red
        .cartcontrol-wrapper
          position :absolute
          right :0
          bottom: 6px
.list-mask
  position :fixed
  top:0
  left:0
  width:100%
  height:100%
  z-index:40
  background :rgba(7,17,27,0.6)
　&.fade-enter-active, &.fade-leave-active
    transition: all 0.5s
    opacity: 1
　&.fade-enter, &.fade-leave-to
    background: rgba(7, 17, 27, 0)
    opacity: 0
</style>
