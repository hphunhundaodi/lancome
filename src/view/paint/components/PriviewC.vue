<template>
  <div class="preview-wrap">
    <div class="mobile">
      <div class="mobile-title">
        <span class="name">兑换礼品页</span>
      </div>
      <div class="mobile-content">
        <div v-show="step > '2'" class="content-dialog">
          <img class="dialog-backround" :src="stepInfo.img_style.dialog_bg" />
          <div class="dialog-close el-icon-close"></div>
          <div class="dialog-title" v-show="step == '3'">中奖记录</div>
          <div class="dialog-title" v-show="step == '4'">活动规则</div>
          <div class="dialog-title" v-show="step == '5'">中奖名单</div>
          <div class="dialog-card-content" v-show="step == '3'">
            <div class="dialog-card" v-for="(item, index) in 5" :key="index">
              <div class="card-left">
                <img :src="stepInfo.img_style.award_list_bg" class="card-img" />
              </div>
              <div class="card-right">
                <div class="right-top">兰蔻小蛮腰（正装）</div>
                <div>2021-10-21 21:06</div>
              </div>
            </div>
          </div>
          <div class="dialog-card-content" v-show="step == '4'">
            <div class="dialog-card">
              这里是活动规则，这里是活动规则这里是活动规则这里是活动规则这里是活动规则
              这里是活动规则这里是活动规则这里是活动规则这里是活动规则这里是活动规则这
              里是活动规则这里是活动规则这里是活动规则这里是活动规则这里是活动规则这里
              是活动规则这里是活动规则这里是活动规则这里是活动规则这里是活动规则
            </div>
          </div>
          <div class="dialog-card-content" v-show="step == '5'">
            <div class="dialog-card" style="background: #f2f2f2">
              <div class="card-table-inner">
                <div class="inner-info">序号</div>
                <div class="inner-info">手机号</div>
                <div class="inner-info">中将时间</div>
              </div>
            </div>
            <div class="dialog-card" v-for="(item, index) in 8" :key="index">
              <div class="card-table-inner">
                <div class="inner-info">{{ index + 1 }}</div>
                <div class="inner-info">183****3051</div>
                <div class="inner-info">
                  <div>2021-09-01</div>
                  <div>21:00:05</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img class="main-bg" :src="preview_data.main_bg" />
        <div class="content-main">
          <div class="main-button-content">
            <div
              class="main-info-button"
              :style="{
                color:
                  step == '1'
                    ? stepInfo.btn_style.btn_font_color_common
                    : preview_data.btn_font_color_common,
              }"
            >
              <img class="button-img" :src="preview_data.reword_bg" />
              中奖记录
            </div>
            <div
              class="main-info-button"
              :style="{
                color:
                  step == '1'
                    ? stepInfo.btn_style.btn_font_color_common
                    : preview_data.btn_font_color_common,
              }"
            >
              <img
                class="button-img"
                :src="preview_data.activity_rule_bg"
              />活动规则
            </div>
            <div
              class="main-info-button"
              :style="{
                color:
                  step == '1'
                    ? stepInfo.btn_style.btn_font_color_common
                    : preview_data.btn_font_color_common,
              }"
            >
              <img
                class="button-img"
                :src="preview_data.reword_list_bg"
              />中奖名单
            </div>
          </div>
          <div class="main-img-content">
            <img
              class="img-info"
              :src="
                step == '1'
                  ? stepInfo.img_style.activity_bg
                  : preview_data.activity_bg
              "
            />
          </div>
          <div class="main-card-content">
            <img
              v-for="(item, index) in 5"
              :key="index"
              class="card-img"
              :class="index == 1 ? 'card-img-choose' : ''"
              :src="
                index == 1
                  ? step == '1'
                    ? stepInfo.img_style.card_choose_bg
                    : preview_data.card_choose_bg
                  : step == '1'
                  ? stepInfo.img_style.card_default_bg
                  : preview_data.card_default_bg
              "
            />
          </div>
        </div>
        <div class="bottom-main">
          <div
            class="bottom-btn"
            :class="is_raffle == 1 ? 'btn-hover' : ''"
            :style="{
              color:
                is_raffle == 1
                  ? step == '1'
                    ? stepInfo.btn_style.btn_font_color
                    : preview_data.btn_font_color
                  : step == '1'
                  ? stepInfo.btn_style.btn_font_color_not
                  : preview_data.btn_font_color_not,

              backgroundColor:
                is_raffle == 1
                  ? step == '1'
                    ? stepInfo.btn_style.btn_bg_color
                    : preview_data.btn_bg_color
                  : step == '1'
                  ? stepInfo.btn_style.btn_bg_color_not
                  : preview_data.btn_bg_color_not,
            }"
          >
            {{ step > 1 ? "立即领取" : "立即抽奖" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    inst_config_info: {
      type: Object,
      require: true,
    },
    is_raffle: {
      type: Number,
      default: 1,
    },
    step: {
      type: String,
      default: "1",
    },
    preview_data: {
      type: Object,
      require: true,
    },
  },
  computed: {
    stepInfo() {
      if (this.step == "1") {
        return this.inst_config_info.form_step1;
      } else if (this.step == "2") {
        return this.inst_config_info.form_step2;
      } else if (this.step == "3") {
        return this.inst_config_info.form_step3;
      } else if (this.step == "4") {
        return this.inst_config_info.form_step4;
      } else if (this.step == "5") {
        return this.inst_config_info.form_step5;
      } else {
        return this.$message.error("步骤出错!");
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "../index.less";
.preview-wrap {
  .mobile {
    overflow-y: scroll;
    .mobile-content {
      position: relative;
      .main-bg {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: -1;
        width: 100%;
      }
      .content-main {
        width: 100%;
        margin-bottom: 12px;
        .main-button-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
          padding: 5px 0;
          .main-info-button {
            position: relative;
            text-align: center;
            width: 100px;
            height: 30px;
            margin: 5px 0;
            line-height: 30px;
            border-radius: 5px;
            padding-right: 8px;
            .button-img {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              z-index: -1;
              width: 100px;
              height: 30px;
              border-radius: 5px;
            }
          }
        }
        .main-img-content {
          text-align: center;
          margin-bottom: 10px;
          .img-info {
            width: 360px;
            height: 360px;
          }
        }
        .main-card-content {
          text-align: center;
          .card-img {
            width: 64px;
            height: 120px;
            margin: 0 4px;
          }
          .card-img-choose {
            border: 2px solid #900505;
            box-shadow: 2px 2px #000;
          }
        }
      }
      .bottom-main {
        .bottom-btn {
          width: 200px;
          height: 50px;
          margin: 0 auto;
          text-align: center;
          line-height: 50px;
          cursor: pointer;
          border-radius: 20px;
          font-size: 28px;
          font-weight: 600;
        }
        .btn-hover {
          &:hover {
            opacity: 0.8;
          }
        }
      }
      .content-dialog {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        width: 310px;
        height: 500px;
        z-index: 10;
        overflow: hidden;
        .dialog-backround {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: -1;
          width: 100%;
          height: 100%;
        }
        .dialog-close {
          position: absolute;
          top: 0;
          right: 0;
          margin: 10px;
          font-size: 30px;
        }
        .dialog-title {
          width: 100%;
          height: 60px;
          text-align: center;
          line-height: 60px;
          font-size: 22px;
          font-weight: 600;
        }
        .dialog-card-content {
          overflow-y: scroll;
          height: 440px;
          width: calc(100% + 10px);
          :nth-child(2) {
            border-top: none !important;
          }
          .dialog-card {
            display: flex;
            justify-content: center;
            align-items: stretch;
            padding: 10px;
            border-top: 1px solid #f2f2f2;
            margin-bottom: 10px;
            .card-table-inner {
              display: flex;
              align-items: stretch;
              width: 100%;
              text-align: center;
              .inner-info {
                flex: 1;
              }
            }
            .card-left {
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
              .card-img {
                width: 80px;
                height: 80px;
              }
            }
            .card-right {
              flex: 2;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              margin-left: 10px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>