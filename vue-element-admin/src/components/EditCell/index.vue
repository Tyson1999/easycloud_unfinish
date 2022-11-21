<template>
  <div class="editCell">
    <div v-if="canEdit" class="canEdit" @click="beginEdit">
      <label v-show="!editStatus">
        <span v-if="value!== null && value !== undefined && value !== ''">{{ truncateLongText(value) }}{{ suffix }}</span>
        <span v-else style="padding-left: 100%; padding-top: 100%" />
      </label>
      <label v-show="editStatus">
        <input
          ref="input"
          type="text"
          class="inputClass"
          :value="value"
          @keyup.13="loseFocus"
          @blur="loseFocus"
        >
      </label>
    </div>

    <label v-else class="cannotEdit">
      <span>{{ value }}{{ suffix }}</span>
    </label>
  </div>
</template>

<script>
// https://blog.csdn.net/qq_41154522/article/details/109337730
export default {
  name: 'EditCell',
  props: {
    /**
     * 绑定值
     */
    value: {
      required: true
    },
    /**
     * 数据类型
     */
    type: {
      type: String,
      default: 'text'
    },
    /**
     * 是否可编辑
     */
    canEdit: {
      type: Boolean,
      default: true
    },
    /**
     * 格式化函数
     */
    formatData: {
      type: Function,
      default: value => {
        return value
      }
    },
    /**
     * 编辑后事件
     */
    afterEdit: {
      type: Function,
      default: () => {}
    },
    /**
     * 是否初始格式化
     */
    initFormat: {
      type: Boolean,
      default: true
    },
    suffix: {
      default: ''
    }
  },
  data() {
    return {
      editStatus: false,
      defaultData: ''
    }
  },
  // watch: {
  //   'value': function(newVal) {
  //     this.$emit('input', this.formatData(newVal))
  //   }
  // },
  mounted() {
    if (this.initFormat) {
      this.initData()
    }
  },
  methods: {
    /**
     * 单击开始编辑
     */
    beginEdit() {
      this.editStatus = true
      setTimeout(() => {
        this.$refs.input.focus()
      }, 1)
    },

    /**
     * @param {event} event
     * 丢失焦点关闭编辑状态，并保存数据
     */
    loseFocus(event) {
      const value = this.formatData(event.target.value)
      this.editData(value)
      this.closeEditStatus()
      this.afterEdit(value)
    },
    /**
     * 发布input事件修改数据
     * @param value
     */
    editData(value) {
      this.$emit('input', value)
    },

    /**
     * 关闭编辑状态
     */
    closeEditStatus() {
      this.editStatus = false
    },
    /**
     * 初始格式化数据
     */
    initData() {
      const newValue = this.formatData(this.value)
      this.$emit('input', newValue)
    },
    truncateLongText(text) {
      if (text.length > 50) {
        return text.substring(0, 50) + '...'
      }
      return text
    }
  }
}
</script>

<style scoped>
.editCell {
  height: 100%;
  width: 100%;
}
.inputClass {
  height: 30px;
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  line-height: 30px;
  outline: 0;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  overflow: visible;
  touch-action: manipulation;
  margin: 0;
}
</style>
