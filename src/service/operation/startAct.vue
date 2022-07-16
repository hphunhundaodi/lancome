<template>
  <el-dialog :visible="true" title="操作确认" width="390px" :show-close="false">
    <div
      class="fx-1x"
      style="font-size: 1.5em; width: 320px; margin: auto; margin-bottom: 0.5em"
      align="center"
    >
      确认启用活动 <span class="blue-base">{{this.params.name}}</span> 吗？
    </div>
    <div align="center" style="margin: auto; width: 360px">
      活动启用后，您可以通过分享URL来邀请会员参加活动
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCloseDialog">取 消</el-button>
      <el-button type="primary" @click="onOkDialog">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["onClose", "onReject", "params", "onOk"],
  methods: {
    onCloseDialog() {
      this.onReject();
    },
    onOkDialog() {
      this.onOk();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>