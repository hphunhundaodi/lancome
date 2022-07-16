import { pick, keys } from "lodash";
import moment from "moment";

const initData = {
    formData: {
        act: {
            scenario_predef_id: 56,
            status: 2,
            scence_id: 0,
            inst_config_info: "", // 装修配置Json
            name: "", // 活动名称
            act_time: [], // 活动时间
            begin_at: "", // 活动开始时间
            end_at: "", // 活动结束时间
            invite_icon: "", // 分享图标地址
            invite_creative: "", // 分享文案
            if_display: 1, // 推广方式  是否在会员中心展示，1展示 0不展示
            invite_prize: "", // 抽奖次数设置
            buy_time: [], // 购买商品时间
            buy_good_begin_at: "", // 购买商品时间开始时间
            buy_good_end_at: "", // 购买商品时间结束时间
            // 活动规则信息和商品信息
            ext_params: {
                // 活动规则
                rule: {
                    img: "", // 图片
                    text: "", // 富文本
                    type_id: "1", // 类型。1是富文本，2是图片
                    rule_data: "", // 富文本或者图片地址
                },
                buy_prize: "", // 购买的商品id
            },
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
}

export const transporeData = {
    methods: {
        // 组件数据输入转换
        mixinInnerData(data, source) {
            data.act = pick(data.act, keys(source.act))
            let innerData = data
            innerData.act.ext_params = JSON.parse(innerData.act.ext_params);

            innerData.act.act_time = [
                moment(innerData.act.begin_at).toDate(),
                moment(innerData.act.end_at).toDate(),
            ];
            innerData.act.buy_time = [
                moment(innerData.act.buy_good_begin_at).toDate(),
                moment(innerData.act.buy_good_end_at).toDate(),
            ];
            innerData.act.ext_params.rule.type_id == "1"
                ? this.$set(
                    innerData.act.ext_params.rule,
                    "text",
                    innerData.act.ext_params.rule.rule_data
                )
                : this.$set(
                    innerData.act.ext_params.rule,
                    "img",
                    innerData.act.ext_params.rule.rule_data
                );
            innerData.awards.forEach((el) => {
                el.rate /= 10000
                el.gift = [{ gift_id: el.gift_id, title: el.gift_name }];
                this.$set(el, "show", false);
                el.stock_perday != ""
                    ? this.$set(el, "isEverydayGift", true)
                    : this.$set(el, "isEverydayGift", false);
                el.join_at == undefined
                    ? this.$set(el, "isTimingOn", false)
                    : this.$set(el, "isTimingOn", true);
            });
            return innerData
        },
        // 装修组件数据转入
        mixinRaffleInnerData(data) {
            data.act = pick(data.act, keys(initData.formData.act))
            let innerData = data
            innerData.act.inst_config_info = JSON.parse(innerData.act.inst_config_info)
            return innerData
        }
    }
}