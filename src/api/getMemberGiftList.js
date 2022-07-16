import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
const URl = '/newenbrands/apis/hdactivity/gift-order-list';

export default (params) => ajax.get(URl, params)