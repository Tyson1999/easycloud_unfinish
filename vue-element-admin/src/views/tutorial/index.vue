<template>
  <div class="container">
    <div class="button-group">
      <el-button
        v-for="policy in policyTypes"
        :key="policy"
        @click="showTutorial(policy)"
      >
        {{ policy }}
      </el-button>
    </div>
    <div v-if="tutorialUrl" class="iframe-container">
      <iframe :src="tutorialUrl" height="100%" width="100%" />
    </div>
    <div v-else>
      <p>点击一个按钮查看对应教程</p>
    </div>
    <hr>
    <div class="tips">
      特别提示：
      <ul>
        <li>
          Onedrive API 调用有限制，一个盘不要存太多的资源，大概500-600G后即需换盘（接入一个新onedrive策略，并将旧策略"是否激活"选项关闭）
        </li>
        <li>
          Google drive 每日流量有限制（750G），一个盘不要存太多的资源，大概100-200G后即需换盘（接入一个新google drive策略，并将旧策略"是否激活"选项关闭）
        </li>
        <li>
          Mega 网盘免费空间20GB，用尽后需付费扩容。或注册新账号重新对接（并将旧策略"是否激活"选项关闭）
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getPolicyTypes } from '@/api/policy'
export default {
  data() {
    return {
      policyTypes: [],
      tutorialUrl: ''
    }
  },
  created() {
    getPolicyTypes().then(res => {
      res['data'].forEach(item => {
        this.policyTypes.push(item['type'])
      })
    })
  },
  methods: {
    showTutorial(type) {
      this.tutorialUrl = `${process.env.VUE_APP_BASE_API}/tutorial/page/${type}.html`
    }
  }
}
</script>

<style scoped>
.container {
  padding: 30px;
  height: 65vh;
}

.iframe-container {
  margin-top: 20px;
  height: 100%;
}

.tips {
  line-height: 32px;
}
</style>
