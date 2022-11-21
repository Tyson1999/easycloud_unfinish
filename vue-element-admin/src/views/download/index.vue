<template>
  <div v-loading="loading" class="container">
    <div style="max-width: 1200px; margin: 0 20px">
      <el-row type="flex" justify="center">
        <el-col :span="24" class="logo" />
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :md="12" class="grid-content">
          <h3>Support {{ creatorName }} 👈</h3>
          <p> Support the creators whose content you like, to ensure their work continues. </p>
          <p> A lot of creators may no longer continue creating the content that you like without your support. </p>
          <div class="button-group">
            <el-button
              v-for="(value, key) in supports"
              :key="key"
              @click="handleSupportButtonClick(value)"
              v-text="key"
            />
            <el-button
              v-if="Object.keys(supports).length === 0"
              type="primary"
              class="el-icon-warning-outline"
              plain
              disabled
              v-text="' No data available'"
            />
          </div>
        </el-col>
        <el-col :xs="24" :md="12" class="grid-content">
          <h3>Leaving warning ❗️</h3>
          <p> You'll leave easycloud download page when click the download buttons. </p>
          <p> We endeavor to ensure all files are clean, however please also take care and scan everything you download </p>
          <div class="button-group">
            <el-button
              v-for="storage in storages"
              :key="storage['name']"
              @click="handleDownloadItem(storage['itemId'])"
              v-text="storage['name'] + ' (' + storage['policyType'] + ')'"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getDownloadablePolicy, getDownloadItemUrl } from '@/api/download'
export default {
  data() {
    return {
      loading: true,
      storages: [],
      creatorName: '',
      supports: {},
      creator: ''
    }
  },
  computed: mapState({
    mainDomain: state => state.app.mainDomain
  }),
  created() {
    this.getDownloadablePolicy()
  },
  methods: {
    getDownloadablePolicy() {
      const cipher = this.$route.params['downloadId']
      getDownloadablePolicy(cipher)
        .then(res => {
          res = res['data']
          this.storages = res['storages']
          const creatorInfo = res['creatorInfo']
          if (creatorInfo) {
            this.creatorName = creatorInfo['creator_name']
            this.supports['patreon'] = creatorInfo['patreon']
            this.supports['twitter'] = creatorInfo['twitter']
            this.supports['pixiv'] = creatorInfo['pixiv']
            this.supports['discord'] = creatorInfo['discord']
          }
          this.loading = false
        })
        .catch(err => {
          const errMsg = err['message'] + ', please contact the poster or administrator(s)'
          this.$alert(errMsg, 'Error', {
            confirmButtonText: 'Confirm',
            type: 'error',
            callback: () => {
              window.location = this.mainDomain
            }
          })
        })
    },
    handleDownloadItem(policyId) {
      getDownloadItemUrl(policyId)
    },
    handleSupportButtonClick(url) {
      if (url) {
        window.open(url, '_blank')
      } else {
        // 无对应赞助网站
        this.$message.info('Temporarily unavailable')
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('~@/assets/download_page/bg.jpg') center no-repeat;
  background-size: cover;
  color: #fff;
}

.logo {
  background: url('~@/assets/download_page/logo.png') no-repeat;
  height: 100px;
  width: 300px;
  margin: auto;
}

.grid-content {
  min-height: 36px;
  margin: 10px 0;
}

.button-group >>> button {
  margin: 10px 5px;
}
</style>
