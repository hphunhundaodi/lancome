<template>
  <div class="add-phone-box" v-loading="loading">
    <div class="phone-input">
      <div class="label">接收短信的手机号：</div>
      <div class="form-content">
        <el-input
          type="text"
          name="phone"
          maxlength="11"
          style="width: 200px"
          v-model="phone"
        />
      </div>
    </div>
    <div class="phone-input">
      <div class="label">请输入验证码：</div>
      <div class="form-content">
        <el-input
          style="width: 90px"
          type="text"
          name="checkCode"
          maxlength="10"
          required
          v-model="code"
        />
        <el-button
          class="getCheckCode"
          style="margin-left:10px"
          type="primary"
          @click="checkCode()"
          v-if="!isSendCheckMsg"
        >
          发送验证码
        </el-button>
        <span class="disgetCheckCode" v-if="isSendCheckMsg">
          {{ sendTime }}s
        </span>
      </div>
      <el-button
        class="determine"
        type="primary"
        size="small"
        @click="addPhone()"
        >确认添加</el-button
      >
    </div>
  </div>
</template>

<script>
import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
const SEND_PHONE = "/apis/smsmgr/send-verify-code"; // 发送手机号
const CHECK_PHONE = "/apis/smsmgr/check-verify-code"; // 验证手机号
export default {
  data() {
    return {
      phone: "",
      code: "",
      isSendCheckMsg: false,
      sendTime: 0,
      timer: null,
      loading: false
    };
  },
  props: {
    phoneList: {
      type: Array,
      default: () => [],
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    async addPhone() {
      if (this.phoneList.indexOf(this.phone) > -1) {
        this.$message.error("不能添加相同的手机号！!");
        return;
      }

      if (!/^1[\d]{10}$/.test(this.phone)) {
        this.$message.error("请输入正确的手机号码!");
        return;
      }

      if (!/^\d{6}$/.test(this.code)) {
        this.$message.error("请输入正确的验证码!");
        return;
      }

      this.loading = true;
      try {
        await ajax.post(CHECK_PHONE, {
          phone: this.phone,
          verify_code: this.code,
        });

        this.$emit("submit", this.phone);

        this.phone = "";
        this.code = "";
        this.isSendCheckMsg = false;
        clearInterval(this.timer)
      } catch (err) {
        this.$message.error(err.msg || err.message || "添加手机号失败");
      }
      this.loading = false;

    },

    // 获取验证码
    async checkCode() {
      if (this.phoneList.indexOf(this.phone) > -1) {
        this.$message.error("不能添加相同的手机号！!");
        return;
      }
      if (!/^1[\d]{10}$/.test(this.phone)) {
        this.$message.error("请输入正确的手机号码!");
        return;
      }
      try {
        await ajax.get(SEND_PHONE, {
          phone: this.phone,
        });
        this.isSendCheckMsg = true;
        this.sendTime = 60;
        this.timer = setInterval(() => {
          if (this.sendTime <= 0) {
            clearInterval(this.timer);
            this.isSendCheckMsg = false;
          } else {
            this.sendTime = this.sendTime - 1;
          }
        }, 1000);
      } catch (e) {
        this.isSendCheckMsg = false;
        this.$message.error(e.msg || e.message || "服务器超时，请稍后再试！!");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.add-phone-box {
  width: 90%;
  margin: 0 auto;
  background: #f5fcfe;
  box-sizing: border-box;
  position: relative;
  padding: 15px 150px 15px 0;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
}
.phone-input {
  display: flex;
  line-height: 50px;
}
.label {
  width: 160px;
  text-align: right;
}

.form-content {
}

.add-phone-box .determine {
  position: absolute;
  top: 32px;
  right: 20px;
}

.remarks {
  color: #999;
  width: 90%;
  margin: 15px auto 0;
}
</style>