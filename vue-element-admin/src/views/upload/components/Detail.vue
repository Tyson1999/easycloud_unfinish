<template>
  <div>
    <sticky :z-index="10" :class-name="'sub-navbar'">
      <el-button @click="handleShowGuide">显示帮助</el-button>
      <el-button type="success" :disabled="uploadFileDisabled" @click="uploadFiles">入库并上传</el-button>
    </sticky>
    <div class="detail-container">
      <Warning />
      <h3>库内文件信息</h3>
      <el-table
        v-loading="loading"
        :data="tableData.slice((currentPage - 1) * pageSize , currentPage * pageSize)"
        border
        stripe
        style="width: 100%"
        :header-cell-style="headClass"
        :cell-style="rowClass"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="100"
        />
        <el-table-column
          prop="category"
          label="类型"
          width="100"
        />
        <el-table-column
          prop="file_name"
          label="文件名"
          width="500"
        />
        <el-table-column
          label="文件大小"
          width="140"
        >
          <template slot-scope="{row: {file_size}}">
            {{ file_size | sizeFilter }}
          </template>
        </el-table-column>
        <el-table-column
          label="上传时间"
          prop="file_in_store_time"
        />
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        class="pagination"
        :page-size="pageSize"
        :total="tableData.length"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { convertFileSize } from '@/utils/index'
import Sticky from '@/components/Sticky'
import Warning from './Warning'
import { uploadFTPFiles, getFTPFileInfo } from '@/api/file'

export default {
  name: 'Detail',
  components: { Sticky, Warning },
  filters: {
    sizeFilter(value) {
      return convertFileSize(value)
    }
  },
  data() {
    return {
      loading: true,
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      uploadFileDisabled: false
    }
  },
  created() {
    this.getStoreFileInfo()
  },
  methods: {
    handleShowGuide() {
      this.$notify({
        title: '嘻嘻',
        type: 'error',
        message: '这么简单还需要什么教程? :)'
      })
    },
    async uploadFiles() {
      this.uploadFileDisabled = true
      const res = await uploadFTPFiles()
      this.$notify({
        title: '操作成功',
        message: res['msg'],
        type: 'success'
      })
      setTimeout(async() => {
        this.$router.push('/upload/manageUploadedItem')
      }, 1500)
      this.uploadFileDisabled = false
    },
    async getStoreFileInfo() {
      this.loading = true
      let tableData = await getFTPFileInfo()
      tableData = tableData['data']
      this.tableData = tableData
      this.loading = false
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    headClass() {
      return 'text-align:center'
    },
    rowClass() {
      return 'text-align:center'
    }
  }
}

</script>

<style lang="scss" scoped>
  .detail-container{
    padding: 40px 50px 20px;
    margin: 0 auto;
    text-align: center;
  }
  .pagination {
    margin-top: 20px;
  }
</style>
