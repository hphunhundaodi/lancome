/**
 * 请勿修改此文件   请勿修改此文件    请勿修改此文件
 * 请勿修改此文件   请勿修改此文件    请勿修改此文件
 * 请勿修改此文件   请勿修改此文件    请勿修改此文件
 * 请勿修改此文件   请勿修改此文件    请勿修改此文件
 * 请勿修改此文件   请勿修改此文件    请勿修改此文件
 */
// window.$$ENV = new Object();
// window.$$INFO = new Object();                                 // 同步时删掉 这两个定义是为了不报错
import { initApp } from '../jifenn-interaction-core';
import cfg from './config';
import Vue from 'vue';

import imgPicker from '@jifenn/enbrands-interaction-tools/components/imgPicker'
import elCopy from '@jifenn/enbrands-interaction-tools/components/el-copy'
import jfQrcode from '@jifenn/enbrands-interaction-tools/components/jf-qrcode'
import giftService from './service/giftService'
Vue.prototype.$giftService = giftService;

Vue.component('imgPicker', imgPicker);
Vue.component('elCopy', elCopy);
Vue.component('jf-qrcode', jfQrcode);



initApp(cfg);