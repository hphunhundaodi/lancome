import Vue from 'vue';

export default (Dialog, config = {}) => {
    return new Promise((resolve, reject) => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const inst = new Vue({
            el: div,
            components: { Dialog },
            data() {
                return {
                    params: config.data || {}
                }
            },
            methods: {
                onOk: (val) => {
                    inst.$destroy();
                    resolve(val)
                    try {
                        document.body.removeChild(inst.$el)
                    } catch (e) {
                        console.log(e)
                    }
                },
                onClose: () => {
                    inst.$destroy();
                    try {
                        document.body.removeChild(inst.$el)
                    } catch (e) {
                        console.log(e)
                    }
                },
                onReject: (e) => {
                    reject(e);
                    inst.$destroy();
                    try {
                        document.body.removeChild(inst.$el)
                    } catch (e) {
                        console.log(e)
                    }
                }
            },
            render(createElement) {
                return createElement(Dialog, {
                    props: {
                        onClose: this.onClose,
                        onReject: this.onReject,
                        params: this.params,
                        onOk: this.onOk
                    }
                })
            }
        })
    })
}