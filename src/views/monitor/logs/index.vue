<template>
  <div class="logs">
    <el-card class="box-card">
      <div slot="header">
        <el-input
          clearable
          size="small"
          placeholder="输入描述"
          style="width: 180px"
          v-model="descriptionText">
        </el-input>
        <el-button class="el-icon-search" type="success" size="mini" @click="getLogs"> 搜索</el-button>
      </div>
      <div>
        <el-table v-loading="loading" :data="logsData" style="width: 100%">
          <el-table-column prop="username" label="用户名">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="requestIp" label="IP">
            <template slot-scope="scope">
              <span>{{ scope.row.requestIp }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="IP来源" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述">
            <template slot-scope="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="method" label="方法名称" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.method }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="params" label="参数" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.params }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="请求耗时" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag>{{ scope.row.time }}ms</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime}}</span>
            </template>
          </el-table-column>
        </el-table>
        <Pagination ref="pagination" @getNewData="getLogs"></Pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {getLogsApi} from '../../../api/monitor'
  import Pagination from '../../../components/pagination/index'

  export default {
    name: "logs",
    components: {Pagination},
    data() {
      return {
        loading: false,
        logsData: [],
        descriptionText: ''
      }
    },
    mounted() {
      this.getLogs();
    },
    methods: {
      getLogs() {
        this.loading = true;
        let pagination = this.$refs.pagination.pagination;
        let params;
        this.descriptionText
          ? params = `page=${pagination.page}&size=${pagination.size}&keywords=${this.descriptionText}`
          : params = `page=${pagination.page}&size=${pagination.size}`;
        getLogsApi(params).then(result => {
          this.loading = false;
          this.logsData = result.data.logs;
          pagination.total = result.data.count
        })
      }
    }
  }
</script>

<style scoped>

</style>
