<template>
  <div class="container">
    <el-alert
      title="输入部分作者名查询相关结果，选择需要的项来进行修改"
      type="success"
      :closable="false"
      show-icon
      style="margin-bottom: 10px"
    />
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" label-position="left">
      <el-form-item label="作者名" prop="creator_name">
        <el-col :span="4">
          <choose-creator @choose="chooseItem" />
        </el-col>
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-select v-model="form.category" placeholder="作者类型">
          <div v-for="i in category" :key="i['value']">
            <el-option :label="i['label']" :value="i['value']" />
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="Patreon" prop="patreon">
        <el-col :span="10">
          <el-input v-model="form.patreon" />
        </el-col>
      </el-form-item>
      <el-form-item label="Pixiv" prop="pixiv">
        <el-col :span="10">
          <el-input v-model="form.pixiv" />
        </el-col>
      </el-form-item>
      <el-form-item label="Twitter" prop="twitter">
        <el-col :span="10">
          <el-input v-model="form.twitter" />
        </el-col>
      </el-form-item>
      <el-form-item label="Discord" prop="discord">
        <el-col :span="10">
          <el-input v-model="form.discord" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定修改</el-button>
        <el-button @click="onCancel">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ChooseCreator from './components/ChooseCreator'
import { getCreatorCategory, updateCreator } from '@/api/creator'

export default {
  components: {
    ChooseCreator
  },
  data() {
    return {
      category: [],
      form: {
        id: '',
        creator_name: '',
        category: '',
        patreon: '',
        pixiv: '',
        twitter: '',
        discord: ''
      },
      rules: {
        creator_name: [{ required: true, message: '请输入作者名称', trigger: 'blur' }],
        category: [{ required: true, message: '请选择作者类别', trigger: 'blur' }]
      }
    }
  },
  created() {
    getCreatorCategory().then(res => {
      res['data'].forEach(item => {
        const obj = {}
        obj['label'] = item['value']
        obj['value'] = item['id']
        this.category.push(obj)
      })
    })
  },
  methods: {
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          updateCreator(this.form).then(res => {
            this.$message.success(res['msg'])
            this.$emit('success')
          })
        } else {
          return false
        }
      })
    },
    onCancel() {
      this.$refs['form'].resetFields()
    },
    chooseItem(item) {
      Object.keys(this.form).forEach(key => {
        this.form[key] = item[key]
      })
    }
  }
}
</script>

<style scoped>
.container{
  padding: 20px;
  margin: 0 auto;
}
</style>
