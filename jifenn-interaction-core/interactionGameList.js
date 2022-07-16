
const game_list = [
    //许愿购物袋
    {
        "activity_id": 8,
        "name": "许愿购物袋",
        "description": "适应于活动预热期间通过引导消费者将目标商品提前加入购物车，间接提升店铺销量的互动玩法。",
        "img_url": "//enbrands.oss-cn-shenzhen.aliyuncs.com/%E8%AE%B8%E6%84%BF%E8%B4%AD%E7%89%A9%E8%A2%8B/theme.png",
        "sync_import": () => {
            // return import(/* webpackChunkName: "game.shoppingBag.index" */"@game/shoppingBag/index.vue")
        },
        "record_component": () => {
            // return import(/* webpackChunkName: "game.shoppingBag.record" */"@game/shoppingBag/record/index.vue")
        },
        "stats_component": () => {
            // return import(/* webpackChunkName: "game.shoppingBag.statistics" */"@game/shoppingBag/statistics/app.vue")
        },
        "reward_component": () => {
            // return import(/* webpackChunkName: "game.shoppingBag.reward" */"@game/shoppingBag/reward/index.vue")
        },
        "merchant_num": [2147480002, 2000009, 2000013, 2000068, 1900125, 1900104, 1000000, 1005526, 1003674, 1003675]
    },
    {
        "activity_id": 1,
        "name": "品牌环游",
        "description": "品牌环游是一款让消费者在游戏过程中了解品牌历史及品牌知识的游戏。通过游戏，在游戏世界里解锁一张张精美的品牌卡片，在游戏过程中还会遇到各种有趣的事情，体验游戏的乐趣。",
        "img_url": "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/5b6741cc86f4d2226e3b4040275a2d89.jpg",
        "entry_path": "./travelAround",
        "sync_import": () => {
            // return import(/* webpackChunkName: "game.travelAround.index" */"@game/travelAround/index.vue")
        },
        "record_component": () => {
            // return import(/* webpackChunkName: "game.travelAround.record" */"@game/travelAround/record/index.vue")
        },
        "stats_component": () => {
            // return import(/* webpackChunkName: "game.travelAround.stats" */"@game/travelAround/stats/index.vue")
        },
        "merchant_num": [1000000, 1000049, 1000041, 1000836, 1900110, 1900088]
    },
    {
        "activity_id": 6,
        "name": "限定券",
        "img_url": "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/61c9f6dd67752b0a75f8431f1d5f1878.png",
        "description": "通过领取优惠券的方式，引导消费者入会，关注等",
        "sync_import": () => {
            // return import(/* webpackChunkName: "game.restricted_coupon.index" */"@game/restricted_coupon/index.vue")
        },
        "record_component": () => {
            // return import(/* webpackChunkName: "game.restricted_coupon.record" */"@game/restricted_coupon/record/index.vue")
        },
        "stats_component": () => {
            // return import(/* webpackChunkName: "game.restricted_coupon.statistics" */"@game/restricted_coupon/statistics/app.vue")
        },
        "merchant_num": [1000000, 1000049, 1000041, 1000836, 1900110, 1900088, 1000001, 1900104, 1002807]
    },
]


const game_map = {};
game_list.forEach((item) => {
    game_map[item.activity_id] = Object.assign({}, item)
})
export default {
    game_list,
    game_map
}
