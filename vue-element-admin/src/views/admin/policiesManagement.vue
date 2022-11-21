<template>
  <div class="app-container">
    <div class="filter-container">
      <!--      <el-input-->
      <!--        v-model="listQuery['display_name']"-->
      <!--        placeholder="文件名"-->
      <!--        class="filter-item"-->
      <!--        clearable-->
      <!--        style="width:200px"-->
      <!--        @keyup.enter="handleFilter"-->
      <!--        @clear="handleFilter"-->
      <!--        @blur="handleFilter"-->
      <!--      />-->
      <!--      <el-input-->
      <!--        v-model="listQuery['uploader']"-->
      <!--        placeholder="上传者"-->
      <!--        class="filter-item"-->
      <!--        clearable-->
      <!--        disabled-->
      <!--        style="width:200px"-->
      <!--        @keyup.enter="handleFilter"-->
      <!--        @clear="handleFilter"-->
      <!--        @blur="handleFilter"-->
      <!--      />-->
      <!--      <el-select-->
      <!--        v-model="listQuery['category']"-->
      <!--        placeholder="分类"-->
      <!--        class="filter-item"-->
      <!--        clearable-->
      <!--        style="width:200px"-->
      <!--        @change="handleFilter"-->
      <!--      >-->
      <!--        <el-option-->
      <!--          v-for="item in categoryList"-->
      <!--          :key="item.value"-->
      <!--          :label="item.label + '(' + item.count+ ')' "-->
      <!--          :value="item.label"-->
      <!--        />-->
      <!--      </el-select>-->
      <!--      <el-select-->
      <!--        v-model="listQuery.status"-->
      <!--        placeholder="状态"-->
      <!--        class="filter-item"-->
      <!--        clearable-->
      <!--        style="width:200px"-->
      <!--        @change="handleFilter"-->
      <!--      >-->
      <!--        <el-option-->
      <!--          v-for="item in statusList"-->
      <!--          :key="item.id"-->
      <!--          :style="{color: statusColor(item.label)}"-->
      <!--          :label="item.label + '(' + item.count+ ')' "-->
      <!--          :value="item.label"-->
      <!--        />-->
      <!--      </el-select>-->
      <!--      <el-button-->
      <!--        v-waves-->
      <!--        class="filter-item"-->
      <!--        type="primary"-->
      <!--        icon="el-icon-search"-->
      <!--        style="margin-left: 10px"-->
      <!--        @click="handleFilter"-->
      <!--      >-->
      <!--        搜索-->
      <!--      </el-button>-->
      <el-popover
        v-model="isCreatingPolicy"
        placement="bottom-right"
        width="800"
        trigger="manual"
      >
        <create-policy-form @cancel="handleCreatePolicy" @success="handleCreatePolicy" />
        <el-button
          slot="reference"
          class="filter-item"
          type="primary"
          icon="el-icon-edit"
          style="margin-left: 5px"
          @click="handleCreatePolicy"
        >
          新增策略
        </el-button>
      </el-popover>
      <el-button
        class="filter-item"
        type="warning"
        icon="el-icon-question"
        style="text-align: right;"
        @click="toTutorial"
      >
        教程
      </el-button>
    </div>
    <el-alert
      title="编辑完参数请点击右侧按钮完成更改哦！"
      type="warning"
      show-icon
    />
    <div :class="isCreatingPolicy === true ? 'shade' : ''" />
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
        label="类别"
        prop="type"
        align="center"
        width="125"
      />
      <el-table-column
        label="策略名"
        prop="name"
        align="center"
        width="150"
      >
        <template v-slot="scope">
          <edit-cell v-model="scope.row['name']" />
        </template>
      </el-table-column>
      <el-table-column
        label="容量使用"
        align="center"
        width="125"
      >
        <template v-slot="{row: {space_used}}">
          {{ space_used | sizeFilter }}
        </template>
      </el-table-column>
      <el-table-column
        label="Account name"
        prop="account_name"
        align="center"
        width="200"
      >
        <template v-slot="scope">
          <edit-cell v-model="scope.row['account_name']" />
        </template>
      </el-table-column>
      <el-table-column
        label="Access token"
        prop="access_token"
        align="center"
        width="200"
      >
        <template v-slot="scope">
          <edit-cell v-model="scope.row['access_token']" />
        </template>
      </el-table-column>
      <el-table-column
        label="Root folder"
        prop="root_folder"
        align="center"
        width="200"
      >
        <template v-slot="scope">
          <edit-cell v-model="scope.row['root_folder']" />
        </template>
      </el-table-column>
      <el-table-column
        label="是否激活"
        prop="is_active"
        align="center"
        width="80"
      >
        <template v-slot="scope">
          <switcher v-model="scope.row['is_active']" />
        </template>
      </el-table-column>
      <el-table-column
        label="是否系统策略"
        prop="is_system_policy"
        align="center"
        width="150"
      >
        <template v-slot="{row: {is_system_policy}}">
          <span>{{ is_system_policy | switcherValueFilter }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        label="到期时间"-->
<!--        prop="expired_date"-->
<!--        align="center"-->
<!--        width="210"-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <el-date-picker-->
<!--            v-model="scope.row['expired_date']"-->
<!--            style="width:185px"-->
<!--            type="datetime"-->
<!--            placeholder="选择日期时间"-->
<!--            align="right"-->
<!--            format="yyyy-MM-dd HH:mm"-->
<!--            :picker-options="pickerOptions"-->
<!--          />-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        label="所有者"
        prop="owner"
        align="center"
        width="120"
      />
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
      >
        <template v-slot="scope">
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
          <el-button
            type="text"
            icon="el-icon-s-check"
            style="color: #ff5566"
            @click="authorization(scope['row'])"
          />
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
import Switcher from './components/Switcher'
import CreatePolicyForm from './components/createPolicyForm'

import { editOnePolicy, getAllPolicies } from '@/api/policy'
import { getAuthorizationToken, redeemToken } from '@/api/oauth'

import { formatDatetime, convertFileSize } from '@/utils'
import { setOauthToken, getOauthToken, removeOauthToken } from '@/utils/auth'

export default {
  name: 'PoliciesManagement',
  components: {
    pagination,
    editCell,
    CreatePolicyForm,
    Switcher
  },
  filters: {
    sizeFilter(val) {
      return convertFileSize(val)
    },
    switcherValueFilter(val) {
      if (val === 0) {
        return '否'
      } else {
        return '是'
      }
    }
  },
  data() {
    return {
      isLoading: true,
      isCreatingPolicy: false,
      tableKey: 1,
      tableData: [],
      defaultSort: {},
      listQuery: {},
      total: 0,
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
    this.getTableData()
    const { code, error } = this.$route.query
    if (error) {
      this.$message.error('授权失败: ' + error)
    } else {
      this.redeemOauthToken(code)
    }
  },
  methods: {
    async getTableData() {
      this.isLoading = true
      let res = await getAllPolicies()
      res = res.data
      this.tableData = res.tableData
      this.total = res.count
      this.isLoading = false
    },
    handleUpdate(row) {
      const { id } = row
      row['expired_date'] = formatDatetime(row['expired_date'])
      editOnePolicy(id, row).then(res => {
        this.$message.success(res['msg'])
        this.getTableData()
      })
    },
    handleCreatePolicy() {
      this.isCreatingPolicy = !this.isCreatingPolicy
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
    },
    toTutorial() {
      this.$router.push('tutorial')
    },
    authorization(row) {
      const policyId = row['id']
      const type = row['type']
      setOauthToken(policyId)
      getAuthorizationToken({ type })
        .then(res => {
          const redirectUrl = res['data']
          window.location.href = redirectUrl
        })
        .catch(err => {
          console.log(err)
        })
    },
    redeemOauthToken(token) {
      if (token) {
        const policyId = getOauthToken()
        if (!policyId) {
          this.$message.error('No policy Id, 请重新授权')
        } else {
          redeemToken(token, policyId)
            .then(res => {
              this.$router.push('/policy/management')
              removeOauthToken()
              this.$message.success(res['msg'])
            })
        }
      }
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
