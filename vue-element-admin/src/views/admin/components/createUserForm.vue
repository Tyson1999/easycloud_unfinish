<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="120px" label-position="left">
    <el-form-item label="用户名" prop="username">
      <el-col :span="7">
        <el-input v-model="form.username" />
      </el-col>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-col :span="20">
        <el-input v-model="form.email" />
      </el-col>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-col :span="20">
        <el-input v-model="form.password" />
      </el-col>
    </el-form-item>
    <el-form-item label="角色权限" prop="roles">
      <el-col :span="20">
        <el-input v-model="form.roles" />
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { addUser } from '@/api/admin/users'

export default {
  data() {
    return {
      policyTypes: [],
      form: {
        username: '',
        email: '',
        password: '',
        roles: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        email: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        roles: [{ required: true, message: '请输入role(s)，使用,分割', trigger: 'blur' }]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addUser(this.form).then(res => {
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
