<template>
  <div @click="beginEdit">
    <span
      v-if="!isEditing && creatorName"
      style="font-weight: bold;"
    >
      {{ creatorName }}
    </span>
    <el-select
      v-else
      v-model="creatorId"
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词"
      :remote-method="searchCreator"
      :loading="loading"
      @change="emitData"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.creator_name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import { getCreatorByName } from '@/api/creator'

export default {
  name: 'ChooseCreator',
  props: {
    creatorName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      isEditing: false,
      creatorId: '',
      options: []
    }
  },
  methods: {
    searchCreator(query) {
      if (query !== '') {
        this.loading = true
        getCreatorByName(query).then(res => {
          this.options = res['data']
          this.loading = false
        })
      } else {
        this.options = []
      }
    },
    beginEdit() {
      this.isEditing = true
    },
    endEdit() {
      this.isEditing = false
    },
    emitData() {
      this.options.forEach(ele => {
        if (ele['id'] === this.creatorId) {
          this.$emit('choose', ele)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
