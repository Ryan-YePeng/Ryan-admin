<template>
  <div class="employee">
    <el-table v-loading="loading" :data="formData" max-height="100%" style="width: 100%">
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位">
        <template slot-scope="scope">
          <span>{{ scope.row.posName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入职时间">
        <template slot-scope="scope">
          <span>{{ scope.row.beginDate }}</span>
        </template>
      </el-table-column>
    </el-table>
    <Pagination ref="pagination" @getNewData="getEmps"></Pagination>
  </div>
</template>

<script>
  import {get} from '../../../api/employee'
  import Pagination from '../../../components/pagination'

  export default {
    name: "index",
    components: {Pagination},
    data() {
      return {
        formData: [],
        loading: false
      }
    },
    mounted() {
      this.getEmps()
    },
    methods: {
      getEmps() {
        this.loading = true;
        let pagination = this.$refs.pagination.pagination;
        let params = `page=${pagination.page}&size=${pagination.size}`;
        get(params).then(result => {
          this.loading = false;
          this.formData = result.data.emps;
          pagination.total = result.data.count
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .employee {
    border-radius: 5px;
    box-shadow: rgba(0,0,0,.2) 1px 1px 5px 1px;
    overflow: hidden;
    padding-bottom: 10px;
    background-color: white;
  }
</style>
