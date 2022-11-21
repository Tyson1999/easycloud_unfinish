<template>
  <div>
    <detail :is-edit="false" />
  </div>
</template>

<script>
import Detail from './components/Detail'
export default {
  name: 'Create',
  components: {
    Detail
  }
}
</script>

<style scoped>

</style>
