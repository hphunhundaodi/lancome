<template>
  <div v-loading="isLoading" class="index-container container">
    <div class="common-breadcoumb">
      <a @click="$router.push({ path: '/' })">互动列表</a> &gt;
      <span v-if="!$route.query.activity_id">
        <a @click="$router.push({ path: '/guide' })">互动中心</a>
        &gt;
      </span>
      <span>{{ $route.query.activity_id ? "编辑" : "创建" }}互动活动</span>
    </div>
    <!-- <div class="i-steps" style="margin: 50px 0">
      <span :class="{ cur: step == 1 }"> <i>活动信息</i></span>
      <span :class="{ cur: step == 2 }"> <i>页面装修</i></span>
    </div> -->

    <div v-if="!isLoading">
      <el-form
        :model="formData"
        :rules="rules"
        size="small"
        ref="ruleForm"
        label-width="150px"
        class="orealJd-Form"
        :disabled="$route.query.send == 'send'"
      >
        <div class="form-content">
          <div class="content-title">基本类型</div>
          <div class="content-info">
            <el-form-item label="活动名称：" prop="act.name">
              <el-input
                style="width: 400px"
                placeholder="请输入活动名称"
                size="small"
                v-model="formData.act.name"
                maxlength="16"
              ></el-input>
            </el-form-item>
            <!-- return time.getTime() < Date.now() - 86400000; -->
            <el-form-item label="购买商品时间：" prop="act.buy_time">
              <el-date-picker
                :disabled="$route.query.activity_id"
                v-model="formData.act.buy_time"
                :picker-options="{
                  disabledDate(time) {
                    return false;
                    //return time.getTime() > Date.now();
                  },
                }"
                :default-time="['12:00:00', '08:00:00']"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="参与门槛：">
              <el-radio v-model="is_vip" label="1">会员</el-radio>
            </el-form-item>
          </div>
        </div>
        <div class="form-content">
          <div class="content-title">选择购买商品</div>
          <div class="content-info">
            <el-form-item label="购买商品选择：">
              <el-button
                size="mini"
                type="primary"
                :disabled="$route.query.activity_id"
                @click="selectGood"
                >选择店铺商品</el-button
              >
            </el-form-item>
            <el-table
              :data="paramsGood.goodsList"
              size="mini"
              border
              max-height="200"
              style="margin-top: 10px"
            >
              <el-table-column
                type="index"
                :index="indexMethod"
                label="序号"
                width="50"
              >
              </el-table-column>
              <el-table-column prop="pic_url" label="图片" width="60">
                <template slot-scope="scope">
                  <img style="width: 20px" :src="scope.row.pic_url" />
                </template>
              </el-table-column>
              <el-table-column prop="name" label="商品名称" width="240">
              </el-table-column>
              <el-table-column
                prop="good_id"
                label="商品编号"
              ></el-table-column>
              <el-table-column prop="price" label="商品价格"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    :disabled="$route.query.activity_id"
                    @click="delGood(scope.row.id)"
                    >取消商品</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="form-content">
          <div class="content-title">抽奖信息设置</div>
          <div class="content-info">
            <el-form-item label="活动时间：" prop="act.act_time">
              <el-date-picker
                :disabled="$route.query.activity_id"
                v-model="formData.act.act_time"
                :default-time="['12:00:00', '08:00:00']"
                :picker-options="{
                  disabledDate(time) {
                    return false;
                    // return time.getTime() < Date.now() - 86400000;
                  },
                }"
                type="datetimerange"
                range-separator="至"
                start-placeholder="生效时间"
                end-placeholder="过期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
              <span class="info-back-font">注：活动时长最长为60天</span>
            </el-form-item>
            <el-form-item
              class="select-img"
              label="分享Icon："
              prop="act.invite_icon"
            >
              <div
                class="inner-content"
                :class="$route.query.send == 'send' ? 'inner-disable' : ''"
              >
                <div class="imgcomponent-content">
                  <imgPicker
                    class="img-packer"
                    width="420"
                    height="420"
                    v-model="formData.act.invite_icon"
                    :style="{
                      backgroundImage: 'url(' + formData.act.invite_icon + ')',
                    }"
                  >
                    <div slot="content" class="">
                      <i class="el-icon-plus cover-uploader-icon"></i>
                    </div>
                  </imgPicker>
                  <div
                    v-if="$route.query.send == 'send'"
                    class="cover-img-packer"
                  ></div>
                </div>
                <div class="">
                  <p>分享Icon</p>
                  <p>尺寸：{{ isJD ? "580px*320px" : "420px*420px" }}的图片</p>
                  <p>大小：不超过2M</p>
                  <p>格式：支持jpg、png</p>
                </div>
              </div>
              <div class="content-reset">
                <el-button
                  size="small"
                  type="text"
                  @click="formData.act.invite_icon = ''"
                  >重置</el-button
                >
                <div class="select-img-back-font">
                  注：分享Icon和分享文案，用于被分享人用手机打开淘口令时的<span
                    class="blue-font"
                    >尺寸规范</span
                  >
                </div>
              </div>
            </el-form-item>
            <el-form-item label="分享文案：" prop="act.invite_creative">
              <el-input
                style="width: 400px"
                size="small"
                placeholder="请填写分享文案"
                v-model.trim="formData.act.invite_creative"
              ></el-input>
            </el-form-item>
            <el-form-item label="奖项类型：">
              <el-radio-group
                v-model="formData.act.if_display"
                class="type-radio"
                :disabled="$route.query.activity_id"
              >
                <el-radio :label="1">公开推广</el-radio>
                <el-button type="text" class="radio-font img-prompt"
                  >在哪公开?</el-button
                >
                <el-radio :label="2">自主推广</el-radio>
                <el-button type="text" disabled
                  >(活动不会在资讯页面等投放渠道上显示入口，只能通过活动链接进入活动详情页)</el-button
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="抽奖次数设置：" prop="act.invite_prize">
              <div class="invite-prize">
                <div>完成指定商品购买的用户，可获得</div>
                <el-input
                  disabled
                  style="width: 60px; margin: 0 5px"
                  size="small"
                  type="number"
                  v-model.trim="formData.act.invite_prize"
                ></el-input>
                <div>次抽奖机会</div>
              </div>
            </el-form-item>
            <el-form-item label="活动规则：" prop="act.ext_params.rule.type_id">
              <el-radio-group v-model="formData.act.ext_params.rule.type_id">
                <el-radio label="1">文本</el-radio>
                <el-radio label="2">图片</el-radio>
              </el-radio-group>
              <el-form-item
                prop="act.ext_params.rule.text"
                v-show="formData.act.ext_params.rule.type_id == 1"
              >
                <el-input
                  class="award-textarea"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入活动规则"
                  v-model="formData.act.ext_params.rule.text"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                prop="act.ext_params.rule.img"
                class="select-img"
                v-show="formData.act.ext_params.rule.type_id == 2"
              >
                <div
                  class="inner-content"
                  :class="$route.query.send == 'send' ? 'inner-disable' : ''"
                >
                  <div class="imgcomponent-content">
                    <imgPicker
                      class="img-packer"
                      v-model="formData.act.ext_params.rule.img"
                      width="420"
                      height="420"
                      :style="{
                        backgroundImage:
                          'url(' + formData.act.ext_params.rule.img + ')',
                      }"
                    >
                      <div slot="content" class="">
                        <i class="el-icon-plus cover-uploader-icon"></i>
                      </div>
                    </imgPicker>
                    <div
                      v-if="$route.query.send == 'send'"
                      class="cover-img-packer"
                    ></div>
                  </div>
                  <div class="">
                    <p>奖项类型</p>
                    <p>
                      尺寸：{{ isJD ? "580px*320px" : "250px*250px" }}的图片
                    </p>
                    <p>大小：不超过2M</p>
                    <p>格式：支持jpg、png</p>
                  </div>
                </div>
                <div class="content-reset">
                  <el-button
                    size="small"
                    type="text"
                    @click="formData.act.ext_params.rule.img = ''"
                    >重置</el-button
                  >
                </div>
              </el-form-item>
            </el-form-item>
          </div>
        </div>
        <div class="form-content">
          <div class="content-title">奖项设置</div>
          <div class="content-info">
            <Collapse
              ref="collapse"
              :rules="rules"
              :awards.sync="formData.awards"
              @remove-gift="removeGift"
              @add-gift="addGift"
              @toggle="toggle"
              @change_type="changeType"
              @gift-move="giftMove"
            />
          </div>
        </div>
      </el-form>
    </div>

    <div v-else style="height: 500px">
      <!-- 占位空格 -->
    </div>

    <div class="check-content">
      <el-button @click="$router.push({ path: '/' })">返回</el-button>
      <el-button
        type="primary"
        :disabled="$route.query.send == 'send'"
        @click="save('ruleForm', is_active, 'over')"
        :loading="loading"
        >保存</el-button
      >
      <el-button
        type="primary"
        @click="save('ruleForm', 3, 'over')"
        :loading="loading"
        >{{ $route.query.send == "send" ? "发布" : "保存并发布" }}</el-button
      >
      <!-- <el-button
        type="primary"
        @click="save('ruleForm', is_active, 'next')"
        :loading="loading"
        >保存，进入装修</el-button
      > -->
    </div>
  </div>
</template>
<script>
import Collapse from "./components/collapse.vue";
import { openSelectGood } from "./components/goodSelectDialog/index.js";
import { createAct, getGoodsList, getActivity } from "../../api/lankou";
import moment from "moment";
import { transporeData } from "../mixins";
import gameSchema from "../../gameSchema";
const { scenario_predef_id, scence_id } = gameSchema;

export default {
  mixins: [transporeData],
  components: {
    Collapse,
  },
  computed: {
    is_active() {
      return this.$route.query.activity_id ? 2 : 1;
    },
  },
  data() {
    const validateActTime = (rule, value, callback) => {
      if (this.$route.query.activity_id) {
        callback();
      } else {
        if (rule.field == "act.buy_time") {
          const { buy_good_begin_at, buy_good_end_at } = this.formData.act;
          if (!buy_good_begin_at && !buy_good_end_at) {
            callback(new Error("请选择购买商品时间"));
          } else if (!buy_good_begin_at) {
            callback(new Error("请选择购买商品开始时间"));
          } else if (!buy_good_end_at) {
            callback(new Error("请选择购买商品结束时间"));
          } else if (
            new Date(buy_good_begin_at.replace(/-/g, "/")).getTime() >=
            new Date(buy_good_end_at.replace(/-/g, "/")).getTime()
          ) {
            callback(new Error("结束时间应该大于开始时间"));
          } else {
            callback();
          }
        } else if (rule.field == "act.act_time") {
          const { begin_at, end_at } = this.formData.act;
          if (!begin_at && !end_at) {
            callback(new Error("请选择活动时间"));
          } else if (!begin_at) {
            callback(new Error("请选择活动开始时间"));
          } else if (!end_at) {
            callback(new Error("请选择活动结束时间"));
          } else if (
            new Date(begin_at.replace(/-/g, "/")).getTime() >=
            new Date(end_at.replace(/-/g, "/")).getTime()
          ) {
            callback(new Error("结束时间应该大于开始时间"));
          } else {
            callback();
          }
        }
      }
    };
    const specialChar = (rule, value, callback) => {
      validChar(value) ? callback() : callback(new Error("不能包含特殊字符"));
    };
    function validChar(value) {
      // const NAME_MATCH = new RegExp("[`~@#$^&*=|{}\\[\\]<>《》/~@#￥&*|{}【】]");
      const NAME_MATCH = new RegExp("[`~@#$^&=|{}\\[\\]<>《》/~@#￥&|{}]");
      const SMEIL =
        /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
      if (NAME_MATCH.test(value) || SMEIL.test(value)) {
        return false;
      } else {
        return true;
      }
    }
    const giftValid = (rule, value, callback) => {
      const i = rule.field.split(".")[1];
      this.formData.awards[i].type == "G" && value == ""
        ? callback(new Error("请选择一个礼品"))
        : callback();
    };
    const stock_perdayValid = (rule, value, callback) => {
      const index = rule.field.split(".")[1];
      this.formData.awards[index].isEverydayGift && value == ""
        ? callback(new Error("请输入每日最大抽取的礼品数量"))
        : callback();
    };
    const join_atValid = (rule, value, callback) => {
      const index = rule.field.split(".")[1];
      this.formData.awards[index].isTimingOn && value == ""
        ? callback(new Error("请选择投放时间"))
        : callback();
    };
    const invite_prizeValid = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入抽奖次数"));
      } else if (value.length > 3) {
        callback(new Error("抽奖次数最多三位数"));
      } else {
        callback();
      }
    };
    const availableValid = (rule, value, callback) => {
      const i = rule.field.split(".")[1];
      if (this.formData.awards[i].type == "S" && value == "") {
        callback(new Error("请输入礼品限量"));
      } else if (this.formData.awards[i].type == "G" && value == "") {
        callback(new Error("请输入奖项库存"));
      } else {
        callback();
      }
    };
    const scoreValid = (rule, value, callback) => {
      if (value > 100) callback(new Error("奖励积分最高99"));
      const i = rule.field.split(".")[1];
      this.formData.awards[i].type == "S" && value == ""
        ? callback(new Error("请输入奖励积分"))
        : callback();
    };
    const rateValid = (rule, value, callback) => {
      let sum = 0;
      this.formData.awards.forEach((el) => (sum += el.rate));
      if (!value) callback(new Error("请输入中奖概率"));
      else if (value > 100) callback(new Error("中奖概率最高100%"));
      else if (sum > 100) callback(new Error("概率总和不得大于100%"));
      else callback();
    };
    const rule_imgValid = (rule, value, callback) => {
      this.formData.act.ext_params.rule.type_id == "2" && value == ""
        ? callback(new Error("请上传活动规则图"))
        : callback();
    };
    return {
      rules: {
        "act.name": [
          {
            required: true,
            message: "请输入活动名称",
            trigger: ["blur", "change"],
          },
          { validator: specialChar, trigger: ["blur", "change"] },
        ],
        "act.invite_icon": [
          {
            required: true,
            message: "请选择分享Icon",
            trigger: ["blur", "change"],
          },
        ],
        "act.act_time": [
          { required: true, validator: validateActTime, trigger: "blur" },
        ],
        "act.buy_time": [
          { required: true, validator: validateActTime, trigger: "blur" },
        ],
        "act.invite_creative": [
          { required: true, message: "请输入分享文案", trigger: "blur" },
        ],
        "act.ext_params.rule.img": [
          { validator: rule_imgValid, trigger: "blur" },
        ],
        "act.ext_params.rule.text": [
          {
            required: true,
            message: "请输入活动规则",
            trigger: "blur",
            transform(value) {
              return value.trim();
            },
          },
          { validator: specialChar, trigger: "blur" },
        ],
        "act.ext_params.rule.type_id": [
          {
            required: true,
            message: "请输入活动规则",
            trigger: "blur",
            transform(value) {
              return value.trim();
            },
          },
          { validator: specialChar, trigger: "blur" },
        ],
        "act.invite_prize": [
          {
            validator: invite_prizeValid,
            trigger: "blur",
          },
        ],
        nameRule: [
          {
            required: true,
            trigger: ["blur", "change"],
            message: "请输入奖项名称",
          },
        ],
        rateRule: [{ trigger: "blur", validator: rateValid }],
        availableRule: [{ validator: availableValid, trigger: "blur" }],
        scoreRule: [{ validator: scoreValid, trigger: "blur" }],
        stock_perdayRule: [
          {
            trigger: "blur",
            validator: stock_perdayValid,
          },
        ],
        join_atRule: [
          {
            trigger: "blur",
            validator: join_atValid,
          },
        ],
        giftRule: [{ validator: giftValid, trigger: "change" }],
      },
      isLoading: false,
      step: 1,
      is_vip: "1", // 参与门槛
      // 获取商品
      paramsGood: {
        searchMode: "0",
        goodsList: [],
      },
      formData: {
        act: {
          name: "", // 活动名称
          act_time: [], // 活动时间
          begin_at: "", // 活动开始时间
          end_at: "", // 活动结束时间
          invite_icon: "", // 分享图标地址
          invite_creative: "", // 分享文案
          if_display: 1, // 推广方式  是否在会员中心展示，1展示 0不展示
          invite_prize: 1, // 抽奖次数设置
          buy_time: [], // 购买商品时间
          buy_good_begin_at: "", // 购买商品时间开始时间
          buy_good_end_at: "", // 购买商品时间结束时间
          status: "", // 活动状态
          id: "", // 活动id
          // 活动规则信息和商品信息
          ext_params: {
            // 活动规则
            rule: {
              img: "", // 图片
              text: "", // 富文本
              type_id: "1", // 类型。1是富文本，2是图片
              rule_data: "", // 富文本或者图片地址
            },
          },
          buy_prize: "", // 购买的商品id
          // buy_prize: [], // 购买的商品id
        },
        awards: [
          {
            name: "", // 奖品名称
            gift_name: "", // 礼品名称
            rate: "", // 中奖概率
            available: "", // 奖项库存  or  限量
            score: "", // 奖励积分 当礼品类型为S时，赠送的积分数
            stock_perday: "", // 每日最大抽取的礼品数量
            isEverydayGift: false, // 控制每日送出量
            isTimingOn: false, // 定时投放礼品
            join_at: "", // 投放时间
            pic: "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/a12762155661f0025f8251fc85ad64b7.png",
            level: 1, // 奖项等级
            type: "G", // 礼品类型 Z:再來一次 N:未中奖 S:积分 G:礼品
            show: false, // 是否折叠
            gift: [],
          },
        ],
      },
    };
  },
  watch: {
    "formData.act.act_time": function (val) {
      this.formData.act.begin_at = val[0];
      this.formData.act.end_at = val[1];
    },
    "formData.act.buy_time": function (val) {
      this.formData.act.buy_good_begin_at = val[0];
      this.formData.act.buy_good_end_at = val[1];
    },
    // "paramsGood.goodsList": function (val) {
    //   if (this.formData.act.buy_prize.length !== 0) {
    //     this.formData.act.buy_prize = [];
    //     val.forEach((el) => this.formData.act.buy_prize.push(el.good_id));
    //   } else {
    //     val.forEach((el) => this.formData.act.buy_prize.push(el.good_id));
    //   }
    // },
  },
  created() {
    if (this.$route.query.activity_id) {
      this.isLoading = true;
      getActivity({
        id: this.$route.query.activity_id,
      })
        .then((res) => {
          if (res.code) throw new Error(res.msg);
          this.formData = this.mixinInnerData(res.data, this.formData);
        })
        .then(() => {
          getGoodsList({
            good_id: JSON.parse(this.formData.act.buy_prize),
          })
            .then((res) => {
              if (res.code) throw new Error(res.msg);
              this.paramsGood.goodsList.push(res.data.list[0]);
            })
            .catch((e) => {
              this.$message.error(e.msg || e.message || "获取商品信息失败");
            })
            .finally(() => (this.isLoading = false));
        })
        .catch((e) => {
          this.$message.error(e.msg || e.message || "获取活动详情失败");
        })
        .finally(() => (this.isLoading = false));
    }
  },
  mounted() {},
  methods: {
    // 保存活动信息数据createAct   this.$route.query.activity_id
    save(formName, status, choose) {
      const { act, awards } = this.formData;
      this.$refs[formName].validate((valid, error) => {
        if (valid) {
          if (this.paramsGood.goodsList.length <= 0)
            return this.$message.error("请选择活动购买商品!");
          let award_data = [];
          awards.forEach((el) => {
            let el_data = {
              level: el.level,
              type: el.type,
              pic: el.pic,
              name: el.name,
              rate: el.rate * 10000,
              available: el.available,
              stock_perday: el.isEverydayGift ? el.stock_perday : null,
              join_at: el.isTimingOn ? el.join_at : null,
              score: el.type == "S" ? el.score : null,
              gift_id: el.type == "G" ? el.gift[0].gift_id : null,
              gift_name: el.type == "G" ? el.gift[0].title : null,
              id: el.id ? el.id : null,
            };
            award_data.push(el_data);
          });
          let data = Object.assign({}, this.formData, {
            act: {
              inst_config_info: "",
              scenario_predef_id,
              scence_id,
              id: this.$route.query.activity_id ? act.id : null,
              status,
              name: act.name,
              begin_at: this.$route.query.activity_id
                ? moment(act.begin_at).format("YYYY-MM-DD hh:mm:ss")
                : act.begin_at,
              end_at: this.$route.query.activity_id
                ? moment(act.end_at).format("YYYY-MM-DD hh:mm:ss")
                : act.end_at,
              buy_good_begin_at: this.$route.query.activity_id
                ? moment(act.buy_good_begin_at).format("YYYY-MM-DD hh:mm:ss")
                : act.buy_good_begin_at,
              buy_good_end_at: this.$route.query.activity_id
                ? moment(act.buy_good_end_at).format("YYYY-MM-DD hh:mm:ss")
                : act.buy_good_end_at,
              invite_icon: act.invite_icon,
              invite_creative: act.invite_creative,
              if_display: act.if_display,
              invite_prize: Number(act.invite_prize),
              ext_params: {
                rule: {
                  type_id: act.ext_params.rule.type_id,
                  rule_data:
                    act.ext_params.rule.type_id == "1"
                      ? act.ext_params.rule.text
                      : act.ext_params.rule.img,
                },
              },
              buy_prize: this.$route.query.activity_id
                ? act.buy_prize
                : this.paramsGood.goodsList[0].good_id,
              // ? act.buy_prize
              // : this.formData.act.buy_prize,
            },
            awards: award_data,
          });
          data.act.ext_params = JSON.stringify(data.act.ext_params);
          this.isLoading = true;
          if (Object.prototype.hasOwnProperty.call(data, "buy_type"))
            delete data.buy_type;
          createAct(data)
            .then((res) => {
              if (res.code) throw new Error(res.msg);
              choose == "over"
                ? (this.$message.success(
                    "活动信息保存成功! 请到互动列表页查看!"
                  ),
                  this.$router.push({
                    path: "/",
                  }))
                : this.$router.push({
                    path: "/paint",
                    query: { activity_id: res.data.id },
                  });
            })
            .catch((e) => {
              this.$message.error(e.msg);
            })
            .finally(() => (this.isLoading = false));
        } else {
          let errmsg = "";
          Object.entries(error).forEach((el) => {
            if (el[1] && el[1][0] && el[1][0].message) {
              if (!errmsg) errmsg = el[1][0].message;
            }
          });
          this.$message.error(errmsg);
        }
      });
    },
    // 取消商品
    delGood(id) {
      this.paramsGood.goodsList = this.paramsGood.goodsList.filter((item) => {
        return item.id != id;
      });
    },
    // 开启选择商品dialog
    async selectGood() {
      try {
        const result = await openSelectGood(this.paramsGood);
        this.paramsGood.goodsList = result;
      } catch (error) {
        this.$message.error(error);
      }
    },
    // 交换奖品位置
    giftMove(index, direction) {
      if (index < 0) return;
      if (direction > 0 && index < this.formData.awards.length) {
        let tempOption = this.formData.awards[index - 1];
        this.$set(this.formData.awards, index - 1, this.formData.awards[index]);
        this.$set(this.formData.awards, index, tempOption);
      } else if (direction < 0 && index >= 0) {
        let tempOption = this.formData.awards[index + 1];
        this.$set(this.formData.awards, index + 1, this.formData.awards[index]);
        this.$set(this.formData.awards, index, tempOption);
      }
    },
    // 添加奖品
    addGift() {
      if (this.$route.query.activity_id)
        return this.$message.error("编辑时不能添加新奖品!");
      if (this.formData.awards.length > 9)
        return this.$message.error("超过10个奖项啦!!");
      this.formData.awards.push({
        name: "", // 奖品名称
        gift_name: "", // 礼品名称
        rate: "", // 中奖概率
        available: "", // 奖项库存  or  限量
        score: "", // 奖励积分
        stock_perday: "", // 每日最大抽取的礼品数量
        isEverydayGift: false, // 控制每日送出量
        isTimingOn: false, // 定时投放礼品
        join_at: "", // 投放时间
        pic: "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/a12762155661f0025f8251fc85ad64b7.png",
        level: 1, // 奖项等级
        type: "G", // 礼品类型 Z:再來一次 N:未中奖 S:积分 G:礼品
        show: false, // 是否折叠
        gift: [],
      });
    },
    // 删除奖品
    removeGift(item) {
      if (this.$route.query.activity_id) return;
      var index = this.formData.awards.indexOf(item);
      if (index !== -1 && index != 0) {
        this.formData.awards.splice(index, 1);
      }
    },
    // 控制折叠
    toggle(item, is_show) {
      var index = this.formData.awards.indexOf(item);
      this.formData.awards[index].show = !is_show;
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style lang="less" scoped>
// 首页容器样式
.index-container {
  position: relative;
  padding-top: 20px;
  padding-bottom: 20px;
  .check-content {
    text-align: center;
  }
  .form-content {
    .content-title {
      height: 35px;
      line-height: 35px;
      padding-left: 20px;
      background-color: #f2f2f2;
      font-size: 14px;
      font-weight: 600;
      border-left: 3px solid #3498db;
    }
    .content-info {
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #f2f2f2;
      .award-textarea {
        width: 400px;
      }
      .img-prompt {
        position: relative;
        display: inline-block;
      }
      @keyframes hovermask-in {
        from {
          opacity: 0;
          transform: translateX(80px);
        }

        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .img-prompt:hover:after {
        animation: hovermask-in 0.3s;
        content: " ";
        display: block;
        position: absolute;
        width: 300px;
        height: 533.6px;
        left: 50px;
        top: -200px;
        z-index: 100;
        display: inline-block;
        background-image: url(//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/134a28101ea8068bbe46bfa01ca07598.png);
        background-size: 100%;
        background-repeat: no-repeat;
        padding: 10px;
        border-radius: 10px;
        box-shadow: 0 0 10px #ddd;
      }
      .invite-prize {
        display: flex;
        align-items: center;
      }
      .type-radio {
        display: flex;
        align-items: center;
        .radio-font {
          margin-right: 10px;
        }
      }
      .info-back-font {
        padding-left: 10px;
        color: #999999;
      }
      .select-img-back-font {
        color: #999999;
        .blue-font {
          padding-left: 5px;
          color: #409eff;
        }
      }
      .select-img {
        /deep/ .el-form-item__content {
          display: flex;
        }
        .content-reset {
          align-self: flex-end;
        }
        .inner-disable {
          background-color: #f5f7fa;
          border-color: #e4e7ed;
          color: #c0c4cc;
          cursor: not-allowed;
        }
        .inner-content {
          display: flex;
          border: 1px solid #d9d9d9;
          width: 330px;
          padding: 10px;
          border-radius: 6px;
          margin-right: 10px;
          .imgcomponent-content {
            margin-right: 10px;
            position: relative;
            .img-packer {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 125px;
              height: 125px;
              border: 1px dashed #d9d9d9;
              border-radius: 12px;
            }
            .cover-img-packer {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              width: 330px;
              height: 128px;
              background-color: transparent;
            }
          }
        }
      }
    }
  }
}
.check-content {
  margin-top: 20px;
}
</style>
