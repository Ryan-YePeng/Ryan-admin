<template>
  <div class="dict">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
        <Table></Table>
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <table-info></table-info>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Table from './table'
  import TableInfo from './tableInfo'

  export default {
    name: "index",
    components: {Table, TableInfo}
  }
</script>

<style scoped>

</style>
