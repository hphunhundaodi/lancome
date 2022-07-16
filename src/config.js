import create from './view/create/index.vue';
import paint from './view/paint/index.vue';
import tools from './tools.vue';
import gameSchema from './gameSchema';
import giftSendRecord from './view/giftSendRecord/index.vue';
import datav from './view/datav/index.vue';
import store from './store';

export default {
  // 互动相关的信息
  // 此处信息具有唯一性，应该向云积分申请
  gameSchame: gameSchema,
  tools: tools,
  // 路由规则配置
  // 路由规则会被合并到整个后台的规则配置中
  routers: [
    // 必须实现的路由配置
    { name: '创建活动', path: '/create', component: create },
    { name: '装修', path: '/paint', component: paint },
    { name: '编辑活动', path: '/edit', component: create },
    { name: '礼品发放记录', path: '/giftSendRecord', component: giftSendRecord },
    { name: '数据统计', path: '/datav', component: datav },
  ],
  store
}
