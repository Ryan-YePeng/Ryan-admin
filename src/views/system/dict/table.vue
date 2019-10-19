<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <span>字典列表</span>
      </div>
      <div>
        <div style="margin-bottom: 20px">
          <el-input
            clearable
            size="small"
            placeholder="输入名称"
            style="width: 180px"
            v-model="dictText">
          </el-input>
          <el-button type="success" class="el-icon-search" @click="get" size="mini"> 搜索</el-button>
          <el-button type="primary" class="el-icon-plus" @click="add" size="mini"> 新增</el-button>
        </div>
        <el-table v-loading="isLoading"
                  :data="formData"
                  max-height="100%"
                  style="width: 100%"
                  :highlight-current-row="true"
                  @row-click="rowClick">
          <el-table-column label="名称">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button type="primary" class="el-icon-edit" @click="edit(scope.row)" size="mini"></el-button>
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="buttonLoading" type="primary" size="mini"
                             @click.stop="deleteDict(scope.row.id)">确定
                  </el-button>
                </div>
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" @click.stop/>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Pagination ref="pagination" @getNewData="get"></Pagination>
      <Form ref="form" @update="get"></Form>
    </el-card>

  </div>
</template>

<script>
  import {getApi, deleteApi} from "../../../api/dict"
  import Pagination from '../../../components/pagination/index'
  import Form from './form'

  export default {
    name: "Table",
    components: {Pagination, Form},
    data() {
      return {
        formData: [],
        isLoading: false,
        dictText: '',
        buttonLoading: false
      }
    },
    mounted() {
      this.get();
    },
    methods: {
      get() {
        this.isLoading = true;
        let pagination = this.$refs.pagination.pagination;
        let params;
        this.dictText
          ? params = `page=${pagination.page}&size=${pagination.size}&keywords=${this.dictText}`
          : params = `page=${pagination.page}&size=${pagination.size}`;
        getApi(params).then(result => {
          this.isLoading = false;
          this.formData = result.data.dictList;
          pagination.total = result.data.count
        })
      },
      add() {
        let _this = this.$refs.form;
        _this.dialogTableVisible = true;
        _this.title = '新增';
      },
      edit(row) {
        let _this = this.$refs.form;
        _this.dialogTableVisible = true;
        _this.title = '编辑';
        _this.id = row.id;
        _this.form.name = row.name;
        _this.form.remark = row.remark
      },
      deleteDict(id) {
        this.buttonLoading = true;
        deleteApi(id)
          .then(() => {
            this.buttonLoading = false;
            this.$refs[id].doClose();
            this.$vueEventEmit('dictDelete');
            this.get()
          })
          .catch(() => {
            this.buttonLoading = false;
            this.$refs[id].doClose()
          })
      },
      rowClick(row) {
        this.$vueEventEmit('dictCurrentId', row.id)
      },
    }
  }
</script>

<style scoped>

</style>
