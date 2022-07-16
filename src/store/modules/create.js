import API from "../../api";
/**
 * 创建编辑活动
 * @description https://wiki.enbrands.com/pages/viewpage.action?pageId=6787333
 */
const baseReward = {
  reward_type: 1, // 奖励类型,1-积分,2-礼品
  reward_pic: "//enbrands-2.oss-cn-shanghai.aliyuncs.com/ebs/gift_score.png?x-oss-process=style/imagespace-preview",
  reward: null, // 积分类型时为具体积分值，礼品时传活动礼品id
  send_control: 0, // 每日发放控制 0-否，1-是
  everyday_num: null, // 每日库存
};
let defaultInviteReward = Object.assign({
  switch: 0, // 是否推荐，1 是 0 否
  invite_count: null, // 奖励达成条件（邀请多少人）
}, baseReward);
let defaultRegisterReward = Object.assign({
  switch: 1, // 入会奖励开关，1 开 0 关
}, baseReward);
const defaultState = {
  baseReward,
  defaultInviteReward, // 用的时候需要深拷贝
  defaultRegisterReward, // 用的时候需要深拷贝
  actInfo: {
    name: "",
    act_date: [],
    begin_at: "",
    end_at: "",
    settings: {
      rules: "",
      rules_type: 1,
      share_title: "",
      share_content: "",
      share_icon: "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/f03f9cd909d6e4b6858579b9a34395ee.png",
      register_reward: { ...defaultRegisterReward },
      invite_reward: [{ ...defaultInviteReward }, { ...defaultInviteReward }], // 务必深拷贝，不让JS引用类型会出bug
    },
  },
  giftList: [
    // {
    //   'id': 1,
    //   'gift_id': 900001,
    //   'title': '淘宝20元优惠券',
    //   'pic_url': '//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/fee5faf6cc31502fd67d3827ec2fb566.png',
    //   'type_id': '800200',
    //   'type_name': '淘宝优惠券',
    //   'expire_type': 1,
    //   'eff_date': '2020-11-12 12:00:00',
    //   'exp_data': '2020-11-12 12:00:00',
    //   'created_at': '2020-11-12 12:00:00',
    //   'total_num': 100,
    //   'available_num': 200,
    //   'gift_status': 6
    // }
  ],
  styles: {
    btn_bg_color: "#F2DBA7",
    btn_font_color: "#926A33",
    btn_style: 1,
    inviter: {
      bg_image: "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/8af560bda6bd21a4257cc7159f0dfcbb.png",
      btn_txt: "邀请好友助力",
      show_notice: true,
      show_countdown: true,
      show_stock: true,
      show_goods: true,
      goods: [],
    },
    invitee: {
      banner: "//enbrands-2.oss-cn-shanghai.aliyuncs.com/user/ef75270a185699ff3aa020e65402a482.png",
      new_btn_txt: "为好友助力",
      old_btn_txt: "发起助力赢好礼",
    },
    dialog: {
      bg_image: "",
    },
  },
  submitValidate: {
    1: false,
    2: false,
    3: true,
  },
  showHomePage: false,
  showSharePage: false,
  inviteCollapse: [],
  registerCollapse: [0],
}
const create = {
  state: JSON.parse(JSON.stringify(defaultState)),
  mutations: {
    SetActInfo: (state, data) => {
      state.actInfo = data;
    },
    SetRegisterReward: (state, data) => {
      state.actInfo.settings.register_reward = data;
    },
    SetInviteReward: (state, data) => {
      state.actInfo.settings.invite_reward = data;
    },
    SetGiftList: (state, data) => {
      state.giftList = data;
    },
    SetStyles: (state, data) => {
      state.styles = data;
    },
    SetSubmitValidate: (state, data) => {
      state.submitValidate = data;
    },
    SetShowHomePage: (state, data) => {
      state.showHomePage = data;
    },
    SetShowSharePage: (state, data) => {
      state.showSharePage = data;
    },
    SetState: (state, data) => {
      Object.assign(state, data)
    },
    SetRegisterCollapse: (state, data) => {
      state.registerCollapse = data;
    },
    SetInviteCollapse: (state, data) => {
      state.inviteCollapse = data;
    },
  },
  actions: {
    setActInfo({ commit }, data) {
      commit("SetActInfo", data);
    },
    setRegisterReward({ commit }, data) {
      commit("SetRegisterReward", data);
    },
    setInviteReward({ commit }, data) {
      commit("SetInviteReward", data);
    },
    setGiftList({ commit }, data) {
      commit("SetGiftList", data);
    },
    setStyles({ commit }, data) {
      commit("SetStyles", data);
    },
    setSubmitValidate({ commit }, data) {
      commit("SetSubmitValidate", data);
    },
    setShowHomePage({ commit }, data) {
      commit("SetShowHomePage", data);
    },
    setShowSharePage({ commit }, data) {
      commit("SetShowSharePage", data);
    },
    setRegisterCollapse({ commit }, data) {
      commit("SetRegisterCollapse", data);
    },
    setInviteCollapse({ commit }, data) {
      commit("SetInviteCollapse", data);
    },
    /**
     * 初始化state
     */
    async initState({ commit }) {
      baseReward.reward_pic = defaultInviteReward.reward_pic = defaultRegisterReward.reward_pic = (await API.getPointIcon()) || baseReward.reward_pic;

      const state = JSON.parse(JSON.stringify(defaultState));
      state.actInfo.register_reward = { ...defaultRegisterReward };
      state.actInfo.invite_reward = [{ ...defaultInviteReward }, { ...defaultInviteReward }];
      state.actInfo.settings.rules = "";
      commit("SetState", state);
      commit("SetActInfo", state.actInfo);
      commit("SetRegisterReward", state.actInfo.register_reward);
      commit("SetInviteReward", state.actInfo.invite_reward);
    },
    /**
     * 获取活动配置的礼品库列表
     * @param {number} id 活动ID
     */
    async getActGiftList({ commit }, id) {
      const { list } = (await API.getActGiftList(id)).data;
      commit("SetGiftList", list);

      return list;
    },
    /**
     * 获取活动详细
     * @param {object} params id: 活动ID; isCopy: 是否拷贝活动
     */
    async getActInfo({ dispatch, commit, state }, params) {
      // 拷贝活动，礼品库需要重新设置
      let giftList = [];
      if (!params.isCopy) {
        const list = await dispatch("getActGiftList", params.id);
        giftList = list;
        commit("SetGiftList", list);
      }

      // 查回来的数据需要清洗一遍，前端才能使用
      const formatData = (reward) => {
        let obj = JSON.parse(JSON.stringify(reward));

        if (obj.everyday_num == 0) {
          obj.everyday_num = null;
        }
        if (obj.reward == 0) {
          obj.reward = null;
        }
        if (obj.reward_type != 1) {
          for (let index = 0; index < giftList.length; index++) {
            const gift = giftList[index];
            if (obj.reward == gift.id) {
              obj.reward_type = gift.gift_id;
              obj.reward_pic = gift.pic_url;
              obj = Object.assign({}, gift, obj);
              break;
            }
          }
        } else {
          obj.reward_pic = state.defaultRegisterReward.reward_pic;
        }

        return obj;
      };

      const { data: actInfo } = await API.getActInfo(params.id);
      if (!params.isCopy) {
        const { register_reward, invite_reward } = actInfo.settings;
        const _invite_reward = [];
        invite_reward.forEach((reward) => _invite_reward.push(formatData(reward)));
        actInfo.settings.invite_reward = _invite_reward;
        actInfo.settings.register_reward = formatData(register_reward);
      } else {
        actInfo.settings.invite_reward = [{ ...defaultInviteReward }, { ...defaultInviteReward }];
        actInfo.settings.register_reward = { ...defaultRegisterReward };
      }

      commit("SetStyles", actInfo.styles);
      delete actInfo.styles;

      actInfo.act_date = [actInfo.begin_at, actInfo.end_at];
      commit("SetActInfo", actInfo);

      return actInfo;
    },
  }
}

export default create;