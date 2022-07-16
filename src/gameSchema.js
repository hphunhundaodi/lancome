export default {
	"scenario_predef_id": 56, // 互动类型ID
	"scence_id": 56, // 互动场景ID
	"name": "兰蔻会员抽奖",
	"img_url": "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/efa350703e66cf830449826486f2d422.png",
	// 'http://enbrands-2.oss-cn-shanghai.aliyuncs.com/user/712205c68590bf358ae2b911882047d0.png'
	"description": "会员购买指定商品后，即可获得抽奖机会，在指定时间完成正装购买即可获得抽奖的礼品！！！",
	"is_new": true,
	// 测试 1000012
	// 生产 lancome兰蔻官方旗舰店 1000983, 李政平99 1012921
	"merchant_num": [1000983, 1012921],

	// 获取参与人数   /apis/activity/activity-join-count   /newenbrands/apis/hdactivity/act-join-count
	"getCount": async function (ajax, item) {
		return ajax.get("/apis/activity/activity-join-count", {
			activity_id: item.id,
		})
			.then((res) => res.data.join_count)
			.catch(() => 0);
	}
}