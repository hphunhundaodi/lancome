import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
export default (params) => ajax.post('/newenbrands/apis/hdactivity/change-act-status', params)