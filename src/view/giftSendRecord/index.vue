<template>
  <div class="container" style="min-height: 90vh">
    <el-breadcrumb
      class="common-breadcoumb"
      separator-class="el-icon-arrow-right"
      style="line-height: 45px"
    >
      <el-breadcrumb-item :to="{ path: '/' }">互动活动</el-breadcrumb-item>
      <el-breadcrumb-item>兰蔻会员抽奖</el-breadcrumb-item>
      <el-breadcrumb-item>兰蔻双11 活动</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="orderRemark-page-title">中奖记录</div>
    <div class="export_tips">
      由于平台要求，系统将不在提供导出记录功能，如有业务需要，请联系客户支持
    </div>

    <div class="search-wrap mtop-20">
      <div class="query">
        <el-form :inline="true" :model="query" ref="query" size="small">
          <el-form-item label="中奖类型：" prop="reward_level">
            <el-select
              v-model="query.reward_level"
              placeholder="请选择"
              style="width: 110px"
            >
              <el-option label="全部" value="" />
              <el-option label="一等奖" :value="1" />
              <el-option label="二等奖" :value="2" />
              <el-option label="三等奖" :value="3" />
              <el-option label="四等奖" :value="4" />
              <el-option label="五等奖" :value="5" />
            </el-select>
          </el-form-item>
          <el-form-item label="手机号码：" prop="mobile">
            <el-input
              v-model="query.mobile"
              placeholder="请输入手机号"
              maxlength="11"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="抽奖时间：" prop="date">
            <el-date-picker
              v-model="query.date"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="同步状态：" prop="oms_state">
            <el-select
              v-model="query.oms_state"
              placeholder="请选择"
              style="width: 110px"
            >
              <el-option label="全部" value="" />
              <el-option label="待发放" :value="1" />
              <el-option label="已取消" :value="2" />
              <el-option label="已发放" :value="3" />
              <el-option label="发放失败" :value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="同步时间：" prop="date_sync">
            <el-date-picker
              v-model="query.date_sync"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="queryList" v-loading="loading"
              >查询</el-button
            ><el-button @click="$refs.query.resetFields()">重置</el-button>
          </el-form-item>

          <span class="table_summary">
            共 <span>{{ total }}</span> 记录
          </span>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->

    <div class="table-wrap">
      <el-table
        :data="tableData"
        border
        row-key="id"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="member.username"
          label="手机号"
        ></el-table-column>
        <el-table-column
          prop="member_merchant_bind.ouid"
          label="OUID"
        ></el-table-column>
        <el-table-column prop="reward_level" label="中奖类型">
          <template slot-scope="scope">
            <span>
              {{ rewardLevel(scope) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="draw_reward.gift_name"
          label="奖品名称"
        ></el-table-column>
        <el-table-column prop="created_at" label="抽奖时间"></el-table-column>
        <el-table-column
          prop="order_detail.order.platform_order_id"
          label="订单号"
        ></el-table-column>
        <el-table-column
          prop="order_detail.order.payment"
          label="订单金额"
        ></el-table-column>
        <el-table-column prop="order_detail.order.status" label="订单状态">
          <template slot-scope="scope">
            <span>
              {{ rewardOrder(scope) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="oms_state" label="发放状态">
          <template slot-scope="scope">
            <span>
              {{ rewardOms(scope) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="delivery_info" label="收货信息">
          <template slot-scope="{ row }">
            <div v-if="row.delivery_info">
              <div>姓名：{{ row.delivery_info.name }}</div>
              <div>电话：{{ row.mobile }}</div>
              <div>
                地区：{{ row.delivery_info.province }}
                {{ row.delivery_info.city }} {{ row.delivery_info.district }}
              </div>
              <div>详细：{{ row.delivery_info.address }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="oms_date" label="同步时间"></el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="pagination" style="margin-top: 20px; margin-bottom: 50px">
        <el-pagination
          align="right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.page_num"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
import { getActRewardList } from "../../api/lankou";
const level = ["一等奖", "二等奖", "三等奖", "四等奖", "五等奖"];
const rewardStatus = ["待发放", "已取消", "", "已发放", "发放失败"];
const omsStatus = ["", "已取消", "OMS待传输", "OMS已传输", "OMS传输失败"];
const orderStatus = [
  "等待买家付款",
  "卖家部分发货",
  "等待卖家发货",
  "等待买家确认收货",
  "买家已签收",
  "交易成功",
];
export default {
  data() {
    // const { activity_name, activity_id } = this.$route.query;
    return {
      loading: false,
      query: {
        activity_id: "",
        reward_level: "", // 中奖类型
        mobile: "", // 手机号
        win_prize_start_date: "", // 抽奖开始时间
        win_prize_end_date: "", // 抽奖结束时间
        oms_start_date: "", // oms同步开始时间
        oms_end_date: "", // oms同步结束时间
        oms_state: "", // OMS同步状态（1已取消，2待传输，3已传输，4传输失败）
        date: [],
        date_sync: [],
        page_size: 10,
        page_num: 1,
      },
      total: 0, // 总条数
      tableData: [],
    };
  },
  watch: {
    "query.date": function (val) {
      if (val) {
        this.query.win_prize_start_date = val[0];
        this.query.win_prize_end_date = val[1];
      } else {
        this.query.win_prize_start_date = "";
        this.query.win_prize_end_date = "";
      }
    },
    "query.date_sync": function (val) {
      if (val) {
        this.query.oms_start_date = val[0];
        this.query.oms_end_date = val[1];
      } else {
        this.query.oms_start_date = "";
        this.query.oms_end_date = "";
      }
    },
    "$route.query.activity_id": {
      immediate: true,
      handler(val) {
        this.query.activity_id = val;
      },
    },
  },
  created() {
    // getActRewardListType({ activity_id: this.$route.query.activity_id })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   })
    //   .finally(() => (this.loading = false));
    this.getList();
  },
  methods: {
    rewardOrder(val) {
      return orderStatus[val.row.oms_state - 1];
    },
    rewardOms(val) {
      if (val.row.reward_level < 0) return;
      if (val.row.reward_level < 4) {
        return rewardStatus[val.row.oms_state];
      } else if (val.row.reward_level == 4) {
        return omsStatus[val.row.oms_end_date];
      } else {
        return rewardStatus[val.row.oms_state];
      }
    },
    rewardLevel(val) {
      return level[val.row.reward_level - 1];
    },
    getList() {
      this.loading = true;

      let data = Object.assign({}, this.query);
      delete data.date;
      delete data.date_sync;
      return getActRewardList(data)
        .then((res) => {
          this.total = res.data.count;
          res.data.list.forEach((it) => {
            try {
              it.delivery_info = JSON.parse(it.delivery_info);
            } catch (e) {
              it.delivery_info = null;
            }
          });
          this.tableData = res.data.list;
        })
        .catch((e) => {
          this.total = 0;
          this.tableData = [];
          this.$message.error(e.msg || e.$message || "获取列表失败");
        })
        .finally(() => (this.loading = false));
    },
    resetForm() {
      this.$refs.queryform.resetFields();
    },

    async updateReward() {
      for (let i of this.tableData) {
        try {
          const { rewards } = await ajax.get("/apis/activity/awardbylog", {
            log_id: i.log_id,
          });

          i.rewards = rewards;
        } catch (e) {
          console.error("get /apis/activity/awardbylog error", i.log_id);
        }
      }
    },

    queryList() {
      this.query.page_num = 1;
      this.getList();
    },

    goback() {
      this.$router.push({
        path: "/",
      });
    },

    handleSizeChange(val) {
      this.query.page_num = 1;
      this.query.page_size = val;
      this.getList();
    },

    handleCurrentChange(val) {
      this.query.page_num = val;
      this.getList();
    },
  },
};
</script>

<style scoped>
.orderRemark-page-title {
  border-left: 3px solid #09f;
  padding-left: 14px;
  margin: 30px 0;
  margin-bottom: 45px;
  height: 24px;
  line-height: 24px;
  font-size: 22px;
}

.search-wrap > .activity {
  line-height: 45px;
}
.search-wrap > .query {
  margin-top: 15px;
  line-height: 30px;
}

.export_tips {
  color: red;
  font-size: 18px;
  margin-bottom: 20px;
}

.table_summary span {
  color: red;
}

.status-success {
  color: #67c23a;
}
.status-fail {
  color: #f56c6c;
}
</style>
