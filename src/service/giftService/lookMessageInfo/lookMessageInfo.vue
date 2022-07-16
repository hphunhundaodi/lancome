<template>
  <el-dialog
    :visible="true"
    title="短信信息"
    width="400px"
    :show-close="status != 'LOADING'"
    @close="onClose"
    :close-on-press-escape="status != 'LOADING'"
    :close-on-click-modal="status != 'LOADING'"
  >
    <div v-loading="status == 'LOADING'" class="express-dialog">
      <div class="dialog-status">
        <div class="dialog-status-box">
          <el-form ref="form" :model="info" label-width="110px">
            <el-form-item label="短信发送时间：">
              {{ info.send_time }}
            </el-form-item>
            <el-form-item label="短信发送内容：">
              {{ info.content }}
            </el-form-item>
          </el-form>
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
      this.status = "LOADING";
      const rsp = await ajax.get(
        "/newenbrands/apis/hdactivity/get-sms-content",
        {
          order_id: this.params.orderId,
        }
      );
      if (rsp.code == "0") {
        this.status = "SUCCESS";
        this.info = rsp.data;
      } else {
        setTimeout(function () {
          this.$message.error("获取短信消息失败，请重试");
          this.closeThisDialog();
        }, 300);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.express-dialog {
  transition: all 0.3s;
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