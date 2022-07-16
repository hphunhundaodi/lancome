const moment = require('moment')

const generateTrendData = () => {
    const now = moment().hour(0).minute(0).second(0).millisecond(0)
    const start = moment().hour(0).minute(0).second(0).millisecond(0).add(-90,"days")

    const data = {};

    while(start<now){
        data[start.format('YYYY-MM-DD')] = parseInt(Math.random() * 1000000)
        start.add(1, 'days')
    }

    return data
}

module.exports = (query, req) => {
    const keys = [
        "all_increment_member",
        "all_invite_uv",
        "all_member_uv",
        "all_new_member",
        "all_no_member_uv",
        "all_open_invited_uv",
        "all_pv",
        "all_revive_member",
        "all_uv",
        "buyer_count_today",
        "buyer_count_total",
        "increment_member",
        "invite_uv",
        "member_uv",
        "new_member",
        "no_member_uv",
        "open_invited_uv",
        "order_count_today",
        "order_count_total",
        "order_fee_sum_today",
        "order_fee_sum_total",
        "order_payment_sum_today",
        "pv",
        "revive_member",
        "uv",
        "order_payment_sum_total",

        "all_open_invite_increment_member", // 累计 被邀请后成功入会人数
        "open_invite_increment_member", // 当日 被邀请后成功入会人数
        "all_help_yg_uv", // 累计 被邀请后助力购买人数
        "help_yg_uv", // 当日 被邀请后助力购买人数
        "help_yg_order_count_total",  // （助力后）购买笔数
        "help_yg_order_payment_total",  // （助力后）购买金额

        "help_yg_order_count_today", // 助力后购买笔数
        "help_yg_order_payment_today", // 助力后购买金额

        "help_yg_member_total", // 总助力人数

    ]

    const basic = {}
    const trend_chart = {}

    keys.forEach(key=>{
        basic[key] = parseInt(Math.random() * 1000000);
        trend_chart[key] = generateTrendData();
    })

    const activity = {
        "id": 623,
        "merchant_num": 1900104,
        "name": "\u7cfb\u7ade\u4e89\u80051234567890123456",
        "begin_at": moment().hour(0).minute(0).second(0).millisecond(0).add(-90,"days").format('YYYY-MM-DD HH:mm:ss'),
        "end_at": moment().hour(0).minute(0).second(0).millisecond(0).add(7,"days").format('YYYY-MM-DD HH:mm:ss'),
        "status": 3,
        "scence_id": 35,
    }


    return {
        code: 0,
        msg: '',
        data: {
            basic,
            trend_chart,
            activity,
            date: moment().format('YYYY-MM-DD')
        }
    }
}