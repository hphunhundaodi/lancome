<template>
  <el-dialog
    :visible="true"
    title="操作确认"
    width="390px"
    :show-close="false"
  >
    <template v-if="params.scence_id == 36">
      <div
        align="left"
        style="margin: auto; width: 360px; margin-bottom: 0.5em"
      >
        <p align="left" style="margin-bottom: 0.5em">
          在暂停时间段内，翻卡机会正常赠送，但是用户暂不能翻卡抽奖。
        </p>
        <div class="fx-1x" style="margin-bottom: 0.5em" align="left">
          确认暂停
          <span class="blue-base">{{ params.name }}</span
          >,继续使用编辑功能吗？
        </div>
        <div style="color: #ff9901">
          （暂停的活动-启用路径：互动列表-操作-启用活动）
        </div>
      </div>
    </template>
    <template v-else>
      <div
        align="left"
        style="margin: auto; width: 360px; margin-bottom: 0.5em"
      >
        <p align="left" style="margin-bottom: 0.5em; text-indent: 2em">
          活动已经发布，暂停活动会使此活动及其关联活动{{
            params.act
          }}均进入暂停状态。
        </p>
        <div
          class="fx-1x"
          style="margin-bottom: 0.5em; text-indent: 2em"
          align="left"
        >
          确认暂停 <span class="blue-base">{{ params.name }}</span
          >吗？
        </div>
        <div style="color: #ff9901">
          （暂停的活动-启用路径：互动列表-操作-启用活动）
        </div>
      </div>
    </template>
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