import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
const URl = '/newenbrands/apis/hdactivity/hd-url';

export default (params) => ajax.get(URl, params)