<template>
  <div>
    <div style="font-weight: bold">{{ k }}</div>
    <div class="value">
      <i v-if="type === 'status'" class="circle" :style="&quot;background-color:&quot; + statusColor(val)" />
      {{ filterValue(val) }}
    </div>
    <el-progress
      v-if="type === 'status' && val === 'Preparing'"
      :text-inside="true"
      :stroke-width="15"
      :percentage="progress"
      :format="progressFormat"
    />
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'FileAttrItem',
  props: {
    'type': {
      type: String,
      default: ''
    },
    'k': {
      type: String,
      default: ''
    },
    'val': {
      type: String,
      default: ''
    },
    'progress': {
      type: Number,
      default: 0
    }
  },
  watch: {
    progress(newValue, oldValue) {
      if (newValue === 100 && oldValue !== 100) {
        setTimeout(() => {
          this.$emit('uploadComplete')
        }, 1500)
      }
    }
  },
  methods: {
    statusColor(status) {
      let color
      if (status === 'Completed') { color = '#67C23A' } else if (status === 'uploading' || status === 'Preparing') { color = '#E6A23C' } else { color = '#FF0000' }
      return color
    },
    filterValue(value) {
      let res = value
      if (this.type === 'time') {
        res = moment(value).format('YYYY-MM-DD HH:mm:ss')
      }
      if (res.length > 50) {
        res = res.slice(0, 35) + '...(详见日志)'
      }
      return res
    },
    progressFormat(percentage) {
      if (this.k === 'k2s') {
        return '此策略无实时进度'
      }
      return percentage + '%'
    }
  }
}
</script>

<style scoped>
.circle {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 3px;
}

.value {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
