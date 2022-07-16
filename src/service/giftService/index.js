
import modalLoader from "@jifenn/enbrands-interaction-tools/utils/modalLoader";
import editLogisticsInfo from "./editLogisticsInfo/editLogisticsInfo.vue";
import cancelDelivery from "./cancelDelivery/cancelDelivery.vue";
import batchSend from "./batchSend/index.vue";
import lookMessageInfo from "./lookMessageInfo/lookMessageInfo.vue";

export default {
    // showGiftDetail: showGiftDetail,
    queryLogisticsInfo: (cfg) => {
        return modalLoader(editLogisticsInfo, {
            data: {
                order_id: cfg.orderId,
                mode: 'QUERY'
            }
        })
    },
    editLogisticsInfo: (cfg) => {
        return modalLoader(editLogisticsInfo, {
            data: {
                order_id: cfg.orderId,
                user_id: cfg.user_id || '',
                log_id: cfg.log_id || '',
                mode: 'EDIT'
            }
        })
    },

    cancelDelivery: (obj)=>{
        return modalLoader(cancelDelivery, {
            data: {
                ...obj
            }
        })
    },

    batchSend:(obj)=>{
        return modalLoader(batchSend, {
            data: {
                ...obj
            }
        })
    },
    lookMessageInfo: (obj)=>{
        return modalLoader(lookMessageInfo, {
            data: {
                ...obj
            }
        })
    },
    // updateLogisticsInfo: updateLogisticsInfo,
    // reSend: reSend,
    // closeDownLoad : closeDownLoad
}
