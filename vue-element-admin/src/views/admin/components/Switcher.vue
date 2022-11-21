<template>
  <el-switch
    v-model="switchValue"
    active-color="#13ce66"
    inactive-color="#ff4949"
    :active-value="1"
    :inactive-value="0"
    :disabled="disabled"
    @change="change"
  />
</template>

<script>
export default {
  name: 'Switcher',
  props: {
    value: {
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      switchValue: this.value
    }
  },
  methods: {
    change(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped>

</style>
