import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
let url = null;
export default async function (id) {
    if(url){
        return url
    }else{
        const rsp = await ajax.get('/newenbrands/apis/hdactivity/hd-url', {activity_id: id});
        return url = rsp.data.url
    }
}