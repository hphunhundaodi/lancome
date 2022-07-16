<template>
  <div
    class="step-container fission-container mobile-height"
    v-loading="isLoading"
  >
    <div class="header-wrap">
      <label class="title">页面配置</label>
      <span class="describe">选择活动页面配置相应的素材及功能模块</span>
    </div>
    <el-form
      ref="step5Form"
      :rules="step2FormRules"
      :inline="false"
      :validate-on-rule-change="true"
      :model="form_step5.img_style"
      size="small"
      label-position="left"
      label-width="130px"
    >
      <el-form-item class="select-img" label="页面背景图：">
        <div class="inner-content">
          <div class="imgcomponent-content">
            <imgPicker
              class="img-packer"
              v-model="form_step5.img_style.dialog_bg"
              width="420"
              height="420"
              :style="{
                backgroundImage: 'url(' + form_step5.img_style.dialog_bg + ')',
              }"
            >
              <div slot="content" class="">
                <i class="el-icon-plus cover-uploader-icon"></i>
              </div>
            </imgPicker>
          </div>
          <div class="">
            <p>页面背景图</p>
            <p>尺寸：{{ isJD ? "580px*320px" : "750px*1624px" }}的图片</p>
            <p>大小：不超过2M</p>
            <p>格式：支持jpg、png</p>
          </div>
        </div>
        <div class="content-reset">
          <el-button
            size="small"
            type="text"
            @click="form_step5.img_style.dialog_bg = ''"
            >重置</el-button
          >
        </div>
      </el-form-item>
    </el-form>
    <div class="main-wrap">
      <div class="header-wrap">
        <label class="title">按钮样式</label>
        <span class="describe"
          >选择主题颜色可以修改所有按钮、文字的颜色及样式</span
        >
      </div>
      <div class="form-wrap">
        <div class="btn-title">按钮配置（不可点击）：</div>
        <el-form
          :inline="true"
          :model="form_step5.btn_style"
          label-position="right"
          label-width="120px"
          style="margin-bottom: 10px"
        >
          <el-form-item label="表头颜色：">
            <el-color-picker
              size="small"
              v-model="form_step5.btn_style.btn_font_color"
              style="vertical-align: middle; margin-right: 8px"
            ></el-color-picker>
            <el-button
              size="small"
              type="text"
              @click="form_step5.btn_style.btn_font_color = '#926A33'"
              >重置</el-button
            >
          </el-form-item>
          <div class="btn-title"></div>
          <el-form-item label="通用文字颜色：">
            <el-color-picker
              size="small"
              v-model="form_step5.btn_style.btn_font_color_common"
              style="vertical-align: middle; margin-right: 8px"
            ></el-color-picker>
            <el-button
              size="small"
              type="text"
              @click="form_step5.btn_style.btn_font_color_common = '#926A33'"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="check-content">
      <el-button>返回</el-button>
      <el-button type="primary" :loading="loading" @click="$emit('save', 2)"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
// import { mapState } from "vuex";
export default {
  props: {
    form_step5: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      // 提交loading状态
      loading: false,
      // 加载loading状态
      isLoading: false,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../index.less";
@import "../raffle.less";
</style>
