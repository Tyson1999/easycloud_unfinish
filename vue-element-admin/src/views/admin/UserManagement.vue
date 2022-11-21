<template>
  <div class="app-container">
    <div class="filter-container">
      <el-popover
        v-model="isCreating"
        placement="bottom-right"
        width="800"
        trigger="manual"
      >
        <create-user-form @cancel="handleCreatePolicy" @success="handleCreatePolicy" />
        <el-button
          slot="reference"
          class="filter-item"
          type="primary"
          icon="el-icon-edit"
          style="margin-left: 5px"
          @click="handleCreatePolicy"
        >
          新增用户
        </el-button>
      </el-popover>
    </div>
    <div :class="isCreating === true ? 'shade' : ''" />
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
        label="用户名"
        prop="username"
        align="center"
        width="200"
      />
      <el-table-column
        label="邮箱"
        prop="email"
        align="center"
        width="250"
      >
        <template slot-scope="scope">
          <edit-cell v-model="scope.row['email']" />
        </template>
      </el-table-column>
      <el-table-column
        label="密码（留空不修改）"
        prop="password"
        align="center"
        width="300"
      >
        <template slot-scope="scope">
          <edit-cell v-model="scope.row['password']" />
        </template>
      </el-table-column>
      <el-table-column
        label="权限角色"
        prop="roles"
        align="center"
        width="300"
      >
        <template slot-scope="scope">
          <edit-cell v-model="scope.row['roles']" />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-popconfirm
            title="确定提交修改吗？"
            @onConfirm="handleUpdate(scope['row'])"
          >
            <el-button
              slot="reference"
              type="text"
              icon="el-icon-edit-outline"
            />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
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
import pagination from '@/components/Pagination'
import editCell from '@/components/EditCell'
import CreateUserForm from './components/createUserForm'

import { getUsers, updateUser } from '@/api/admin/users'

export default {
  name: 'PoliciesManagement',
  components: {
    pagination,
    editCell,
    CreateUserForm
  },
  data() {
    return {
      isLoading: true,
      isCreating: false,
      tableKey: Math.random(),
      tableData: [],
      defaultSort: {},
      listQuery: {},
      total: 0
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      this.isLoading = true
      let res = await getUsers()
      res = res.data
      this.tableData = res.tableData
      this.total = res.count
      this.isLoading = false
    },
    handleUpdate(row) {
      updateUser(row).then(res => {
        this.$message.success(res['msg'])
      })
      this.refresh()
    },
    handleCreatePolicy() {
      this.isCreating = !this.isCreating
      // 重新请求，刷新list
      this.getTableData()
    },
    handleFilter() {
      console.log('handleFilter')
    },
    sortChange() {
      console.log('sortChange')
    },
    refresh() {
      console.log('refresh')
    }
  }
}
</script>

<style scoped>
.shade {
  background: black;
  opacity: 0.75;
  position: absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  z-index: 100
}
</style>
