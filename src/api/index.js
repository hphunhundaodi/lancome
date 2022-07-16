import httpRequest from "@jifenn/enbrands-interaction-tools/utils/ajax";
import gameSchema from '../gameSchema';
const { scenario_predef_id, scence_id } = gameSchema;

// https://wiki.enbrands.com/pages/viewpage.action?pageId=6787221
export default {
  /**
   * 查询预置的活动礼品列表
   * @param {number} activity_id 活动ID
   * @description 编辑活动时调用
   */
  async getActGiftList(activity_id) {
    return await httpRequest.get("/newenbrands/apis/hdactivity/act-gift-list", {
      activity_id
    });
  },
  /**
   * 添加预置活动礼品库-编辑活动用
   * @param {number} gift_id 礼品id
   * @param {number} gift_num 礼品活动总库存
   * @param {number} activity_id 活动id
   */
  async addActGift(gift_id, gift_num, activity_id) {
    return await httpRequest.post("/newenbrands/apis/hdactivity/add-act-gift", {
      gift_id, gift_num, activity_id
    });
  },
  /**
   * 删除预置活动礼品
   * @param {number} act_gift_id 
   */
  async delActGift(act_gift_id) {
    return await httpRequest.post("/newenbrands/apis/hdactivity/del-act-gift", {
      act_gift_id
    });
  },
  /**
   * 创建活动
   * @param {object} data 活动数据
   */
  async createAct(data) {
    return await httpRequest.post("/newenbrands/apis/hdactivity/add-act", { scence_id, scenario_predef_id, ...data });
  },
  /**
   * 编辑活动
   * @param {number} old_id 旧活动id
   * @param {number} id 活动id
   * @param {object} data 活动数据
   */
  async editAct(old_id, id, data) {
    return await httpRequest.post("/newenbrands/apis/hdactivity/add-act", {
      old_id, id, ...data
    });
  },
  /**
   * 查询活动详情
   * @param {number} id 活动ID
   */
  async getActInfo(id) {
    return await httpRequest.get("/newenbrands/apis/hdactivity/act-detail", { id });
  },
  /**
   * 查询活动礼品库存变更记录
   * @param {number} act_gift_id 
   * @param {number} page_num 
   * @param {number} page_size 
   */
  async getStockLog(param) {
    return await httpRequest.get("/newenbrands/apis/hdactivity/act-gift-stock-log", param);
  },
  /**
   * 变更活动礼品库存
   * @param {*} act_gift_id 
   * @param {*} change_num 
   */
  async editStock(act_gift_id, change_num) {
    return await httpRequest.post("/newenbrands/apis/hdactivity/edit-act-gift-stock", { act_gift_id, change_num });
  },
  /**
   * 查询系统设置的礼品图标
   */
  async getPointIcon() {
    const { score_icon } = (await httpRequest.get("/apis/featurelimit/getpointinfo")).data;
    return score_icon;
  },
}