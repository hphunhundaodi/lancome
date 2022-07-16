<template>
  <div>
    <el-dialog
      class="yi-dialog"
      title="选择商品"
      :visible="visible"
      width="1000px"
      :before-close="handleClose"
      append-to-body
    >
      <div v-loading="isLoading">
        <form class="mtop-20">
          <div class="input-edit-box">
            <el-input
              v-model="name"
              maxlength="32"
              style="width: 300px"
              placeholder="请输入内容"
              @focus="onInputFocus"
            ></el-input>
            <div class="extra-box" v-show="showExtraBar">
              <div
                class="extra-box-item"
                @click="searchGoodsWithMode('全部商品')"
              >
                全部商品
                <p>展示所有店铺商品</p>
              </div>
              <div
                class="extra-box-item"
                @click="searchGoodsWithMode('普通商品')"
              >
                普通商品
                <p>查询商品名中不带“预售”的商品</p>
              </div>
              <div
                class="extra-box-item"
                @click="searchGoodsWithMode('预售商品')"
              >
                预售商品
                <p>查询商品名中带“预售”的商品</p>
              </div>
            </div>
          </div>
          <el-button
            type="primary"
            plain
            style="margin-left: 1em"
            @click="queryList(1)"
            >查询</el-button
          >
          <span class="mleft-d5">
            共
            <span class="red-base">{{ total }}</span>
            个商品
          </span>
          <div class="i-fr">
            <el-button type="primary" @click="syncGoods">同步商品</el-button>
          </div>
        </form>
        <!-- 表格 -->
        <el-table
          :header-cell-style="{ background: '#ededed' }"
          :data="list"
          style="width: 100%; font-size: 12px; margin-top: 20px"
        >
          <template slot="empty">
            <p>暂无数据</p>
          </template>
          <el-table-column prop="id" label="图片预览" width="100">
            <template slot-scope="scope">
              <div
                style="
                  background-position: center;
                  background-repeat: no-repeat;
                  background-size: contain;
                  width: 80px;
                  height: 50px;
                "
                :style="{ backgroundImage: `url(${scope.row.pic_url})` }"
              ></div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称">
            <template slot-scope="scope">
              <a :href="scope.row.url" target="_blank">{{ scope.row.name }}</a>
            </template>
          </el-table-column>
          <el-table-column label="售价" width="120">
            <template slot-scope="scope">
              <span>￥{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="操作"
            width="100"
            style="text-align: center"
          >
            <template slot-scope="scope">
              <button
                class="i-btn"
                v-if="!scope.row.selectedStatus"
                @click="selectItem(true, scope.row)"
              >
                选择
              </button>
              <button
                class="i-btn-primary"
                v-if="scope.row.selectedStatus"
                @click="selectItem(false, scope.row)"
              >
                已选
              </button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block clfix" style="margin-top: 20px">
          <el-pagination
            v-show="total != 0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page_num"
            :page-size="page_size"
            layout="total, prev, pager, next"
            :total="total"
            style="display: inline-block"
          ></el-pagination>
          <span style="float: right">
            <button class="i-btn-primary mright-1" @click="onOk(goodArr)">
              确定
            </button>
            <button class="i-btn" @click="onClose()">取消</button>
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import "./index.less";
import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
import { getGoodsList } from "../../../../api/lankou";

export default {
  data() {
    return {
      visible: true,
      page_num: 1,
      page_size: 5,
      total: 0,
      list: [],
      goodArr: JSON.parse(JSON.stringify(this.params.goodsList)),
      isLoading: false,
      searchMode: -1, //搜索模式 0 普通搜索， 2 普通商品， 1 预购商品
      showExtraBar: false, // 输入控件弹层
      name: "", // 查询条件
    };
  },
  created() {
    const { searchMode = "" } = this.params;
    switch (searchMode.toString()) {
      case "0":
        this.searchGoodsWithMode("全部商品");
        break;
      case "1":
        this.searchGoodsWithMode("预售商品");
        break;
      case "2":
        this.searchGoodsWithMode("普通商品");
        break;
      default:
        this.queryList();
    }
  },
  props: ["onOk", "onClose", "params"],
  methods: {
    handleClose() {
      this.onClose();
    },
    async queryList(page_num) {
      this.isLoading = true;
      this.page_num = page_num || this.page_num;

      let name, buy_type;

      if (this.searchMode == 2) {
        // 普通商品
        buy_type = 2; // 2为不include
        name = "预售"; // 2为不include
      } else if (this.searchMode == 1) {
        // 预售商品
        buy_type = 1; // 1为include
        name = "预售"; //
      } else if (this.searchMode == 0) {
        // 全部商品
        buy_type = 1; // 1为include
        name = ""; //
      } else {
        buy_type = 1;
        name = this.name;
      }

      try {
        const { data } = await getGoodsList({
          name,
          buy_type,
          page_size: this.page_size,
          page_num: this.page_num,
        });
        this.list = data.list.map((item) => {
          item.url = "//item.taobao.com/item.htm?id=" + item.good_id;
          item.selectedStatus = this.goodArr.some(
            (_) => _.good_id == item.good_id
          );
          return item;
        });
        this.total = data.count;
      } catch (e) {
        this.list = [];
        this.total = 0;
        this.page_num = 1;
      }
      this.isLoading = false;
    },

    async syncGoods() {
      await this.$confirm(
        "同步商品可能会是一个长耗时的操作，再同步过程中尽量不要进行任何操作",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          title: "商品同步提醒",
        }
      );

      this.isLoading = true;
      try {
        await ajax.post("/apis/good/syncgoods");
        this.queryList(1);
      } catch (error) {
        console.warn(error);
        this.$message.error(error.msg);
      }
      this.isLoading = false;
    },

    selectItem(symbol, good) {
      this.goodArr = [];
      if (good.selectedStatus) {
        this.list.forEach((el) => {
          this.$set(el, "selectedStatus", false);
        });
      } else {
        this.list.forEach((el) => {
          this.$set(el, "selectedStatus", false);
          if (good.id == el.id) {
            this.$set(el, "selectedStatus", true);
            return this.goodArr.push(el);
          }
        });
      }

      // if (symbol) {
      //   this.goodArr.push(good);
      // } else {
      //   this.goodArr = this.goodArr.filter(function (item) {
      //     return item.good_id != good.good_id;
      //   });
      // }

      const item =
        this.list.filter((item) => item.good_id == good.good_id)[0] || {};
      item.selectedStatus = symbol;
    },

    handleSizeChange(val) {
      this.page_num = val;
      this.queryList(this.input);
    },

    handleCurrentChange(val) {
      this.page_num = val;
      this.queryList(this.input);
    },

    searchGoodsWithMode(key) {
      this.searchMode = {
        普通商品: 2,
        预售商品: 1,
        全部商品: 0,
      }[key];
      this.name = key;
      this.queryList(1);
      this.showExtraBar = false;
    },

    onInputFocus() {
      this.name = "";
      this.showExtraBar = true;
      this.searchMode = -1;

      const mouseup = () => {
        const fn = () => {
          this.showExtraBar = false;
          document.body.removeEventListener("click", fn);
        };
        document.body.addEventListener("click", fn);
        document.body.removeEventListener("mousedown", mouseup);
      };

      document.body.addEventListener("mousedown", mouseup);
    },
  },
};
</script>
