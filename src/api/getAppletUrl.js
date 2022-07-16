import ajax from "@jifenn/enbrands-interaction-tools/utils/ajax";
import gameSchema from "../gameSchema"

let url = null;
export default async function () {
    if (url) {
        return url
    } else {
        const rsp = await ajax.get('/activity-api/basic/tb-applet/get-applet-url', { templates: ['3000000006501031'] });
        // 页面url
        const miniUrl = 'pages%2FlancomeCardLottery%2Findex'
        return url = rsp.data["3000000006501031"].online_url + `&page=${miniUrl}&query=`
    }
}