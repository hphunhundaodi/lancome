import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
// const URL = '/apis/turn/gift/' + encodeURIComponent(encodeURIComponent('/eGift/cancelIssue.back'));
const URL = "/newenbrands/apis/hdactivity/cancel-delivery"
export default (params) => ajax.post(URL, params)
