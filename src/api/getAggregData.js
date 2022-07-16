import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
export default (params) => ajax.post('/bi-center/erlang/views/getAggregData', params)