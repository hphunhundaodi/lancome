import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
export default (params) => ajax.get('/newenbrands/apis/hdactivity/point-send-list', params)