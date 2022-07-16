<template>
  <div class="container" style="min-height: 65vh">
    <div class="common-breadcoumb">
      <a>互动游戏</a> &gt;
      <span>互动列表</span>
    </div>

    <!-- 搜索项 -->
    <div class="search-wrap mtop-20">
      <div class="query">
        <el-form :inline="true" :model="query" size="small">
          <el-form-item label="互动类型：">
            <el-select v-model="query.activity_id" placeholder="请选择">
              <el-option
                v-for="item in game_list"
                :key="item.activity_id"
                :label="item.name"
                :value="item.activity_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="互动状态：">
            <el-select v-model="query.status" placeholder="请选择">
              <el-option
                v-for="item in interactionStateArr"
                :key="item.status"
                :label="item.title"
                :value="item.status"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="互动名称：">
            <el-input
              v-model="query.name"
              placeholder="请输入活动名称关键字搜索"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onQuery">查询</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" @click="onCreate">新建互动游戏</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-wrap">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="互动活动名称"></el-table-column>
        <el-table-column prop="begin_at" label="活动有效期">
          <template slot-scope="scope">
            <div>{{ scope.row.begin_at }}至</div>
            <div>{{ scope.row.end_at }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="num" label="参与人数"></el-table-column> -->
        <el-table-column prop="card_count" label="互动类型">
          <template slot-scope="scope">
            <span>{{ scope.row.activity_type }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="award_count" label="活动状态">
          <template slot-scope="scope">
            <span>{{
              ["", "未发布", "未开始", "暂停", "进行中", "已结束"][
                scope.row.status
              ]
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <game-setting
              :is="component"
              :row="scope.row"
              :updateInteractionList="getList"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="pagination" style="margin-top: 20px; margin-bottom: 50px">
        <el-pagination
          align="center"
          @size-change="handleSizeChange"
          @current-change="pageTo"
          :current-page.sync="query.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.pageSize"
          layout="prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
import game_list from "./interactionGameList.js";
import component from "../src/tools";
const PAUSE_TMPL =
  "<p>当前活动已发布，编辑时活动会暂停，编辑后需要重新发布活动</p>";
const CLOSE_TMPL =
  "<p>活动结束后将不可重新启用,只能查看该活动的一些相关信息</p><p>确认结束活动吗？</p>";
const DELETE_TMPL =
  "<p>如果该活动已经发布，活动删除后，您将无法在列表中找到它</p><p>确认结束活动吗？</p>";
export default {
  data() {
    const userInfo = {};
    // window.$rootScope.userInfo || {};
    return {
      component: component, //this.$$jifenn_game_tools,
      game_map: game_list.game_map,
      game_list: game_list.game_list,

      userInfo: userInfo,
      published_status: [2, 3, 4, 5], // 1 未发布，2 暂停，3 发布，4 结束 0 创建中 5 进行中
      canBeDelete: [2, 3, 5],
      query: {
        name: "",
        activity_id: "",
        status: "",
        page: 1,
        page_size: 20,
        // scence_id: this.$$jifenn_game_defined.scence_id,
      },
      total: 0, // 总条数
      tableData: [],
      interactionStateArr: [
        {
          title: "全部",
          status: "",
        },
        {
          title: "创建中",
          status: "0",
        },
        {
          title: "未发布",
          status: "1",
        },
        {
          title: "未开始",
          status: "2",
        },
        {
          title: "暂停",
          status: "3",
        },
        {
          title: "进行中",
          status: "4",
        },
        {
          title: "已结束",
          status: "5",
        },
      ],
    };
  },
  components: {
    tools: component,
  },
  created() {
    this.getList();
    this.game_list = JSON.parse(JSON.stringify(this.game_list));
    this.game_list.unshift({
      name: "全部",
      activity_id: "",
    });
  },
  methods: {
    async getList(isQuery) {
      try {
        // 如果是提交查询，则页码需要归位
        if (isQuery) {
          this.query.page = 1;
        }

        // 判断店铺类型  1：淘宝  2：京东
        let api = "/apis/activity/list";

        const res = await ajax.get(api, this.query);
        this.tableData = res.data.list;
        this.total = res.data.total;
      } catch (e) {
        console.log("e", e);
      }
    },
    onQuery() {
      this.getList(true);
    },
    async copyUrl(item) {
      // 针对JD二维码key进行转换
      if (window.$$INFO.platform_type == 2) {
        item = JSON.parse(
          JSON.stringify(item).replace(/applet_url/g, "jd_applet_url")
        );
      }
      console.info(item);
      //   await openCopyUrl(item);
    },
    //互动记录
    goRecord(item) {
      // $state.go("operations/interaction_game.record", { id: item.id ,activity_id:item.activity_id});
      location.hash = `#/operations/interaction_game/record/${
        item.activity_id
      }/${item.id}?name=${item.name}&begin_at=${encodeURIComponent(
        item.begin_at
      )}&end_at=${encodeURIComponent(item.end_at)}`;
    },
    //数据统计
    goStats(item) {
      location.hash = `#/operations/interaction_game/stats/${
        item.activity_id
      }/${item.id}?name=${item.name}&begin_at=${encodeURIComponent(
        item.begin_at
      )}&end_at=${encodeURIComponent(item.end_at)}`;
    },
    updateInteractionList() {
      this.getList();
    },
    // 许愿购物袋中奖记录
    goReward(item) {
      location.hash = `#/operations/interaction_game/reward/${
        item.activity_id
      }/${item.id}?name=${item.name}&begin_at=${encodeURIComponent(
        item.begin_at
      )}&end_at=${encodeURIComponent(item.end_at)}`;
    },
    //暂停或启用
    async isPublishPause(item) {
      let postUrl = "";
      // 判断店铺类型  1：淘宝  2：京东
      if (window.$$INFO.platform_type == 1) {
        if (item.status == 2 || item.status == 1) {
          postUrl = "/activity-api/basic/instance/publish";
        } else {
          postUrl = "/activity-api/basic/instance/pause";
        }
      } else if (window.$$INFO.platform_type == 2) {
        if (item.status == 2 || item.status == 1) {
          postUrl = "/admin/basic/instance/publish";
        } else {
          postUrl = "/admin/basic/instance/pause";
        }
      }

      try {
        const res = await ajax.post(postUrl, { activity_instance_id: item.id });
        this.getList();
        this.$message({
          message: res.msg,
          type: "success",
        });
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    //结束活动
    async stopActivity(id) {
      try {
        await this.$confirm(CLOSE_TMPL, "操作确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          center: true,
          customClass: "dialog-width-500",
        });
        // 判断店铺类型  1：淘宝  2：京东
        let postUrl = "";
        if (window.$$INFO.platform_type == 1) {
          postUrl = "/activity-api/basic/instance/stop";
        } else if (window.$$INFO.platform_type == 2) {
          postUrl = "/admin/basic/instance/stop";
        }
        const res = await ajax.post(postUrl, { activity_instance_id: id });
        this.getList();
        this.$message({
          message: res.msg,
          type: "success",
        });
      } catch (err) {
        if (err == "cancel") return false;
        console.warn(err);
        this.$message.error(err.msg);
      }
    },
    //删除活动
    async deleteActivity(id) {
      try {
        await this.$confirm(DELETE_TMPL, "操作确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          center: true,
          customClass: "dialog-width-500",
        });
        // 判断店铺类型  1：淘宝  2：京东
        let postUrl = "";
        if (window.$$INFO.platform_type == 1) {
          postUrl = "/activity-api/basic/instance/delete";
        } else if (window.$$INFO.platform_type == 2) {
          postUrl = "/admin/basic/instance/delete";
        }
        const res = await ajax.post(postUrl, { activity_instance_id: id });
        this.getList();
        this.$message({
          message: res.msg,
          type: "success",
        });
      } catch (err) {
        if (err == "cancel") return false;
        console.warn(err);
        this.$message.error(err.msg);
      }
    },
    //创建活动
    onCreate() {
      this.$router.push({
        path: "/guide",
      });
    },
    //跳页
    pageTo(val) {
      console.log(`当前页: ${val}`);
      this.query.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.query.page_size = val;
      this.getList();
    },

    //编辑
    async editor(item) {
      if (item.status == "5") {
        // 进行中的需要先暂停
        try {
          // let tmpl = PAUSE_TMPL.replace("[item.name]", item.name);
          await this.$confirm(PAUSE_TMPL, "操作确认", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            dangerouslyUseHTMLString: true,
            center: true,
            customClass: "dialog-width-500 text-center",
          });

          // 判断店铺类型  1：淘宝  2：京东
          let postUrl = "";
          if (window.$$INFO.platform_type == 1) {
            postUrl = "/activity-api/basic/instance/pause";
          } else if (window.$$INFO.platform_type == 2) {
            postUrl = "/admin/basic/instance/pause";
          }
          await ajax.post(postUrl, { activity_instance_id: item.id });
          this.$message({
            message: "暂停成功",
            type: "success",
          });
          //   $state.go("operations/interaction_game.editor", {
          //     activity_id: item.activity_id,
          //     step: 1,
          //     id: item.id,
          //   });
        } catch (err) {
          if (err == "cancel") return false;
          console.warn(err);
          this.$message.error(err.msg);
        }
      } else {
        // $state.go("operations/interaction_game.editor", {
        //   activity_id: item.activity_id,
        //   step: 1,
        //   id: item.id,
        // });
      }
    },
    onChange(item) {
      console.log(item);
    },
  },
};
</script>

<style  scoped  lang="less">
.search-wrap > .activity {
  line-height: 45px;
}
.search-wrap > .query {
  margin-top: 15px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.dialog-width-500 {
  width: 500px;
}

.dialog-width-500 .el-message-box__content {
  text-align: left;
}
.text-center .el-message-box__content {
  text-align: center;
}
.data_url {
  display: inline-block;
  width: 100%;
  text-decoration: none;
  color: #606266;
}
</style>

