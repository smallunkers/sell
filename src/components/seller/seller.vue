<!--商家页-->
<template>
    <div class="seller" ref="seller">
      <div class="seller-wrapper">
        <div class="overview">
          <h1 class="title"></h1>
          <div class="desc border-1px">
            <star :size="36" :score="seller.score"></star>
            <span class="text">({{seller.ratingCount}})</span>
            <span class="text">月售{{seller.sellCount}}单</span>
          </div>
          <ul class="remark">
            <li class="block">
              <h2>起送价</h2>
              <div class="content">
                <span class="stress">{{seller.minPrice}}</span>元
              </div>
            </li>
            <li class="block">
              <h2>商家配送</h2>
              <div class="content">
                  <span class="stress">{{seller.deliveryPrice}}</span>元
              </div>
            </li>
            <li class="block">
              <h2>平均配送时间</h2>
              <div class="content">
                  <span class="stress">{{seller.deliveryTime}}</span>分钟
              </div>
            </li>
          </ul>
          <div class="favorite" @click="toggleFavorite">
            <span class="icon-favorite" :class="{active:favorite}"></span>
            <span class="text">{{favoriteText}}</span>
          </div>
        </div>
        <split></split>
        <div class="bulletin">
          <h1 class="title">公告与活动</h1>
          <div class="content-wrapper">
            <p class="content">{{seller.bulletin}}</p>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li v-for="(item ,index) in seller.supports" class="support-item border-1px" key="index">
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
        </div>
        <split></split>
        <div class="pics">
          <h1 class="title">商家实景</h1>
          <div class="pic-wrapper" ref="picWrapper">
            <ul class="pic-list" ref="picList">
              <li v-for="(pic,index) in seller.pics" class="pic-item">
                <img width="120" height="90" :src="pic">
              </li>
            </ul>
          </div>
        </div>
        <split></split>
        <div class="info">
          <h1 class="title border-1px">商家信息</h1>
          <ul>
            <li class="info-item" v-for="(info,index) in seller.infos">{{info}}</li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import star from '../../components/star/star.vue';
    import split from '../../components/split/split.vue';
    import Bscroll from 'better-scroll';
    import {saveTolocal, loadfromLoacl} from '../../common/js/store';
    export default {
      props: {
        seller: {
          type: Object
        }
      },
      computed: {
        favoriteText () {
          if (!this.favorite) {
            return '收藏';
          } else {
            return '已收藏';
          }
        }
      },
      methods: {
        _initScroll () {
          if (!this.scroll) {
            this.scroll = new Bscroll(this.$refs['seller'], {click: true});
          } else {
            this.scroll.refresh();
          }
        },
        _initPics () {
          if (this.seller.pics) {
            let picWidth = 120;
            let margin = 6;
            let width = (picWidth + margin) * this.seller.pics.length - margin;
            this.$refs['picList'].style.width = width + 'px';
            this.$nextTick(() => {
              if (!this.picScroll) {
                this.picScroll = new Bscroll(this.$refs['picWrapper'], {scrollX: true, eventPassthrough: 'verticacl'});
              } else {
                this.picScroll.refresh();
              }
            });
          }
        },
        toggleFavorite (event) {
          if (!event._constructed) {
            return;
          }
          this.favorite = !this.favorite;
          saveTolocal(this.seller.id, 'favorite', this.favorite);
        }
      },
      watch: {
        seller () {
          this._initScroll();// 当seller发生变化，执行scroll的初始化，
          this._initPics();
        }
      },
      data () {
        return {
          classMap: [],
          favorite: (() => {
              return loadfromLoacl(this.seller.id, 'favorite', 'false');
          })()
        };
      },
      created () {
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      },
      mounted () {
        this._initScroll();// ready中seller仍然是一个空对象，内部高度小于外部，scroll无效，并且ready优先级高于watch 2.0 废除ready,改用mounted
        this._initPics();
      },
      components: {
        star,
        split
      }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl'
  .seller
    position:absolute
    left:0
    top:174px
    overflow:hidden
    bottom:0
    width:100%
    .overview
      padding:18px
      position :relative
      .title
        margin-bottom:8px
        font-size:14px
        line-height 14px
        color:rgb(7,17,27)
      .desc
        font-size :0
        padding-bottom :18px
        border-1px(rgba(7,17,27,0.1))
        .star
          display :inline-block
          margin-right:8px
          vertical-align :top
        .text
          font-size:10px
          line-height :18px
          display :inline-block
          color:rgb(77,85,93)
          margin-right :12px
          vertical-align :top
      .remark
        display:flex
        justify-content :center
        padding-top:18px
        .block
          flex:1
          text-align :center
          border-right :1px solid rgba(7,17,27,0.1)
          &:last-child
            border:none
          h2
            line-height :10px
            font-size :10px
            color:rgb(157,153,159)
            margin-bottom:6px
          .content
            font-size:10px
            color:rgb(7,17,27)
            line-height:24px
            .stress
              font-size:24px
      .favorite
        position :absolute
        right:18px
        top:18px
        width:50px
        text-align :center
        .icon-favorite
          display:block
          font-size:24px
          line-height :24px
          color: #d4d6d9
          margin-bottom: 4px
          &.active
            color: #f01414
        .text
          line-height :10px
          font-size:10px
          color:rga(77,85,93)
    .bulletin
      padding:18px 18px 0 18px
      .title
        margin-bottom:8px
        line-height :14px
        color:rgb(7,17,27)
        font-size:14px
      .content-wrapper
        padding:0 12px 16px 12px
        border-1px(rgba(7,17,27,0.1))
        .content
          line-height :24px
          font-size:12px
          color:rgb(240,20,20)
          padding:8px 12px 16px 12px
      .supports
        .support-item
          padding:16px 12px
          border-1px(rgba(7,17,27,0.1))
          font-size:0
          &:last-child
            border-none()
          .icon
            display : inline-block
            vertical-align :top
            background-size :16px 16px
            background-repeat :no-repeat
            margin-right : 14px
            height : 16px
            width : 16px
            &.decrease
              bg-image('decrease_4')
            &.discount
              bg-image('discount_4')
            &.guarantee
              bg-image('guarantee_4')
            &.invoice
              bg-image('invoice_4')
            &.special
              bg-image('special_4')

          .text
            line-height:16px
            font-size:12px
    .pics
      padding:18px
      .title
        font-size:14px
        line-height 14px
        color:rgb(7,17,27)
        margin-bottom:12px
      .pic-wrapper
        width:100%
        overflow:hidden
        white-space :nowrap
        .pic-list
          font-size:0
          .pic-item
            margin-right :6px
            display:inline-block
            width:120px
            height:90px
            &:last-child
              margin-right:0
    .info
      padding:18px 18px 0 18px
      .title
        padding-bottom:12px
        line-height :14px
        border-1px(rgba(7,17,27,0.1))
        font-size:14px
      .info-item
        padding:16px 12px
        font-size:12px
</style>
