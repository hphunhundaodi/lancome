<template>
  <div
    v-loading="isLoading"
    class="index-container-zero container mobile-height"
  >
    <PriviewC
      :inst_config_info="inst_config_info"
      :is_raffle="is_raffle"
      :step="step"
      :preview_data="preview_data"
    ></PriviewC>
    <div class="editor-wrap">
      <el-form
        ref="submitForm"
        :model="inst_config_info"
        :rules="rules"
        :hide-required-asterisk="true"
        :show-message="false"
        label-width="0"
      >
        <el-tabs v-model="step" :stretch="true">
          <el-tab-pane name="1">
            <span slot="label">活动抽奖页</span>
            <keep-alive>
              <step1
                :form_step1.sync="inst_config_info.form_step1"
                @save="save"
              ></step1>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane name="2">
            <span slot="label">中奖展示</span>
            <keep-alive>
              <step2
                :form_step2.sync="inst_config_info.form_step2"
                @save="save"
              ></step2>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane name="3">
            <span slot="label">中奖记录</span>
            <keep-alive>
              <step3
                :form_step3.sync="inst_config_info.form_step3"
                @save="save"
              ></step3>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane name="4">
            <span slot="label">活动规则</span>
            <keep-alive>
              <step4
                :form_step4.sync="inst_config_info.form_step4"
                @save="save"
              ></step4>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane name="5">
            <span slot="label">中奖名单</span>
            <keep-alive>
              <step5
                :form_step5.sync="inst_config_info.form_step5"
                @save="save"
              ></step5>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>
<script>
import step1 from "./components/step1";
import step2 from "./components/step2";
import step3 from "./components/step3";
import step4 from "./components/step4";
import step5 from "./components/step5";
import PriviewC from "./components/PriviewC";
import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
import { transporeData } from "../mixins";
import { createAct } from "../../api/lankou";
import gameSchema from "../../gameSchema";
const { scenario_predef_id } = gameSchema;
const ACTIVITY = "/apis/activity/activity";

export default {
  mixins: [transporeData],
  components: { step1, step2, step3, step4, step5, PriviewC },
  data() {
    return {
      formData: {},
      // 上传数据 转json上传
      inst_config_info: {
        form_step1: {
          img_style: {
            main_bg:
              "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
            activity_bg:
              "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
            reword_bg:
              "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
            activity_rule_bg:
              "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
            reword_list_bg:
              "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
            card_default_bg:
              "//enbrands-2.oss-cn-shanghai.aliyuncs.com/ebs/systemImg/11.jpg",
            card_choose_bg:
              "//enbrands-2.oss-cn-shanghai.aliyuncs.com/ebs/systemImg/14.jpg",
          },
          btn_style: {
            btn_bg_color: "#F2DBA7",
            btn_font_color: "#926A33",
            btn_bg_color_not: "#F2DBA7",
            btn_font_color_not: "#926A33",
            btn_font_color_common: "#926A33",
          },
        },
        form_step2: {
          img_style: {
            activity_bg:
              "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
            card_default_bg:
              "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
            card_choose_bg:
              "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
          },
          btn_style: {
            btn_bg_color: "#F2DBA7",
            btn_font_color: "#926A33",
            btn_bg_color_not: "#F2DBA7",
            btn_font_color_not: "#926A33",
            btn_font_color_common: "#926A33",
          },
        },
        form_step3: {
          img_style: {
            dialog_bg:
              "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
            award_list_bg:
              "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
          },
          btn_style: {
            btn_font_color_common: "#926A33",
          },
        },
        form_step4: {
          img_style: {
            dialog_bg:
              "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
          },
          btn_style: {
            btn_font_color_common: "#926A33",
          },
        },
        form_step5: {
          img_style: {
            dialog_bg:
              "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
          },
          btn_style: {
            btn_font_color: "#926A33",
            btn_font_color_common: "#926A33",
          },
        },
      },
      // PreviewC 通用数据
      preview_data: {
        main_bg:
          "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
        reword_bg:
          "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
        activity_rule_bg:
          "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
        reword_list_bg:
          "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
        activity_bg:
          "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
        card_default_bg:
          "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
        card_choose_bg:
          "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
        btn_bg_color: "#F2DBA7",
        btn_font_color: "#926A33",
        btn_bg_color_not: "#F2DBA7",
        btn_font_color_not: "#926A33",
        btn_font_color_common: "#926A33",
      },
      isLoading: false,
      step: "1", // 控制第几步
      is_raffle: 1, // 是否可以抽奖 0不可 1可
      rules: [],
    };
  },
  watch: {
    inst_config_info: {
      immediate: true,
      deep: true,
      handler(val) {
        let [pre, form1, form2, form2_btn] = [
          this.preview_data,
          val.form_step1.img_style,
          val.form_step2.img_style,
          val.form_step2.btn_style,
        ];
        pre.main_bg = form1.main_bg;
        pre.reword_bg = form1.reword_bg;
        pre.activity_rule_bg = form1.activity_rule_bg;
        pre.reword_list_bg = form1.reword_list_bg;
        pre.activity_bg = form2.activity_bg;
        pre.card_default_bg = form2.card_default_bg;
        pre.card_choose_bg = form2.card_choose_bg;
        pre.btn_bg_color = form2_btn.btn_bg_color;
        pre.btn_font_color = form2_btn.btn_font_color;
        pre.btn_bg_color_not = form2_btn.btn_bg_color_not;
        pre.btn_font_color_not = form2_btn.btn_font_color_not;
        pre.btn_font_color_common = form2_btn.btn_font_color_common;
      },
    },
  },
  created() {
    if (this.$route.query.activity_id) {
      this.isLoading = true;
      ajax
        .get(ACTIVITY, {
          id: this.$route.query.activity_id,
        })
        .then((res) => {
          if (res.code) throw new Error(res.msg);
          this.formData = this.mixinRaffleInnerData(res.data);
        })
        .catch((e) => {
          this.$message.error(e.msg || e.message || "获取活动详情失败");
        })
        .finally(() => (this.isLoading = false));
    }
  },
  mounted() {},
  methods: {
    save(status) {
      let data = {
        act: Object.assign(this.formData.act, {
          scenario_predef_id,
          status,
          scence_id: 0,
          inst_config_info: JSON.stringify(this.inst_config_info),
        }),
        awards: Object.assign(this.formData.awards),
      };
      this.isLoading = true;
      createAct(data)
        .then((res) => {
          if (res.code) throw new Error(res.msg);
          this.$message.success("活动信息保存成功!");
          this.step++;
        })
        .catch((e) => {
          this.$message.error(e.message);
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
