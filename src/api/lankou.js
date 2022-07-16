import httpRequest from "@jifenn/enbrands-interaction-tools/utils/ajax";
// import gameSchema from '../gameSchema';
// const { scenario_predef_id, scence_id } = gameSchema;

const BASE_URL = process.env.NODE_ENV === 'development'
	? 'http://192.168.0.102:8088'
	: ''

/**
 * 创建活动
 * @param {object} data 活动数据
 */
export const createAct = (data) => httpRequest.post(`${BASE_URL}/apis/activity/addact`, data);
/**
 * 获取活动统计数据
 * @param {object} data 获取活动统计数据
 */
export const getActStatistical = (data) => httpRequest.get(`${BASE_URL}/apis/activity/lankou-activity-statistical`, data);
/**
 * 获取中奖记录
 * @param {object} data 获取中奖记录
 */
export const getActRewardList = (data) => httpRequest.get(`${BASE_URL}/apis/activity/lankou-win-prize-log`, data);
/**
 * 获取中奖类型列表
 * @param {object} data 获取中奖类型列表
 */
export const getActRewardListType = (data) => httpRequest.get(`${BASE_URL}/apis/activity/lankou-reward-levels`, data);

/**
 * 获取商品列表
 */
export const getGoodsList = (data) => httpRequest.get(`${BASE_URL}/apis/activity/new-goodlist`, data);

/**
 * 获取活动数据
 */
export const getActivity = (data) => httpRequest.get(`${BASE_URL}/apis/activity/activity`, data);

/**
 * 更改活动状态
 */
export const changeStatus = (data) => httpRequest.post(`${BASE_URL}/apis/activity/changestatus`, data);

/**
 * 同步OMG
 */
export const synchronousOms = (data) => httpRequest.post(`${BASE_URL}/apis/activity/synchronous-oms`, data);

