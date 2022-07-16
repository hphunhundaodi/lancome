import selectGood from './index.vue'
import modalLoader from '@jifenn/enbrands-interaction-tools/utils/modalLoader'

const openSelectGood = (data = {}) => {
    return modalLoader(selectGood, {
        data
    })
}
export {
    selectGood, // 包含 [选择礼品] 按钮组件的
    openSelectGood, // 调用模式，直接弹框
};