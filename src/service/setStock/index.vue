<template>
  <el-dialog
    :visible="true"
    title="库存预警"
    class="stock-dialog-box"
    width="750px"
    :show-close="false"
  >
    <el-switch
      style="position: absolute; right: 20px; top: 20px"
      :value="isOpen"
      active-color="#13ce66"
      @change="changeStock"
      inactive-color="#ddd"
      v-if="!loading"
    >
    </el-switch>
    <div v-loading="loading">
      <div class="default-stock-content" v-if="!isOpen">
        <img
          src="//enbrands-2.oss-cn-shanghai.aliyuncs.com/ebs/collect/tm-msg-system.png"
          alt=""
        />
        <p>您目前暂未开启预警</p>
        <p>为活动开启库存预警，能更好的规避好风险！</p>
        <div class="close-button" @click="closeThisDialog('reset')">
          我知道了
        </div>
      </div>

      <div v-if="isOpen">
        <div class="stock-form">
          <div class="form-box">
            <div class="label">库存预警值：</div>
            <div class="form-content">
              任意礼品的剩余库存少于等于
              <el-input-number
                v-model="maxStock"
                size="small"
                :min="1"
                :precision="0"
                :max="1000000"
                label="库存预警值"
              ></el-input-number>
              份时
            </div>
          </div>

          <div class="form-box">
            <div class="label"></div>
            <div class="form-content">
              <el-checkbox
                name="type"
                v-model="isEnableCheck"
                @change="isEnableCheckChange"
                style="margin-right: 0.5em"
              ></el-checkbox>
              且任意礼品的剩余库存量少于等于该礼品总发行量的

              <el-input-number
                v-if="isEnableCheck"
                @change="changeScale()"
                v-model="issueScale"
                size="small"
                :min="1"
                :max="100"
                label="库存预警值"
              ></el-input-number>

              <span v-if="!isEnableCheck">{{ issueScale || 0 }}</span>

              %时，发送短信提醒
            </div>
          </div>

          <div class="form-box">
            <div class="label">添加的手机号：</div>
            <div class="form-content">
              <div class="add-phone-text" v-for="item in phoneList" :key="item">
                {{ item }}
                <span class="close-phone-but" @click="deletePhone(item)"
                  >x</span
                >
              </div>
            </div>
          </div>
        </div>
        <phoneAddEle
          v-if="phoneList.length < 3"
          :phoneList="phoneList"
          @submit="addPhone"
        />
        <div class="remarks">备注：支持最多添加3个手机号</div>

        <div class="stock-footer">
          <div class="stock-button">
            <el-button @click="closeThisDialog()">关闭</el-button>
            <el-button type="primary" @click="submitForm()" class="stock-submit"
              >提交</el-button
            >
          </div>
          <div class="preview-msg">
            短信效果预览：
            <div class="preview-content">
              【短信签名】<span style="color: #ff0000">库存预警</span
              >：您发布的<span style="color: #169bd5">#活动名称#</span>中，<span
                style="color: #169bd5"
                >#礼品名称#</span
              >剩余库存不足<span style="color: #169bd5">#剩余库存量#</span
              >份，请尽快添加库存。
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
import phoneAddEle from "./phoneAddEle.vue";
const SUBMIT_RULE = "/newenbrands/apis/hdactivity/add-act-stock-warning"; // 查询、设置预警规则
const GET_RULE = "/newenbrands/apis/hdactivity/get-act-stock-warning";

export default {
  props: ["onClose", "onReject", "params", "onOk"],
  components: {
    phoneAddEle,
  },
  data() {
    const { new_activity_id } = JSON.parse(this.params.remarks || "{}");
    return {
      loading: true,
      isOpen: true,
      phoneList: [],
      maxStock: "",
      isEnableCheck: false,
      issueScale: "",
      new_activity_id,
      queryData: {},
    };
  },
  async created() {
    this.init()
  },
  methods: {
    async init() {
      this.loading = true;
      try {
        const rsp = await ajax.get(GET_RULE, {
          activity_id: this.new_activity_id,
        });
        const data = rsp.data;
        this.queryData = data;
        this.isOpen = !!data.is_active;
        this.maxStock = (data.limit && data.limit.solid) || "";
        this.isEnableCheck = data.limit && data.limit.percentage > 0;
        this.issueScale = (data.limit && data.limit.percentage) || "";
        this.phoneList = data.phones || [];
        this.changeScale();
      } catch (e) {
        this.$message.error(e.message || e.msg || "获取活动信息失败");
        this.onClose();
      }
      this.loading = false;
    },
    async changeStock() {
      if (!this.isOpen || (this.isOpen && !this.queryData.phones)) {
        this.isOpen = !this.isOpen;
        return;
      }
      this.loading = true;
      try {
        await ajax.post(SUBMIT_RULE, {
          activity_id: this.new_activity_id,
          is_active: this.isOpen ? 0 : 1,
          limit: {
            solid: this.maxStock || 0,
            percentage: this.issueScale || 0,
          },
          phones: this.phoneList,
        });

        this.$message({message:"成功关闭库存预警！",type:"success"});
        this.isOpen = !this.isOpen;
      } catch (e) {
        this.$message.error(e.msg || e.message || "关闭库存预警失败!");
      }

      this.loading = false;
    },

    isEnableCheckChange() {
      this.issueScale = this.isEnableCheck ? "5.00" : "";
    },

    changeScale() {},

    deletePhone(phone) {
      this.phoneList.splice(this.phoneList.indexOf(phone), 1);
    },

    async submitForm() {
      if (this.maxStock < 0 || this.maxStock > 10000) {
        this.$message.error("请输入大于0且小于10000的库存限制");
        return;
      }

      if (this.isEnableCheck && Number(this.issueScale) <= 0) {
        this.$message.error("请设置有效的百分比数字");
        return;
      }

      if (this.phoneList.length < 1) {
        this.$message.error("请设置接受短信的手机");
        return;
      }

      this.loading = true;
      try {
        await ajax.post(SUBMIT_RULE, {
          activity_id: this.new_activity_id,
          is_active: this.isOpen ? 1 : 0,
          limit: {
            solid: Number(this.maxStock) || 0,
            percentage: Number(this.issueScale) || 0,
          },
          phones: this.phoneList,
        });

        this.onOk("reset");
        this.$message({ message: "修改库存预警成功！", type: "success" });
      } catch (e) {
        this.$message.error(e.message || e.msg || "修改库存预警失败");
      }
      this.loading = false;
    },
    addPhone(phone) {
      console.info(12312, phone, this.phoneList);
      this.phoneList.push(phone);
    },

    closeThisDialog(opt) {
      this.onReject(opt || "");
    },
  },
};
</script>

<style scoped>
.stock-dialog-box .stock-form {
  margin: 10px 0;
  padding: 20px 20px 0;
  box-sizing: border-box;
}

.stock-form .form-box {
  position: relative;
  box-sizing: border-box;
  min-height: 30px;
  line-height: 30px;
  display: flex;
}

.stock-dialog-box .label {
  width: 120px;
  height: 30px;
  text-align: right;
  line-height: 40px;
  text-align: right;
}

.stock-dialog-box .form-content {
  line-height: 40px;
}

.stock-dialog-box .remarks {
  color: #999;
  width: 90%;
  margin: 15px auto 0;
}

.stock-dialog-box .stock-footer {
  width: 100%;
}

.stock-dialog-box .stock-button {
  text-align: center;
  padding: 45px 45px 15px;
}

.stock-dialog-box .preview-msg {
  border-top: 1px solid #8ec8ff;
  box-sizing: border-box;
  padding: 15px 35px;
}

.stock-dialog-box .preview-content {
  margin-top: 10px;
  width: 450px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 25px 15px;
  border: 1px solid #ddd;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
}

.stock-dialog-box .add-phone-text {
  border: 1px solid #666666;
  padding: 0 5px;
  display: inline-block;
  line-height: 20px;
  margin: 0 10px;
}

.stock-dialog-box .close-phone-but {
  cursor: pointer;
  padding-left: 5px;
  color: #df3d33;
}

.stock-dialog-box .getCheckCode {
  display: inline-block;
  color: #fff;
  background: #128dff;
  padding: 0 20px;
  line-height: 30px;
  border-radius: 5px;
  vertical-align: middle;
  cursor: pointer;
}

.stock-dialog-box .disgetCheckCode {
  display: inline-block;
  color: #333;
  border: 1px solid #333;
  padding: 0 20px;
  line-height: 30px;
  border-radius: 5px;
  vertical-align: middle;
}

.stock-dialog-box .default-stock-content {
  margin: auto;
  height: 200px;
  width: 300px;
  text-align: center;
  padding: 50px;
}

.stock-dialog-box .default-stock-content p {
  margin: 10px auto;
}

.stock-dialog-box .default-stock-content .close-button {
  display: inline-block;
  background: #128dff;
  color: #fff;
  border-radius: 10px;
  padding: 10px 50px;
  cursor: pointer;
}
</style>