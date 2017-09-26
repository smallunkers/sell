<!--评价页-->
<template>
    <div class="ratings" ref="ratings">
        <div class="ratings-content">
          <div class="overview">
            <div class="overview-left">
              <h1 class="score">{{seller.score}}</h1>
              <div class="title">综合评价</div>
              <div class="rank">高于周围商家{{seller.rankRate}}%</div>
            </div>
            <div class="overview-right">
              <div class="score-wrapper">
                <span class="desc">服务态度</span>
                <star :size="36" :score="seller.serviceScore"></star>
                <span class="score">{{seller.serviceScore}}</span>
              </div>
              <div class="score-wrapper">
                  <span class="desc">商品评分</span>
                  <star :size="36" :score="seller.foodScore"></star>
                  <span class="score" >{{seller.foodScore}}</span>
              </div>
              <div class="delivery-wrapper">
                  <span class="desc">送达时间</span>
                  <span class="deliverytime">{{seller.deliveryTime}}</span>
              </div>
            </div>
          </div>
          <split></split>
            <ratingselect :select-type="selectType" :only-content="onlyContent"  :ratings="ratings" @eventSelectType="selectRating" @eventToggleContent="toggleContent"></ratingselect>
            <div class="rating-wrapper">
              <ul>
                <li class="rating-item"  v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings">
                  <div class="avatar">
                    <img :src="rating.avatar"  width="28" height="28">
                  </div>
                  <div class="content">
                    <div class="user">
                      <span class="time">{{rating.rateTime | formatDate}}</span>
                      <span class="name">{{rating.username}}</span>
                    </div>
                    <div class="star-wrapper">
                      <star :size="24" :score="rating.score"></star>
                      <span v-show="rating.deliveryTime" class="deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                    </div>
                    <p class="text">{{rating.text}}</p>
                    <div class="recommend"  v-show="rating.recommend.length">
                      <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}" ></span>
                      <span class="item" v-for="item in rating.recommend">{{item}}</span>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="no-rating" v-show="!ratings || !ratings.length">暂无评价</div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import star from '../star/star.vue';
    import split from '../split/split.vue';
    import ratingselect from '../ratingselect/ratingselect.vue';
    import {formatDate} from '../../common/js/date.js';
    import BScroll from 'better-scroll';
    const ALL = 2;
    const ERR_OK = 0;

    export default {
      props: {
        seller: {
          type: Object
        }
      },
      methods: {
        selectRating (type) {
          this.selectType = type;
          this.$nextTick(() => {
            this.scroll.refresh();
          });
        },
        toggleContent () {
          this.onlyContent = !this.onlyContent;
          this.$nextTick(() => {
            this.scroll.refresh();
          });
        },
        needShow (type, text) {
          if (this.onlyContent && !text) {
            return false;  // 需要展示有内容的评价，但没有内容就返回false
          }
          if (this.selectType === ALL) {
            return true; // 显示所有
          } else {
            return type === this.selectType;   // 每条评论selectType ==== this.selectType
          }
        }
      },
      filters: {
        formatDate (time) {
          let date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm');
        }
      },
      data () {
        return {
          ratings: [],
          selectType: ALL,
          onlyContent: true
        };
      },
      created () {
        this.$http.get('/api/ratings').then((response) => {
          response = response.body;
          if (response.errno === ERR_OK) {
            this.ratings = response.data;
            this.$nextTick(() => {
              this.scroll = new BScroll(this.$refs['ratings'], {click: true});
            });
          }
        });
      },
      components: {
        star,
        split,
        ratingselect
      }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl"
.ratings
  position:absolute
  top:174px
  bottom :0
  width:100%
  left:0
  overflow:hidden
  .overview
    display :flex
    padding:18px 0
    .overview-left
      width:137px
      flex:0,0,137px
      border-right:1px solid rgba(7,17,27,0.1)
      @media only screen and (max-width :320px)
          flex:0 0 120px
          width:120px
      .score
        font-size :24px
        line-height :28px
        margin-bottom:6px
        color:rgb(255,153,0)
        text-align : center
      .title
        font-size :12px
        color:rgb(7,17,27)
        line-height:12px
        margin-bottom:8px
        text-align :center
      .rank
        font-size:10px
        color:rgba(7,17,27,0.2)
        line-height:10px
        margin-bottom :6px
        text-align :center
    .overview-right
      flex:1,0,auto
      padding:0 24px 16px 24px
      @media only screen and (max-width :320px)
        padding-right:6px
        padding-left:6px
      .score-wrapper
        font-size:0
        margin-bottom :8px
        .desc
          font-size:12px
          line-height :18px
          color:rgb(1,17,27)
          margin-right:12px
          font-weight :700
        .score
          font-size:12px
          line-height :18px
          color:rgb(255,153,0)
          margin-left:12px
          @media only screen and (max-width :320px)
            margin-left:6px
        .star
          display:inline-block
          vertical-align :top
      .delivery-wrapper
        .desc
           font-size:12px
           line-height :18px
           color:rgb(1,17,27)
           font-weight :700
           margin-right :12px
        .deliverytime
          font-size:18px
          line-height :18px
          color:rgba(7,17,27,0.3)
          font-weight :700
  .rating-wrapper
    padding:0 18px
    .rating-item
      display:flex
      padding:18px 0
      border-1px(rgba(7,17,27,0.1))
      overflow:hidden
      .avatar
        flex:0 0 28px
        margin-right :12px
        img
          border-radius :50%
      .content
        flex:1
        position:relative
        .user
          .name
            margin-bottom :4px
            line-height :12px
            font-size:10px
            color:rgb(7,17,27)
          .time
            font-size :10px
            line-height :12px
            font-weight :200
            position :absolute
            top:0
            right:0
            color:rgb(147,153,159)
        .star-wrapper
          margin-bottom :6px
          font-size:0
          .star,.deliveryTime
            display:inline-block
            vertical-align :top
          .star
            margin-bottom:4px
          .deliveryTime
            font-size: 10px
            font-weight:200p
            line-height: 12px
            color:rgb(147,153,159)


        .text
          font-size: 12px
          line-height:18px
          color:rgb(7,17,27)
          margin-bottom :8px
        .recommend
          line-height :16px
          font-size:0
          .icon-thumb_up,.icon-thumb_down
            font-size:9px
            display :inline-block
            margin:0 8px 4px 0
          .icon-thumb_up
            color :rgb(0,160,220)
          .icon-thumb_down
            color :rgb(183,187,191)
          .item
            display:inline-block
            font-size:9px
            line-height:16px
            background :#ffffff
            border:1px solid rgba(7, 17, 27, 0.1)
            color:rgb(147,153,159)
            border-radius: 2px
            margin-right: 6px
            margin-bottom: 6px
            padding: 0 3px
</style>
