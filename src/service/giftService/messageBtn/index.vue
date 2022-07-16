<template>
  <div class="btn-msg-wrap">
    <el-button
        style="min-width: 90px;"
        :size="size"
        :disabled="disabled || isDisable"
        type="primary"
        @click="handleBtnSendMsg">{{ this.isDisable ? (count + 's') : btnText }}</el-button>
  </div>
</template>
<script type="text/javascript">
  const COUNT_NUMBER = 60
  export default {
    name: 'MessageBtn',
    data() {
      return {
        isDisable: false,
        btnText: '获取验证码',
        count: COUNT_NUMBER,
        timer: null
      }
    },
    props:{
      disabled: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: 'small'
      }
    },
    created() {
      this.reset()
    },
    mounted() {
    },
    methods: {
      handleBtnSendMsg() {
        if (this.isDisable) {
          return
        }
        this.isDisable = true
        this.startTimer()
        this.$emit('btn-click')
      },

      reset() {
        this.isDisable = false
        this.btnText = '获取验证码'
        this.count = COUNT_NUMBER
        this.timer && clearTimeout(this.timer)
      },

      startTimer() {
        if (this.count <= 0) {
          this.reset()
          return
        }
        this.count -= 1
        this.timer = setTimeout(() => {
          this.startTimer()
        }, 1000)
      },
    },
    beforeDestroy() {
      this.reset()
    }
  };
</script>
<style lang="less" scoped>
	.btn-msg-wrap {
		display: inline-block;
	}
</style>