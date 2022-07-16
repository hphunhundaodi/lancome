<template>
  <div class="container clfix" v-loading="isLoading">
    <div class="common-breadcoumb" style="border-bottom: none">
      <a v-on:click="gotoList">互动列表</a> &gt;
      <span>选择互动类型</span>
    </div>
    <div class="interaction-type-list">
      <ul>
        <li class="interaction-card" :class="{ new: item.is_new }" v-for="(item, index) in list" :key="index">
          <div class="mobile-img">
            <img :src="item.img_url" />
          </div>
          <div class="decorate-content">
            <p class="content-title">{{ item.name }}</p>
            <div class="content-details">{{ item.description }}</div>
            <div class="creat-btn-content" style="bottom:50px">
              <el-button type="primary" @click="handleOnActTypeCardClick(item)" size="small">{{ item.is_new ? "抢先体验" : "新建互动" }}</el-button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [this.$$jifenn_game_defined],
    };
  },
  created() {
    console.info("data.list", this);
  },
  methods: {
    goback() {
      // $state.go('operations/interaction_game')
    },
    handleOnActTypeCardClick() {
      this.$router.push({
        path: "/create",
      });
      // $state.go('operations/interaction_game.create', { activity_id: item.activity_id, step: 1 })
    },
  },
};
</script>
<style scoped>
@keyframes interaction-type-list-item-in {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.container {
  background: #fafafa;
  border: none;
  padding: 20px;
  margin: 0;
}

.interaction-type-list {
  padding: 10px 0;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
}

.interaction-type-list ul {
  padding-left: 10px;
  animation: interaction-type-list-item-in 0.3s forwards;
}

.interaction-type-list li {
  position: relative;
  overflow: hidden;
  float: left;
  box-shadow: 0 0 10px rgb(0 0 0 / 10%);
  height: 290px;
  width: 350px;
  margin-right: 21px;
  margin-bottom: 21px;
  padding: 10px;
  border: 1px solid #fff;
  color: #575757;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  border-radius: 15px;
  background-color: #fff;
}

.interaction-type-list li .mobile-img {
  float: left;
  width: 200px;
  height: 350px;
  padding-top: 20px;
  overflow: hidden;
  text-align: center;
  background: url(//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/TB2irkKgBHH8KJjy0FbXXcqlpXa-58820053.png) no-repeat center center/100% 100%;
  transition: all 0.3s;
}

.interaction-type-list li .mobile-img img {
  width: 90%;
  margin-top: 41px;
}

.interaction-type-list li .decorate-content {
  float: left;
  width: 135px;
  height: 330px;
  padding-left: 10px;
  position: relative;
}

.interaction-type-list li .content-title {
  margin-top: 50px;
  font-size: 20px;
}

.interaction-type-list li .content-details {
  margin-top: 20px;
}

.interaction-type-list li .creat-btn-content {
  margin-top: 20px;
  text-align: center;
  position: absolute;
  bottom: 100px;
  left: 0;
  width: 100%;
}

.interaction-type-list li:hover {
  border: 1px solid #3498db;
  transform: scale(0.98);
}

.interaction-type-list li:hover .content-title {
  color: #3498db;
}

.interaction-type-list {
  padding: 10px 0;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
}

.interaction-card.new::before {
  content: "NEW";
  letter-spacing: 1px;
  display: block;
  position: absolute;
  height: 50px;
  line-height: 40px;
  text-align: center;
  width: 100px;
  /* background-color: #ff5722; */
  background-color: #64c70c;
  color: #fff;
  font-size: 16px;
  transform: rotate(-45deg);
  left: -32px;
  top: -8px;
  padding-top: 14px;
  box-sizing: border-box;
}
</style>
