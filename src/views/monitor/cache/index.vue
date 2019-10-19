<template>
  <div class="cache">
    <el-card class="box-card">
      <div slot="header">
        <el-button type="warning" class="el-icon-delete" @click="deleteAll" size="mini"> 清空缓存</el-button>
      </div>
      <div>
        <el-table v-loading="loading" :data="formData" max-height="100%" style="width: 100%">
          <el-table-column align="center" label="序号" width="80">
            <template slot-scope="scope">
              <span>{{ parseInt(scope.row.index) + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="KEY" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.key }}</span>
            </template>
          </el-table-column>
          <el-table-column label="VALUE" :show-overflow-tooltip="false">
            <template slot-scope="scope">
              <div style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                {{ scope.row.value }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-popover
                :ref="scope.row.key"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.key].doClose()">取消</el-button>
                  <el-button :loading="isLoading" type="primary" size="mini" @click.stop="deleteOnlyOne(scope.row.key)">确定
                  </el-button>
                </div>
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" @click.stop/>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <Pagination ref="pagination" @getNewData="get"></Pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {deleteAllApi, deleteApi, getApi} from '../../../api/cache'
  import Pagination from '../../../components/pagination/index'

  export default {
    name: "cache",
    components: {Pagination},
    data() {
      return {
        formData: [],
        loading: false,
        isLoading: false
      }
    },
    mounted() {
      this.get()
    },
    methods: {
      get() {
        this.loading = true;
        let pagination = this.$refs.pagination.pagination;
        let params = `page=${pagination.page}&size=${pagination.size}`;
        getApi(params).then(result => {
          let response = result.data;
          pagination.total = response.count;
          this.formData = [];
          for (let index in response.key) {
            let obj = {};
            obj.index = index;
            obj.key = response.key[index];
            obj.value = response.value[index];
            this.formData.push(obj)
          }
          this.loading = false
        })
      },
      deleteAll() {
        this.$msgBox('确定清空缓存吗？').then(() => {
          deleteAllApi().then(() => {
            this.formData = []
          })
        })
      },
      deleteOnlyOne(key) {
        this.isLoading = true;
        deleteApi({key: key})
          .then(() => {
            this.isLoading = false;
            this.$refs[key].doClose();
            this.get()
          })
          .catch(() => {
            this.isLoading = false;
            this.$refs[key].doClose()
          })
      }
    }
  }
</script>

<style scoped>

</style>
