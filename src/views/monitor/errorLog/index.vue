<template>
  <div class="errorLog">
    <el-card class="box-card">
      <div slot="header">
        <el-input
          clearable
          size="small"
          placeholder="输入描述"
          style="width: 180px"
          v-model="descriptionText">
        </el-input>
        <el-button class="el-icon-search" type="success" size="mini" @click="getErrorLog"> 搜索</el-button>
      </div>
      <div>
        <el-table v-loading="loading" :data="errorLogData" style="width: 100%">
          <el-table-column prop="username" label="用户名">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="requestIp" label="IP" :show-overflow-tooltip="true">
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
          <el-table-column prop="createTime" label="创建时间" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="异常详情" width="90">
            <template slot-scope="scope">
              <el-button type="text" @click="checkInfo(scope.row.id)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination ref="pagination" @getNewData="getErrorLog"></Pagination>
      </div>
    </el-card>
    <el-dialog
      title="异常详情"
      width="80%"
      :visible.sync="dialogTableVisible"
      :destroy-on-close="true">
      <div v-text="errorInfo"></div>
    </el-dialog>
  </div>
</template>

<script>
  import {getErrorLogApi, getErrorInfoApi} from '../../../api/monitor'
  import Pagination from '../../../components/pagination/index'

  export default {
    name: "errorLog",
    components: {Pagination},
    data() {
      return {
        loading: false,
        errorLogData: [],
        errorInfo: '',
        dialogTableVisible: false,
        descriptionText: ''
      }
    },
    mounted() {
      this.getErrorLog();
    },
    methods: {
      getErrorLog() {
        this.loading = true;
        let pagination = this.$refs.pagination.pagination;
        let params;
        this.descriptionText
          ? params = `page=${pagination.page}&size=${pagination.size}&keywords=${this.descriptionText}`
          : params = `page=${pagination.page}&size=${pagination.size}`;
        getErrorLogApi(params).then(result => {
          this.loading = false;
          this.errorLogData = result.data.logs;
          pagination.total = result.data.count
        })
      },
      // 查看异常详情
      checkInfo(id) {
        getErrorInfoApi(id).then(result => {
          this.errorInfo = result.data;
          this.dialogTableVisible = true
        })
      }
    }
  }
</script>

<style scoped>

</style>
