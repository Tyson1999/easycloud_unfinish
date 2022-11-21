<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="120px" label-position="left">
    <el-form-item label="策略名" prop="name">
      <el-col :span="7">
        <el-input v-model="form.name" />
      </el-col>
    </el-form-item>
    <el-form-item label="类别" prop="policy_type_id">
      <el-select v-model="form.policy_type_id" placeholder="选择存储端类型">
        <div v-for="i in policyTypes" :key="i['policyTypeId']">
          <el-option :label="i['policyType']" :value="i['policyTypeId']" />
        </div>
      </el-select>
    </el-form-item>
    <el-form-item
      label="账号"
      prop="account_name"
      v-permission="['admin']"
    >
      <el-col :span="7">
        <el-input placeholder="部分策略需要输入账号" v-model="form.account_name" />
      </el-col>
    </el-form-item>
    <el-form-item
      v-if="form.account_name"
      v-permission="['admin']"
      label="Access token"
      prop="access_token"
    >
      <el-col :span="7">
        <el-input placeholder="输入Access token(密码)" v-model="form.access_token" />
      </el-col>
    </el-form-item>
    <el-form-item label="Root folder" prop="root_folder">
      <el-col :span="20">
        <el-input v-model="form.root_folder" />
      </el-col>
    </el-form-item>
    <el-form-item label="是否激活" prop="is_active">
      <el-radio-group v-model="form.is_active">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
<!--    <el-form-item label="失效时间" prop="expired_date">-->
<!--      <el-date-picker-->
<!--        v-model="form.expired_date"-->
<!--        type="datetime"-->
<!--        placeholder="选择日期时间"-->
<!--        align="right"-->
<!--        :picker-options="pickerOptions"-->
<!--      />-->
<!--    </el-form-item>-->
    <el-form-item v-permission="['admin']" label="是否为系统策略" prop="is_system_policy">
      <el-radio-group v-model="form.is_system_policy">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getPolicyTypes, addOnePolicy } from '@/api/policy'
import permission from '@/directive/permission/index'

export default {
  directives: { permission },
  data() {
    return {
      policyTypes: [],
      form: {
        name: '',
        policy_type_id: '',
        account_name: '',
        access_token: '',
        root_folder: '/',
        is_system_policy: 0,
        is_active: 1,
        expired_date: '1970-01-01 00:00:00'
      },
      rules: {
        name: [{ required: true, message: '请输入策略名', trigger: 'blur' }],
        policy_type_id: [{ required: true, message: '请选择储存策略类型', trigger: 'blur' }],
        // bucket_name: [{ required: true, message: '请输入Bucket name', trigger: 'blur' }],
        // access_key: [{ required: true, message: '请输入Access key', trigger: 'blur' }],
        is_active: [{ required: true, message: '请选择是否激活', trigger: 'blur' }],
        is_system_policy: [{ required: true, message: '请选择是否为系统策略', trigger: 'blur' }],
        expired_date: [{ required: true, message: '请选择日期时间', trigger: 'blur' }]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '不过期',
            onClick(picker) { picker.$emit('pick', '1970-01-01 00:00:00') }
          },
          {
            text: '约24个月后',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 360 * 2)
              picker.$emit('pick', date)
            }
          }]
      }
    }
  },
  created() {
    getPolicyTypes().then(res => {
      res['data'].forEach(item => {
        const object = {}
        object['policyTypeId'] = item['id']
        object['policyType'] = item['type']
        this.policyTypes.push(object)
      })
    })
  },
  methods: {
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addOnePolicy(this.form).then(res => {
            this.$message.success(res['msg'])
            this.$emit('success')
          })
        } else {
          return false
        }
      })
    },
    onCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>

</style>
