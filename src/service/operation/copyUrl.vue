<template>
  <el-dialog
    :visible="true"
    title="获取链接"
    width="530px"
    @close="onCloseDialog"
  >
    <el-form ref="form" label-width="110px" v-loading="loading">
      <el-form-item label="h5链接">
        <!-- <el-form-item :label="isJD?'h5链接':'阿里小程序链接'"> -->
        <div>
          <el-input
            style="width: 310px"
            v-model="url"
            size="small"
            :readOnly="true"
            :disabled="true"
          ></el-input>
          <el-button
            style="marin-left: 5px"
            @click="copy(url)"
            type="primary"
            size="mini"
            >复制</el-button
          >
        </div>
      </el-form-item>
      <el-collapse-transition>
        <div style="text-align: center" v-if="url">
          <jf-qrcode :text="url" />
        </div>
      </el-collapse-transition>
    </el-form>
  </el-dialog>
</template>

<script>
import getAppletUrl from "../../api/getAppletUrl";
// const $$ENV = window.$$ENV || {}
export default {
  props: ["onClose", "onReject", "params", "onOk"],
  data() {
    return {
      loading: false,
      url: "",
      // isJD: $$ENV.JD
    };
  },

  async mounted() {
    try {
      this.loading = true;
      const rsp = await getAppletUrl();
      this.url =
        rsp +
        encodeURIComponent(
          `instId=${this.params.id}&merchantNum=${this.userInfo.merchant_num}&type=1`
        );
    } catch (error) {
      console.log("error", error);
    }
    this.loading = false;
  },
  methods: {
    onCloseDialog() {
      console.log("onCloseDialog");
      this.onReject();
    },
    onOkDialog() {
      this.onOk();
    },
    async copy() {
      await this.$copyText(this.url);
      this.$message({
        message: "复制成功",
        type: "success",
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
