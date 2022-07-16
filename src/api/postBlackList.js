import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
export default (data) => ajax.post('/newenbrands/apis/batchtplexport/batch-blacklist-uploads', data , { 
    headers: {"content-type": "multipart/form-data"}
})