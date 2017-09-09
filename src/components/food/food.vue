<template>
    <transition name="move">
      <div>
        <div class="food" v-show="showFlag" ref="food">
          <div class="food-content">
            <div class="image-header">
              <img :src="food.image">
              <div class="back" @click="hide">
                 <i class="icon-arrow_lift"></i>
              </div>
            </div>
            <div class="content">
                <h1 class="title">{{food.name}}</h1>
                <div class="detail">
                    <span class="sell-count">月售{{food.sellCount}}单</span>
                    <span class="rating">好评率{{food.rating}}</span>
                </div>
                <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                </div>
                <transition name="fade">
                    <div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst">加入购物车</div>
                </transition>
            </div>
            <split v-show="food.info"></split>
            <div class="info" v-show="food.info">
              <h1 class="title">商品介绍</h1>
              <p class="text">{{food.info}}</p>
            </div>
            <split></split>
            <div class="rating"></div>
              <h1 class="title">商品评价</h1>
              <ratingselect></ratingselect>
          </div>
        </div>
      </div>
    </transition>
</template>

<script type="text/ecmascript-6">
  import BSscroll from 'better-scroll';
  import Vue from 'vue';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import split from '../split/split.vue';
  import ratingselect from '../ratingselect/ratingselect.vue';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data () {
      return {
        showFlag: false
      };
    },
    methods: {
      show () {
        this.showFlag = true;
        this.$nextTick(() => {
          if (!this.scroll) {
           this.scroll = new BSscroll(this.$refs['food'], {
             click: true
           });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide () {
        this.showFlag = false;
      },
      addFirst (event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        }
        this.$root.eventHub.$emit('cart.add', event.target);
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
.food
  position:fixed
  left:0
  bottom:48px
  top: 0
  z-index :30
  background :#fff
  width:100%
  &.move-enter-active, &.move-leave-active
    transition :all 0.2s linear
  &.move-enter,&.move-leave-active
    transform: translate3d(100%,0,0)
  .image-header
    position :relative
    height:0
    width:100%
    padding-top:100%
    img
      position:absolute
      height :100%
      width:100%
      top:0
      left:0
    .back
      position :absolute
      top:10px
      left:0
      .icon-arrow_lift
        display :block
        padding: 10px
        font-size :20px
        color:#fff
  .content
    padding:28px
    position :relative
    .title
      line-height :14px
      margin-bottom:8px
      font-size:14px
      font-weight :700
      color:rgb(7,17,27)
    .detail
      margin-bottom :8px
      line-height :10px
      height :10px
      font-size:0
      .sell-count,.rating
        font-size:10px
        color:rgb(147,153,159)
      .sell-count
        margin-right:12px
    .price
      font-weight: 700
      line-height: 24px
      font-size: 0
      .now
        margin-right: 8px
        font-size: 14px
        color: rgb(240, 20, 20)
      .old
        text-decoration: line-through
        font-size: 10px
        color: rgb(147, 153, 159)
    .cartcontrol-wrapper
      position :absolute
      right:12px
      bottom:12px
    .buy
      position:absolute
      right:18px
      bottom:18px
      height:24px
      line-height :24px
      padding :0 12px
      z-index:10
      font-size:10px
      border-radius :12px
      box-sizing :border-box
      color:#fff
      background :rgb(0,160,220)
    &.fade-enter-active,&.fade-leave-active
      transition :all 0.2s linear
    &.fade-enter, &.fade-leave-active
      opacity :0
  .info
    padding:18px
    .title
      line-height :14px
      margin-bottom :6px
      font-size:14px
      color:rgb(7,17,27)
    .text
      color:darkgrey
      line-height :24px
      padding:0 8px
      font-size:12px
</style>
