<template>
  <div>
    <div class="detail-container">
      <h3>操作日志信息</h3>
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
        :row-class-name="tableRowClassName"
        :header-cell-style="headClass"
        :cell-style="rowClass"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="100"
        />
        <el-table-column
          prop="level"
          label="日志等级"
          width="125"
        />
        <el-table-column
          prop="username"
          label="用户"
          width="125"
        />
        <el-table-column
          prop="message"
          label="详情"
          width="675"
        />
        <el-table-column
          label="记录时间"
          prop="timestamp"
        >
          <template v-slot:default="scope">
            {{ scope.row.timestamp | timeFilter }}
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="handlePagination"
      />
    </div>
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import { getUserLogs, getSysLogs } from '@/api/logs'
import moment from 'moment'

export default {
  components: {
    pagination
  },
  filters: {
    timeFilter(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data() {
    return {
      logType: '',
      loading: true,
      total: 0,
      tableData: [],
      pageSize: 10,
      uploadFileDisabled: false,
      listQuery: {},
      defaultSort: {}
    }
  },
  created() {
    this.parseQuery()
    this.$route.path.indexOf('sysLogs') === 1 ? this.logType = 'sysLogs' : 'userLogs'
  },
  mounted() {
    this.getLogs(this.listQuery)
  },
  methods: {
    parseQuery() {
      let sort = '-timestamp'
      const query = Object.assign({}, this.$route.query)
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
    async getLogs() {
      this.loading = true
      let res = this.logType === 'sysLogs'
        ? await getSysLogs(this.listQuery)
        : await getUserLogs(this.listQuery)
      res = res['data']
      this.tableData = res['tableData']
      this.total = res['count']
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
    },
    handlePagination() {
      this.$router.push({
        path: this.logType,
        query: this.listQuery
      })
      this.getLogs()
    },
    tableRowClassName({ row }) {
      const { level } = row
      if (level === 'warning') {
        return 'warning-row'
      } else if (level === 'error') {
        return 'error-row'
      } else {
        return 'info-row'
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.detail-container{
  padding: 20px 50px 20px;
  margin: 0 auto;
  text-align: center;
}
.pagination {
  margin-top: 20px;
}
.el-table >>> .warning-row {
  background: oldlace;
}

.el-table >>> .error-row {
  background: rgb(252, 218, 218);
}

//.el-table >>> .info-row {
//  background: rgb(218, 241, 207);
//}

</style>
