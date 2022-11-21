<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery['display_name']"
        placeholder="文件名"
        class="filter-item"
        clearable
        style="width:200px"
        @keyup.enter="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-input
        v-model="listQuery['uploader']"
        placeholder="上传者"
        class="filter-item"
        clearable
        disabled
        style="width:200px"
        @keyup.enter="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-select
        v-model="listQuery['category']"
        placeholder="分类"
        class="filter-item"
        clearable
        style="width:200px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.value"
          :label="item.label + '(' + item.count+ ')' "
          :value="item.label"
        />
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        class="filter-item"
        clearable
        style="width:200px"
        @change="handleFilter"
      >
        <el-option
          v-for="item in statusList"
          :key="item.id"
          :style="{color: statusColor(item.label)}"
          :label="item.label + '(' + item.count+ ')' "
          :value="item.label"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-alert
        title="请及时完善作品信息，编辑完成后，需点击右侧 '编辑' 按钮！"
        type="warning"
        :closable="false"
        show-icon
      />
    </div>
    <el-table
      :key="tableKey"
      v-loading="isLoading"
      :data="tableData"
      :default-sort="defaultSort"
      highlight-current-row
      border
      stripe
      fit
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      />
      <el-table-column
        label="分类"
        prop="category"
        sortable="custom"
        align="center"
        width="100"
      />
      <el-table-column
        label="作者"
        align="center"
        width="155"
      >
        <template slot-scope="scope">
          <choose-creator :creator-name="scope.row['creator_name']" @choose="chooseItem(scope.row, $event)" />
        </template>
      </el-table-column>
      <el-table-column
        label="文件名"
        align="center"
        width="250"
      >
        <template slot-scope="{row: { nameWrapper }}">
          <span v-html="nameWrapper" />
        </template>
      </el-table-column>
      <el-table-column
        label="文件大小"
        prop="file_size"
        sortable="custom"
        align="center"
        width="150"
      >
        <template slot-scope="{row: { file_size }}">
          {{ file_size | sizeFilter }}
        </template>
      </el-table-column>
      <el-table-column
        label="上传者"
        align="center"
        width="120"
      >
        <template slot-scope="{row: {uploader}}">
          {{ uploader | valueFilter }}
        </template>
      </el-table-column>
      <el-table-column
        label="入库时间"
        align="center"
        width="180"
      >
        <template slot-scope="{row: {start_upload_time}}">
          {{ start_upload_time[Object.keys(start_upload_time)[0]] | timeFilter }}
        </template>
      </el-table-column>
      <el-table-column
        label="完成时间"
        prop="finish_upload_time"
        align="center"
        width="180"
      >
        <template slot-scope="{row: {finish_upload_time}}">
          <file-attrs-object
            v-for="(value, key) in finish_upload_time"
            :key="key"
            :k="key"
            :val="value"
            :type="'time'"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="150"
      >
        <template slot-scope="{row: {file_id, status}}">
          <file-attrs-object
            v-for="(value, key) in status"
            :key="key"
            :k="key"
            :val="value"
            :type="'status'"
            :progress="handleUploadProgress(file_id, key)"
            @uploadComplete="refresh"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="状态描述"
        align="center"
        width="200"
      >
        <template slot-scope="{row: {comment}}">
          <file-attrs-object
            v-for="(value, key) in comment"
            :key="key"
            :k="key"
            :val="value"
            :type="'comment'"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="120"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button type="text" icon="el-icon-edit-outline" @click="handleUpdate(row)" />
          <sharePop :ref="'shareLinkPop' + row['file_id']">
            <el-button type="text" icon="el-icon-share" @click="handleShareLink(row['status'], row['file_id'])" />
          </sharePop>
          <el-popconfirm
            title="确定删除此文件？"
            @onConfirm="handleDeleteFile(row['file_id'])"
          >
            <el-button slot="reference" type="text" icon="el-icon-delete" />
          </el-popconfirm>
          <reUploadPop :file-id="row['file_id']" @success="refresh">
            <el-button type="text" icon="el-icon-upload" style="color: #ff5566" />
          </reUploadPop>
        </template>
      </el-table-column>
    </el-table>
    <!--sync相当于子组件emit了一个方法，同步改变了父组件相应的值-->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="refresh"
    />
  </div>
</template>

<script>
import moment from 'moment'
import { io } from 'socket.io-client'
import ChooseCreator from '../creator/components/ChooseCreator'
import FileAttrsObject from './components/FileAttrsObject'
import sharePop from './components/SharePop'
import reUploadPop from './components/ReUploadPop'
import pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  getFileCategory,
  getUploadedFileAttrs,
  updateOneUploadedFile,
  getShareLinks,
  getUploadedFiles,
  deleteFile,
  getUploadedFileStatus
} from '@/api/file'
import { convertFileSize } from '@/utils'

export default {
  components: {
    ChooseCreator,
    pagination,
    sharePop,
    reUploadPop,
    FileAttrsObject
  },
  directives: {
    waves
  },
  filters: {
    valueFilter(value) {
      return value || '无'
    },
    timeFilter(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    sizeFilter(value) {
      return convertFileSize(value)
    }
  },
  data() {
    return {
      tableKey: Math.random(),
      isLoading: true,
      tableData: [],
      listQuery: {},
      categoryList: [],
      statusList: [],
      total: 0,
      defaultSort: {},
      uploadProgress: [],
      socket: null,
      creators: []
    }
  },
  created() {
    this.parseQuery()
    this.connectSocketIo()
  },
  mounted() {
    this.getStatusList()
    this.getCategoryList()
    this.getUploadedItems()
  },
  beforeDestroy() {
    this.socket.disconnect()
  },
  methods: {
    parseQuery() {
      let sort = '+id'
      const query = Object.assign({}, this.$route.query)
      // console.log(query)
      const listQuery = {
        page: 1,
        pageSize: 10,
        sort
      }
      query.page && (query.page = +query.page)
      query.pageSize && (query.pageSize = +query.pageSize)
      query.sort && (sort = query.sort)
      const sortSymbol = sort[0]
      const sortColumn = sort.slice(1)
      this.defaultSort = {
        prop: sortColumn,
        order: sortSymbol === '+' ? 'ascending' : 'descending'
      }
      this.listQuery = { ...listQuery, ...query }
    },
    refresh() {
      this.$router.push({
        path: '/upload/manageUploadedItem',
        query: this.listQuery
      })
      this.getUploadedItems()
    },
    handleFilter() {
      // console.log('handleFilter', this.listQuery)
      this.listQuery.page = 1
      this.refresh()
    },
    async getStatusList() {
      try {
        const res = await getUploadedFileStatus()
        this.statusList = res['data']
      } catch (e) {
        console.log(e)
      }
    },
    async getCategoryList() {
      try {
        const res = await getFileCategory()
        this.categoryList = res['data']
      } catch (e) {
        console.log(e)
      }
    },
    sortChange(data) {
      const { prop, order } = data
      this.sortBy(order, prop)
    },
    sortBy(order, prop) {
      if (order === 'ascending') {
        this.listQuery.sort = `+${prop}`
      } else {
        this.listQuery.sort = `-${prop}`
      }
      this.handleFilter()
    },
    chooseItem(row, item) {
      const creatorId = item['id']
      row['creator_id'] = creatorId
    },
    async getUploadedItems() {
      this.isLoading = true
      let res = await getUploadedFiles(this.listQuery)
      res = res['data']
      const fileData = res['fileData']
      this.total = res['count']
      const file_ids = []
      fileData.forEach(item => {
        file_ids.push(item['file_id'])
      })
      // 获取对应的 file_attrs
      res = await getUploadedFileAttrs(file_ids)
      const fileAttrData = res['data']
      // 聚合
      this.tableData = []
      fileData.forEach(item => {
        const fileId = item['file_id']
        // 如果策略关闭，将不返回文件信息，造成报错
        // debugger
        // if (fileAttrData[fileId]) {
        //
        // }
        this.tableData.push({ ...item, ...fileAttrData[fileId] })
      })
      this.isLoading = false
      this.tableData.forEach(file => {
        file.nameWrapper = this.wrapperKeyWords('display_name', file['display_name'])
      })
    },
    handleUpdate(row) {
      updateOneUploadedFile(row).then(res => {
        this.$message.success(res['msg'])
      })
    },
    handleShareLink(status, file_id) {
      getShareLinks(file_id).then(res => {
        const shareDetail = res['data']
        this.$refs['shareLinkPop' + file_id].parseShareDetail(shareDetail)
      })
    },
    handleDeleteFile(file_id) {
      deleteFile(file_id).then(res => {
        this.$message.success(res['msg'])
        this.refresh()
      })
    },
    wrapperKeyWords(k, v) {
      function highlight(value) {
        return `<span style="color: red">${value}</span>`
      }
      if (!this.listQuery[k]) {
        return v
      } else {
        // 第二个参数是一个函数。函数拥有三个参数：第一个参数是匹配到的字符串，第二个参数是匹配的位置，第三个参数是原字符串。
        return v.replace(new RegExp(this.listQuery[k], 'ig'), m => {
          return highlight(m)
        })
      }
    },
    statusColor(status) {
      let color
      if (status === 'Completed') { color = '#67C23A' } else if (status === 'uploading' || status === 'Preparing') { color = '#E6A23C' } else { color = '#FF0000' }
      return color
    },
    connectSocketIo() {
      this.socket = io(process.env.VUE_APP_BASE_API)
      this.socket.on('uploadStatus', (arg) => {
        this.uploadProgress = arg
      })
    },
    handleUploadProgress(file_id, key) {
      if (this.uploadProgress && this.uploadProgress[file_id]) {
        return this.uploadProgress[file_id][key]
      }
      return 0
    }
  }
}
</script>

