<template>
  <div v-loading="loading">
      <!-- 顶部栏 -->
    <div
      class="searchbar"
      style="background-image: url(https://s1.enbrands.com/statistic/assets/images/enbrands.png)"
    >
      <h1></h1>
      <div class="searchbar-slide " style="line-height: 60px;">
          <span class="icon-user"></span>
          <span ng-bind="userInfo.admin_name" class="ng-binding"
            >云积分:产品</span
          >
      </div>
    </div>

    <div class="navbox">
        <div class="foldTool"></div>
        <ul id="mainNav" class="mainNav">
            <li class="mainItem on">
                <p class="navName">
                    <span class="icon-Operations"></span>
                    <span class="menu-content">会员运营</span>
                </p>
                <dl class="subNav">
                    <dd ><a class="on">互动管理</a></dd>
                </dl>
            </li>
            <li class="mainItem">
                <p class="navName">
                    <span class="icon-Data-Management"></span>
                    <span class="menu-content">会员聚合</span>
                </p>
            </li>
            <li class="mainItem">
                <p class="navName">
                    <span class="icon-Equity"></span>
                    <span class="menu-content">权益特性</span>
                </p>
            </li>

        </ul>

    </div>

    <!-- 视图容器，就是开发用的路由在此处 -->
    <div class="vue-router-box" v-if="!loading">
        <router-view></router-view>
    </div>

  </div>
</template>

<script>
import ajax from '@jifenn/enbrands-interaction-tools/utils/ajax';
import Vue from 'vue';

export default {

    data(){
        return {
            loading: true,
        }
    },

    async created(){
        try{
            const res = await ajax.get('/apis/admin/info');
            this.loading = false;
            Object.defineProperty(Vue.prototype, 'userInfo', {
                get(){
                    return res.data;
                }
            });

        }catch(e){
            this.$message.error('初始化失败，jifenn-interaction-core -> frame -> create -> get /apis/admin/info');
            console.error(e);
        }
    }
};
</script>

<style>
.vue-router-box{
    position: absolute;
    left: 235px;
    top: 60px;
    bottom: 0;
    right: 0;
    overflow: auto;
}
</style>