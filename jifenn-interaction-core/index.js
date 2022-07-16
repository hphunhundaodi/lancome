import Vue from 'vue'
import VueRouter from 'vue-router'
import frame from './frame.vue'
import List from './list.vue'
import Guide from './guide.vue'
import 'es6-promise/auto'

import './base.css'
import './index.less'
import Vuex from 'vuex'

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(Vuex);

import createStore from '../src/store'
export function initApp(cfg) {
    const router = new VueRouter({
        routes: [...cfg.routers.map(item => {
            item.path = '' + item.path
            return item
        }), {
            path: '',
            component: List
        }, {
            path: '/guide',
            component: Guide
        }]
    });

    Vue.prototype.$$jifenn_game_tools = cfg.tools;
    Vue.prototype.$$jifenn_game_defined = cfg.gameSchame;

    new Vue({
        router,
        store: new Vuex.Store(createStore),
        render: h => h(frame),
    }).$mount('#app');
}