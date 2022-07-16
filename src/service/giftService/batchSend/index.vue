<template>
  <el-dialog
    :visible="true"
    title="批量发货"
    width="460px"
    :show-close="!loading"
    @close="onCloseDialog"
    :close-on-press-escape="!loading"
    :close-on-click-modal="!loading"
  >
    <div v-loading="loading" style="margin-top: -30px">

      <div v-if="!isReady" style="height: 200px">
        <!-- 初始化占位符 -->
      </div>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick" v-else>
        <el-tab-pane label="发货清单下载" name="download">
          <div v-if="!downId">

            <!--   已验证短信         -->
            <p v-if="isValid" style="height: 30px; line-height: 30px">
              下载待发货清单模板，填入发货信息
              <el-button type="primary" class="i-fr" @click="downLoad()" size="small">
                点击下载
              </el-button>
            </p>

            <!-- 未验证短信 -->
            <template v-else>

              <!-- 已设置安全手机 -->
              <div v-if="phoneList.length > 0">
                <p style="margin-bottom: 30px">由于平台方安全要求，请先完成安全手机的设置后再进行当前操作！</p>
                <el-form
                    label-width="140px"
                    :model="validFm"
                    :rules="validRules"
                    ref="validFm"
                    size="small"
                >
                  <el-form-item label="请选择安全手机：" prop="phone">
                    <el-select
                        v-model="validFm.phone"
                        style="width: 140px;margin-right: 15px;">
                      <el-option
                          v-for="item in phoneList"
                          :key="item"
                          :label="item.text"
                          :value="item.phone">
                      </el-option>
                    </el-select>
                    <message-btn :size="small" :key="+new Date()" @btn-click="handleBtnSendMsg"></message-btn>
                  </el-form-item>
                  <el-form-item label="短信验证码：" prop="code">
                    <el-input v-model="validFm.code" style="width: 250px;"></el-input>
                  </el-form-item>
                  <el-form-item v-show="errorMsg" label-width="40px">
                    <span class="error-tips">{{ errorMsg }}</span>
                  </el-form-item>
                  <div align="center">
                    <el-button size="small" @click="handleBtnCancel">取消</el-button>
                    <el-button size="small" type="primary" :disabled="isValidBtnDisable" :loading="isSubmit" @click="handleBtnValid"
                    >验证并下载
                    </el-button>
                  </div>
                </el-form>
              </div>

              <!-- 未设置安全手机 -->
              <div v-else>
                <p style="color: red;"  v-if="userInfo.admin_level === 1">由于平台方安全要求，请先完成安全手机的设置后再进行当前操作！</p>
                <div  v-if="userInfo.admin_level === 1" align="right" style="margin-top: 80px">
                  <el-button size="small" @click="handleBtnCancel">取消</el-button>
                  <el-button type="primary" size="small" @click="handleBtnGoBind">立即绑定</el-button>
                </div>

                <p v-if="userInfo.admin_level !== 1" style="color: red; padding-bottom: 80px">由于平台方安全要求，必须由主账号完成安全手机的设置后再进行当前操作！</p>
              </div>

            </template>
          </div>

          <div v-if="downId && isValid">
            <div align="center">
              数据准备完毕，您的设备不支持自动下载，请点击下方按钮完成下载
            </div>
            <div class="mtop-10" align="center">
              <el-button  type="primary" component="a"
                  target="_blank"
                  :href="'/newenbrands/apis/batchtplexport/download-file?id=' + downId"
              >
                立即下载
              </el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="发货清单上传" name="upload">
          <p style="height: 30px; line-height: 30px;">
            上传已发货清单，完成批量发货

            <el-upload
                class="i-fr"
                style="width: 84px"
                action="/newenbrands/apis/batchtplexport/batch-uploads"
                name="file"
                accept=".xls,.xlsx,.csv"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-error="uploadError"
                :on-success="uploadSuccess"
            >
              <el-button type="primary" size="small">
                点击上传
              </el-button>
            </el-upload>
          </p>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>
import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
const DOWN_BATCH_EXPORT = "/newenbrands/apis/batchtplexport/down-batch-export";
const BATCH_EXPORT = "/newenbrands/apis/batchtplexport/batch-export";
// const DOWN_FILE = "/newenbrands/apis/batchtplexport/download-file";
// const BATCH_UPLOADS = "/newenbrands/apis/batchtplexport/batch-uploads";
const GET_PHONE_LIST = "/merchant-phone/phone-list";
const SEND_MSG_CODE = "/sms/verifycode";
const CHECK_MSG_CODE = "/sms/check-verify";
import MessageBtn from "../messageBtn/index.vue";
const INTERACTION_DATA_TASK_MSG_DISABLE = "INTERACTION_DATA_TASK_MSG_DISABLE";

export default {
  props: ["onClose", "onReject", "params", "onOk"],
  data() {
    return {
      loading: false,
      isReady: false,
      isValid: false,
      downId: "",
      activity_id: this.params.activity_id,
      activeTab: 'download',
      userInfo: this.userInfo,
      phoneList: [],
      validFm: {
        phone: '',
        code: ''
      },
      errorMsg: '',
      isValidBtnDisable: false,
      isSubmit: false,
      checkTimer: null,
      timestamp: 0,
      validRules: {
        phone: [
          {required: true, message: "请选择安全手机", trigger: "blur"}
          // {validator: checkPhone, trigger: 'blur'}
        ],
        code: [
          {required: true, message: "请输入短信验证码", trigger: "blur"},
          {min: 1, max: 6, message: "长度在 1 到 6 个字符", trigger: "blur"}
        ]
      },
    };
  },
  components: {
    MessageBtn,
  },
  async created(){
    this.loading = true;
    try {
      await ajax.get('/apis/batchtplexport/batch-export', {
        activity_id: this.params.activity_id
      });
      this.isValid = true;
    }catch(e){
      this.isValid = false;
    }
    this.isReady = true;
    this.loading = false;
  },
  methods: {

    onCloseDialog() {
      this.onReject();
    },

    onOkDialog() {
      this.onOk();
    },

    async downLoad() {
      try {
        this.loading = true;
        const rsp = await ajax.get(BATCH_EXPORT, {
          activity_id: this.activity_id,
        });
        const downId = await this.checkDownload(rsp.data.id);
        this.handleOnDownloadReady(downId);
      } catch (error) {
        console.error("error", error);
        this.$message.error(error.msg || JSON.stringify(error));
      } finally {
        this.loading = false;
      }
    },

    async checkDownload(id) {
      const rsp = await ajax.get(DOWN_BATCH_EXPORT, { id });
      if (rsp.data.status != 1) {
        return id;
      } else {
        await this.sleep(1000);
        return this.checkDownload(id);
      }
    },

    sleep(time) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), time);
      });
    },

    handleOnDownloadReady(downId) {
      // this.downId = downId;
      if (navigator.userAgent.toLocaleUpperCase().indexOf("FIREFOX") >= 0) {
        this.downId = downId;
      } else {
        const ele = document.createElement("iframe");
        ele.setAttribute(
          "src",
          `//${location.host}/newenbrands/apis/batchtplexport/download-file?id=${downId}`
        );
        ele.setAttribute("async", true);
        document.body.appendChild(ele);
        ele.addEventListener("load", () => {
          document.body.removeChild(ele);
        });
        this.onCloseDialog();
      }
    },

    beforeUpload(file) {
      this.loading = true;
      file.status = "UPLOADING";
    },

    uploadError(err) {
      this.loading = false;
      try {
        err = JSON.parse(err.message);
        this.$message.error(err.msg || JSON.stringify(err));
      } catch (error) {
        this.$message.error(error.msg || JSON.stringify(error));
      }
    },

    uploadSuccess(rsp) {
      this.loading = false;
      if (rsp.code == 0) {
        this.$message.success('上传成功，数据导入需要一定的时间，请勿重复导入');
      } else {
        this.$message.eror(rsp.msg);
      }
    },

    handleTabClick() {

    },

    handleBtnCancel() { // 关闭弹框
      this.onCloseDialog()
    },
    
    handleBtnGoBind() { // 跳转到商家端安全手机管理页面
      this.$router.ngrouter({
        path: "seller/phoneManage",
      });
    },

    async handleBtnSendMsg() {
      let obj = this.phoneList.find(ele => {
        return ele.phone == this.validFm.phone;
      });

      try{
        await ajax.post(SEND_MSG_CODE, {
          type: 16,
          id: obj ? obj.id : "",
          merchant_num: this.userInfo.merchant_num
        });

        this.$message({
          type: "success",
          message: "验证码发送成功！"
        });
      }catch(e){
        this.$message.error(e.msg);
      }
    },

    async doValid() {
      try {
        this.isSubmit = true
        await ajax.post(CHECK_MSG_CODE, {
          phone: this.validFm.phone,
          verify_code: this.validFm.code,
          merchant_num: this.userInfo.merchant_num
        });
        this.isValid = true;
        this.$message.success("验证成功！");
        this.downLoad();

      } catch (err) {
        if (err.code == '612') { // 如果连续输错5次，验证按钮5分钟内不可点击
          this.isValidBtnDisable = true
          this.timestamp = new Date().getTime()
          localStorage.setItem(INTERACTION_DATA_TASK_MSG_DISABLE, this.timestamp);
          this.checkBtnDisable()
        }else{
          this.errorMsg = err.msg || err.message;
          this.isSubmit = false
        }
      }
    },

    checkBtnDisable() {
      // 检查5次验证码输入错误后，是否大于5分钟，是的话[验证下载按钮]才可点击
      let time = this.timestamp || localStorage.getItem(INTERACTION_DATA_TASK_MSG_DISABLE);
      let flag = new Date().getTime() - time < 5 * 60 * 1000 ? true : false;
      this.isValidBtnDisable = flag;
      if (flag) {
        this.checkTimer = setTimeout(() => {
          this.checkBtnDisable();
        }, 1000);
      } else {
        this.errorMsg = "";
        this.timestamp = 0;
        localStorage.removeItem(INTERACTION_DATA_TASK_MSG_DISABLE);
        this.checkTimer && clearTimeout(this.checkTimer);
      }
    },

    handleBtnValid() {
      this.errorMsg = ''
      this.$refs.validFm.validate().then(
          () => {
            this.doValid();
          },
          () => {
          }
      );
    },
    async getPhoneList() {
      try {
        this.loading = true;
        // const data = {"code":0,"msg":"\u6210\u529f","data":[{"id":11,"merchant_num":1012921,"phone":"18829557299"},{"id":46,"merchant_num":1012921,"phone":"13201776635"}]}.data;
        const { data = []} = await ajax.get(GET_PHONE_LIST);
        this.phoneList = data.map(item=>{
          item.text = item.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1 **** $2');
          return item;
        })
        if(this.phoneList.length > 0){
          this.validFm.phone = data[0].phone;
        }
      } catch (error) {
        console.error("error", error);
        this.$message.error(error.msg || JSON.stringify(error));
        this.onCloseDialog();
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.getPhoneList()
    this.checkBtnDisable();
  },
  beforeDestroy() {
    this.checkTimer && clearTimeout(this.checkTimer);
  }
};
</script>

<style lang="less" scoped>
.error-tips{
  color: red;
}

.i-fr{
  float: right;
}

.mtop-10{
  margin-top: 10px;
}
</style>
