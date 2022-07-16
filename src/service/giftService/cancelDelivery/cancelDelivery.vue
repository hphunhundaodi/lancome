<template>
  <div class="ngdialog ngdialog-theme-default ngdialog-size-small ng-scope">
    <div class="ngdialog-overlay"></div>
    <div class="ngdialog-content" v-loading="loading">
      <div class="ngdialog-title">取消礼品发放</div>
      <div class="ngdialog-body">
        <template
          v-if="
            !params.platform_open_id || !params.activity || !params.gift_name
          "
        >
          <div
            class="fx-1x"
            style="
              font-size: 1.5em;
              width: 320px;
              margin: auto;
              margin-bottom: 0.5em;
            "
            align="center"
          >
            确认取消该礼品发放记录吗
          </div>
        </template>
        <template v-else>
          <div
            class="fx-1x"
            style="
              font-size: 1.5em;
              width: 320px;
              margin: auto;
              margin-bottom: 0.5em;
            "
            align="center"
          >
            确认取消会员
            <span class="blue-base"> {{ name }} </span> 关于活动
            <span class="blue-base"> {{ params.activity }} </span> 所获得
            <span class="blue-base"> {{ params.gift_name }} </span>
            的礼品发放记录吗
          </div>
        </template>
        <div align="center">
          记录取消后不能撤回，是否确认取消该礼品发放记录？
        </div>
      </div>
      <div class="ngdialog-bottom" align="center" style="border: none">
        <button type="button" class="i-btn-primary" @click="submit()">
          确认
        </button>
        <button type="button" class="i-btn mleft-1" @click="closeThisDialog()">
          取&nbsp;&nbsp;消
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import getCancelGiftUrl from "../../../api/getCancelGiftUrl";
export default {
  data() {
    return {
      loading: false,
    };
  },
  props: ["onClose", "onReject", "params", "onOk"],
  created() {
    this.params.platform_open_id =
      this.params.platform_open_id || this.params.member_nick || "";
    this.name =
      this.params.platform_open_id.length > 16
        ? this.params.platform_open_id.charAt(0) + "***"
        : this.params.platform_open_id;
  },
  methods: {
    closeThisDialog() {
      this.onReject();
    },
    async submit() {
      try {
        this.loading = true;
        await getCancelGiftUrl({
          order_id: this.params.orderId,
        });
        this.onOk();
      } catch (error) {
        this.onReject();
        this.$message.error(error.msg || JSON.stringify(error));
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.ngdialog-theme-default .ngdialog-body {
  margin: 40px 15px 15px;
}
</style>