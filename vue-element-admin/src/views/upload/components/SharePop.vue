<template>
  <el-popover
    placement="right"
    width="350"
    trigger="click"
  >
    <el-table :data="gridData">
      <el-table-column width="80" property="id" label="ID" />
      <el-table-column width="120" property="type" label="类型" />
      <el-table-column width="150" label="链接">
        <template slot-scope="{row: { link }}">
          <el-button size="mini" type="primary" @click="handleCopy(link, $event)">点击复制</el-button>
        </template>
      </el-table-column>
    </el-table>
    <slot slot="reference" />
  </el-popover>
</template>

<script>
import clip from '@/utils/clipboard'
export default {
  props: ['fileId'],
  data() {
    return {
      gridData: []
    }
  },
  methods: {
    parseShareDetail(shareDetail) {
      this.gridData = []
      let index = 1
      for (const policyName in shareDetail) {
        const downloadLink = shareDetail[policyName]['downloadLink']
        if (Object.prototype.toString.call(downloadLink) === '[object Object]') {
          Object.keys(downloadLink).forEach(key => {
            this.gridData.push({ id: index++, type: key, link: downloadLink[key] })
          })
        } else {
          this.gridData.push({ id: index++, type: policyName, link: downloadLink })
        }
      }
    },
    handleCopy(text, event) {
      clip(text, event)
    }
  }
}
</script>

<style scoped>

</style>
