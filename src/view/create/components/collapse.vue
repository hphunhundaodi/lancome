<template>
  <div class="area-gift">
    <div>
      <div
        v-for="(item, index) in awards"
        :key="index"
        :style="index == 0 ? null : 'border-top: 1px solid #ddd'"
      >
        <div class="gift-item" @click="$emit('toggle', item, item.show)">
          <div class="label-class">
            <div class="label-left">
              <div
                class="gift-icon"
                :style="{ backgroundImage: 'url(' + item.pic + ')' }"
              ></div>
              <div class="mleft-1">奖品名称：</div>
              <div style="color: #09f; padding: 10px">{{ item.name }}</div>
              <div class="">{{ giftLevel(index, item) }}等奖</div>
              <el-button
                :disabled="$route.query.activity_id"
                v-show="index !== 0"
                class="gift_move"
                @click.stop="$emit('gift-move', index, 1)"
                >上移</el-button
              >
              <el-button
                :disabled="$route.query.activity_id"
                v-show="index < awards.length - 1"
                class="gift_move"
                @click.stop="$emit('gift-move', index, -1)"
                >下移</el-button
              >
              <div
                class="mleft-1"
                style="text-decoration: underline; cursor: pointer"
                :style="{ color: '#595959' }"
                v-if="index != 0"
                @click.stop="$emit('remove-gift', item)"
              >
                删除
              </div>
            </div>
          </div>
          <div class="label-right">
            <div class="mleft-1">奖项库存：{{ item.available }}</div>
            <div class="mleft-1">中奖概率：{{ item.rate }}%</div>
            <a
              :class="[item.show ? 'icon-upward' : 'icon-down', 'mleft-2']"
            ></a>
          </div>
        </div>
        <el-collapse-transition>
          <div class="page-item-detail" v-show="item.show">
            <imgPicker
              class="page-item-detail-image-wrap"
              :class="
                $route.query.send ? 'page-item-detail-image-wrap-disable' : ''
              "
              :style="{ backgroundImage: 'url(' + item.pic + ')' }"
              v-model="item.pic"
            >
              <div slot="content" class="upload-wrap">
                <i class="el-icon-plus center"></i>
              </div>
            </imgPicker>
            <!--  v-if="$route.query.send" -->
            <div v-if="$route.query.send" class="cover-img-packer"></div>
            <div class="page-left-column">
              <div class="award-type">
                <el-form-item label-width="100px" label="奖项类型：">
                  <el-radio-group
                    v-model="item.type"
                    @change="$emit('change_type', item.type, index)"
                    :disabled="$route.query.activity_id"
                  >
                    <el-radio label="G">礼品</el-radio>
                    <el-button
                      class="change-type"
                      v-if="item.gift.length <= 0"
                      v-show="item.type == 'G'"
                      size="mini"
                      type="primary"
                      @click.prevent="selectGift(index, item)"
                      >选择礼品</el-button
                    >
                    <el-button
                      class="change-type"
                      v-show="item.type == 'G'"
                      :disabled="$route.query.activity_id"
                      v-else
                      size="mini"
                      type="primary"
                      @click.prevent="selectGift(index, item)"
                      >替换</el-button
                    >
                    <el-radio label="S">积分</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <el-form-item
                v-show="item.type == 'G'"
                label-width="100px"
                label="礼品名称："
                :prop="'awards.' + index + '.gift'"
                :rules="rules.giftRule"
              >
                <el-input
                  disabled
                  style="width: 148px"
                  size="small"
                  :value="item.gift.length > 0 ? item.gift[0].title : ''"
                  maxlength="24"
                ></el-input>
              </el-form-item>
              <div class="page-award-form">
                <el-form-item
                  label-width="100px"
                  label="奖项名称："
                  :prop="'awards.' + index + '.name'"
                  :rules="rules.nameRule"
                >
                  <el-input
                    :disabled="$route.query.activity_id || item.type == 'S'"
                    style="width: 100px"
                    size="small"
                    v-model="item.name"
                    maxlength="12"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label-width="100px"
                  label="中奖概率："
                  :prop="'awards.' + index + '.rate'"
                  :rules="rules.rateRule"
                >
                  <el-input
                    :disabled="$route.query.activity_id"
                    style="width: 100px"
                    size="small"
                    type="number"
                    v-model.number="item.rate"
                  ></el-input>
                  <span class="form-item-end">%</span>
                  <el-tooltip
                    class="tooltip-item"
                    effect="light"
                    content=""
                    placement="bottom"
                  >
                    <div slot="content" v-once>
                      中奖概率是在平均抽中的概率，例<br />如：礼品a中奖概率为1%，即抽<br />奖100次，可能有1次抽中。
                    </div>
                    <span class="icon-prompt"></span>
                  </el-tooltip>
                </el-form-item>
              </div>
              <div class="page-award-form" v-show="item.type == 'G'">
                <el-form-item
                  label-width="100px"
                  label="奖项库存："
                  :prop="'awards.' + index + '.available'"
                  :rules="rules.availableRule"
                >
                  <el-input
                    :disabled="$route.query.activity_id"
                    style="width: 100px"
                    size="small"
                    type="number"
                    v-model.number="item.available"
                    maxlength="6"
                  ></el-input>
                </el-form-item>
                <!-- <el-form-item class="form-item-end" label-width="0px">
                  <el-checkbox
                    v-model="item.isEverydayGift"
                    :disabled="$route.query.activity_id"
                    >控制每日送出量</el-checkbox
                  >
                  <el-tooltip
                    class="tooltip-item"
                    effect="light"
                    placement="bottom"
                  >
                    <div slot="content" v-once>
                      若当天控制的礼品数未被抽完，不<br />
                      会被累计到第二天。例如设置了：<br />
                      控制每日送出量为2，实际当天没<br />
                      有人抽中，该礼品第二天最多会送<br />
                      出的数量仍然为2。如果还勾选了<br />
                      定时投放，则在投放日期前，该礼<br />
                      品不会被抽中；投放日期后，控制<br />
                      每日送出量规则才生效。
                    </div>
                    <span class="icon-prompt"></span>
                  </el-tooltip>
                  <el-form-item
                    class="end-input"
                    v-show="item.isEverydayGift"
                    :prop="'awards.' + index + '.stock_perday'"
                    :rules="rules.stock_perdayRule"
                  >
                    <span>每日最大抽取的礼品数量：</span>
                    <el-input
                      :disabled="$route.query.activity_id"
                      style="width: 100px"
                      size="small"
                      type="number"
                      v-model.number="item.stock_perday"
                      maxlength="6"
                    ></el-input>
                  </el-form-item>
                </el-form-item> -->
              </div>
              <!-- <div class="end-timing" v-show="item.type == 'G'">
                <el-checkbox
                  v-model="item.isTimingOn"
                  :disabled="$route.query.activity_id"
                  class="timing-title"
                  >定时投放礼品</el-checkbox
                >
                <el-tooltip
                  class="tooltip-item"
                  effect="light"
                  placement="bottom"
                  style="margin-bottom: 18px"
                >
                  <div slot="content" v-once>
                    定时投放礼品是指礼品在特定的时<br />间才进入礼品池，参与者在投放时<br />间后才可能抽中该礼品。
                  </div>
                  <span class="icon-prompt"></span>
                </el-tooltip>
                <el-form-item
                  label-width="100px"
                  label="投放时间："
                  :prop="'awards.' + index + '.join_at'"
                  :rules="rules.join_atRule"
                  v-show="item.isTimingOn"
                >
                  <el-date-picker
                    :disabled="$route.query.activity_id"
                    v-model="item.join_at"
                    type="datetime"
                    placeholder="选择投放时间"
                    value-format="timestamp"
                    :default-value="Date.now()"
                    :picker-options="{
                      disabledDate(time) {
                        return time.getTime() < Date.now() - 86400000;
                      },
                    }"
                  >
                  </el-date-picker>
                </el-form-item>
              </div> -->
              <div v-show="item.type == 'S'">
                <el-form-item
                  label-width="100px"
                  label="奖励："
                  :prop="'awards.' + index + '.score'"
                  :rules="rules.scoreRule"
                >
                  <el-input
                    :disabled="$route.query.activity_id"
                    style="width: 100px"
                    type="number"
                    size="small"
                    v-model="item.score"
                    @change="item.name = item.score + '积分'"
                  ></el-input>
                  <span class="item-unit">积分</span>
                </el-form-item>
                <div class="page-award-form">
                  <el-form-item
                    label-width="100px"
                    label="限量："
                    :prop="'awards.' + index + '.available'"
                    :rules="rules.availableRule"
                  >
                    <el-input
                      :disabled="$route.query.activity_id"
                      style="width: 100px"
                      size="small"
                      type="number"
                      v-model.number="item.available"
                      maxlength="6"
                    ></el-input>
                    <span class="item-unit">份</span>
                  </el-form-item>
                  <!-- <el-form-item class="form-item-end" label-width="0px">
                    <el-checkbox
                      v-model="item.isEverydayGift"
                      :disabled="$route.query.activity_id"
                      >控制每日送出量</el-checkbox
                    >
                    <el-tooltip
                      class="tooltip-item"
                      effect="light"
                      placement="bottom"
                    >
                      <div slot="content" v-once>
                        若当天控制的礼品数未被抽完，不<br />
                        会被累计到第二天。例如设置了：<br />
                        控制每日送出量为2，实际当天没<br />
                        有人抽中，该礼品第二天最多会送<br />
                        出的数量仍然为2。如果还勾选了<br />
                        定时投放，则在投放日期前，该礼<br />
                        品不会被抽中；投放日期后，控制<br />
                        每日送出量规则才生效。
                      </div>
                      <span class="icon-prompt"></span>
                    </el-tooltip>
                    <el-form-item
                      class="end-input"
                      v-show="item.isEverydayGift"
                      :prop="'awards.' + index + '.stock_perday'"
                      :rules="rules.stock_perdayRule"
                    >
                      <span>每日最大抽取的礼品数量：</span>
                      <el-input
                        :disabled="$route.query.activity_id"
                        style="width: 100px"
                        size="small"
                        type="number"
                        v-model.number="item.stock_perday"
                        maxlength="6"
                      ></el-input>
                    </el-form-item>
                  </el-form-item> -->
                </div>
              </div>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>
    <div class="add-more" @click="$emit('add-gift')">
      <i class="el-icon-circle-plus" />
      添加更多
    </div>
  </div>
</template>

<script>
const chnNumChar = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
import { openSelectGift } from "@jifenn/enbrands-interaction-tools/components/selectGift/index";
export default {
  props: {
    // 总数据
    awards: {
      type: Object,
      require: true,
    },
    // 校验规则
    rules: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    // 添加奖项等级自增
    giftLevel(index, item) {
      item.level = index + 1;
      return chnNumChar[index];
    },
    // 切换类型时重置表单
    formReset(index) {
      this.awards[index].name = "";
      this.awards[index].gift_name = "";
      this.awards[index].rate = "";
      this.awards[index].available = "";
      this.awards[index].score = "";
      this.awards[index].stock_perday = "";
      this.awards[index].isEverydayGift = false;
      this.awards[index].isTimingOn = false;
      this.awards[index].join_at = "";
    },
    // 调用私有组件 选择礼品
    async selectGift(index, item) {
      console.log("item", item);
      try {
        let type_id;
        switch (item.type) {
          case "1":
            type_id = 800199;
            break;
          case "2":
            type_id = 800200;
            break;
          case "3":
            type_id = 800202;
            break;
          case "4":
            // 测试环境写死礼品类型id
            if (window.$$INFO.merchant_num == 2147480002) {
              type_id = 900013;
            }
            if (window.$$INFO.merchant_num == 2147480000) {
              type_id = 900015;
            }

            // 正式环境写死类型id，店铺号2000051 类型900001 店铺号 2000082 类型900003
            if (window.$$INFO.merchant_num == 2000051) {
              type_id = 900001;
            }
            if (window.$$INFO.merchant_num == 2000082) {
              type_id = 900003;
            }
            break;
        }

        const disabledGiftIds = this.awards
          .filter((item, _index) => _index != index)
          .map((item) => {
            return item && item.gift && item.gift[0] && item.gift[0].gift_id
              ? item.gift[0].gift_id
              : undefined;
          })
          .filter((item) => item); // 防止出现undefined

        const result = await openSelectGift({
          value: this.awards[index].gift || [],
          singleChoice: true,
          // type_id: type_id,
          // issue_mode: item.type == 4 ? "P" : "I",
          disabledGiftIds: disabledGiftIds,
        });
        this.awards[index].gift = result;
        this.awards[index].pic = result[0].pic_url;
        this.$set(this.awards[index], "gift", result);
      } catch (err) {
        console.warn(err);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.area-gift {
  border: 1px solid #ddd;
  .end-timing {
    display: flex;
    align-items: center;
    .timing-title {
      margin-bottom: 18px;
    }
  }
  .icon-prompt {
    color: #0099ff;
    font-size: 18px;
    vertical-align: middle;
  }
  .tooltip-item {
    padding-left: 10px;
  }
  .form-item-end {
    display: inline-block;
    padding-left: 10px;
    .end-input {
      display: inline-block;
      margin-left: 20px;
      .el-input {
        padding-left: 10px;
      }
    }
  }
  .gift-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 50px;
    height: 50px;
    padding: 0 20px;
    transition: all 0.3s;
    padding-left: 12px;
    .label-class {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .label-left {
        display: flex;
        align-items: center;
        .gift_move {
          padding: 10px;
          margin: 0 10px;
        }
        .gift-icon {
          background-image: url("//enbrands-2.oss-cn-shanghai.aliyuncs.com/ebs/gift_default.png?x-oss-process=style/imagespace-preview");
          height: 38px;
          width: 42px;
          display: inline-block;
          vertical-align: middle;
          background-position: center;
          background-size: contain;
          background-repeat: no-repeat;
          border-radius: 3px;
        }
      }
    }
    .label-right {
      display: flex;
      align-items: center;
    }
  }
  .page-item-detail {
    display: flex;
    border-top: 1px solid #ddd;
    padding: 20px;
    background-color: #fefff1;
    position: relative;
    .cover-img-packer {
      position: absolute;
      top: 30px;
      bottom: 0;
      left: 20px;
      right: 0;
      width: 102px;
      height: 102px;
      background-color: transparent;
    }
    .page-item-detail-image-wrap-disable {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor: not-allowed;
    }
    .page-item-detail-image-wrap {
      flex-shrink: 0;
      margin-top: 10px;
      height: 102px;
      box-sizing: border-box;
      .upload-wrap {
        width: 100px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 3px;
        overflow: hidden;
        border: 1px dashed #d9d9d9;
      }
    }
  }
  .page-left-column {
    flex-shrink: 0;
    margin-left: 44px;
    .item-unit {
      padding-left: 10px;
    }
    .page-award-form {
      display: flex;
    }
    .award-type {
      display: flex;
      align-items: center;
      // justify-content: space-around;
      .change-type {
        margin-right: 10px;
      }
    }
  }
}
.add-more {
  cursor: pointer;
  text-align: center;
  height: 50px;
  line-height: 50px;
  color: #409eff;
  font-size: 16px;
  background: #f5f5f5;
}
</style>