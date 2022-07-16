<template>
  <el-dialog
    :visible="true"
    title="物流信息"
    width="400px"
    :show-close="status != 'LOADING'"
    @close="onClose"
    :close-on-press-escape="status != 'LOADING'"
    :close-on-click-modal="status != 'LOADING'"
  >
    <div
      v-loading="status == 'LOADING'"
      class="express-dialog"
      :class="{
        'express-sf': info.logistics && info.logistics.indexOf('顺丰') >= 0,
        'express-yt': info.logistics && info.logistics.indexOf('圆通') >= 0,
      }"
    >
      <div class="dialog-status">
        <div class="dialog-status-box">
          <el-form ref="form" :model="info" label-width="90px">
            <el-form-item label="物流公司：">
              <el-input
                v-model="info.logistics"
                maxlength="32"
                :readonly="!isEdit"
              />
            </el-form-item>
            <el-form-item label="物流单号：">
              <el-input v-model="info.logistics_no" :readonly="!isEdit" />
            </el-form-item>
          </el-form>

          <div class="mtop-10 red-base" v-if="error" align="center">
            <span class="icon-error"></span>
            <span v-html="error"></span>
          </div>
          <div v-if="isEdit" align="center">
            <el-button type="primary" @click="submit()">确认</el-button>
            <el-button @click="closeThisDialog()">取消</el-button>
          </div>

          <div align="center" v-if="!isEdit">
            <el-button type="primary" @click="closeThisDialog()"
              >确认</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
export default {
  props: ["onClose", "onReject", "params", "onOk"],
  data() {
    return {
      isEdit: false,
      status: "LOADING",
      info: {
        logistics: "",
      },
      error: "",
      visible: true,
    };
  },
  created() {
    this.init();
  },
  methods: {
    closeThisDialog() {
      this.onReject();
    },
    async init() {
      if (this.params.mode == "EDIT") {
        this.isEdit = true;
        this.status = "SUCCESS";
        this.info = {};
        this.info.order_id = this.params.order_id;
        this.info.user_id = this.params.user_id || "";
        this.info.log_id = this.params.log_id || "";
      } else {
        if (this.params.mode == "UPDATE") {
          this.isEdit = true;
        }
        this.status = "LOADING";
        const rsp = await ajax.post("/apis/exchange/logisticsinfo", {
          order_id: this.params.order_id,
        });

        if (rsp.code == "0") {
          this.status = "SUCCESS";
          this.info = rsp.data;
          this.info.order_id = this.params.order_id;
        } else {
          setTimeout(function () {
            this.$message.error("获取物流息失败，请重试");
            this.closeThisDialog();
          }, 300);
        }
      }
    },
    async submit() {
      if (!this.info.logistics || !this.info.logistics_no) {
        this.$message.error("请填写相关物流信息");
        return;
      }
      this.error = "";
      this.status = "LOADING";
      try {
        await ajax.post("/apis/exchange/editdelivery", this.info);
        this.$message.success("保存物流信息成功");
        this.onOk(this.info);
      } catch (e) {
        this.$message.eror(e.msg || e.message || "保存地址失败，请重试");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.express-dialog{
  transition: all .3s;
  margin-left: -20px;
  margin-top: -90px;
  margin-right: -20px;
  margin-bottom: -30px;
  padding: 30px 20px;
  padding-top: 80px;
}
.express-sf {
  border-bottom: none;
  position: relative;
  padding-top: 180px;
}

.express-sf:before {
  content: " ";
  display: block;
  height: 160px;
  background-image: url("//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/28f40bfeb1e2c288e87bf7ccf8a4c485.png");
  background-size: 100%;
  border-bottom: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}

.express-sf .el-button--primary {
  background-color: #000;
  border-color: #fff;
}

.express-yt {
  border-bottom: none;
  position: relative;
  padding-top: 180px;
}

.express-yt:before {
  content: " ";
  display: block;
  height: 160px;
  background-image: url("//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/4d3da00f92147b0dcd9f9c0e7f69f510.png");
  background-size: 100%;
  border-bottom: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}

.express-yt .el-button--primary {
  background-color: #48166d;
  border-color: #fff;
}
</style>