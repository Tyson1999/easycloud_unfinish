<template>
  <el-popover
    :ref="'reUploadPop' + fileId"
    placement="right"
    width="350"
    trigger="click"
  >
    <div style="text-align: center; font-weight: bold">选择重传策略</div>
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;" />
    <el-checkbox-group v-model="checkedPolicies" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="(value, key) in policy" :key="key" :label="value">
        {{ value['policyName'] + '(' + value['policyType'] + ')' }}
      </el-checkbox>
    </el-checkbox-group>
    <el-button
      type="primary"
      style="margin-top: 10px"
      :disabled="disabled"
      @click="reUpload"
    >
      确定重传
    </el-button>
    <slot slot="reference" />
  </el-popover>
</template>

<script>
import { getActivePolicies } from '@/api/policy'
import { reUploadFile } from '@/api/file'
export default {
  name: 'ReUploadPop',
  props: ['fileId'],
  data() {
    return {
      disabled: false,
      checkAll: false,
      isIndeterminate: false,
      // 当前所有激活的储存策略，对象数组
      policy: [],
      checkedPolicies: []
    }
  },
  created() {
    getActivePolicies().then(res => {
      res = res['data']
      res.forEach(item => {
        const temp = {}
        temp['policyId'] = item['id']
        temp['policyName'] = item['name']
        temp['policyType'] = item['type']
        this.policy.push(temp)
      })
    })
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedPolicies = val ? this.policy : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.policy.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.policy.length
    },
    reUpload() {
      if (this.checkedPolicies.length === 0) {
        this.$message.error('至少选择一个存储策略！')
      } else {
        this.disabled = true
        reUploadFile(this.fileId, this.checkedPolicies).then(res => {
          this.disabled = false
          this.$message.success(res['msg'])
          this.$emit('success')
          this.$refs['reUploadPop' + this.fileId].doClose()
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
