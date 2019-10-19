<template>
  <div class="permission">
    <el-card class="box-card">
      <div slot="header">
        <el-input
          clearable
          size="small"
          placeholder="输入名称或别名"
          style="width: 180px"
          prefix-icon="el-icon-search"
          v-model="permissionText">
        </el-input>
        <el-button type="success" icon="el-icon-search" @click="search" size="mini">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addDep" size="mini">新增</el-button>
        <el-button type="warning" @click="isExpand" size="mini">{{expand ? '···收起' : '···展开'}}</el-button>
      </div>
      <div>
        <TreeTable v-loading="loading" :expand-all="expand" :data="permissionList" :columns="columns" size="big">
          <el-table-column prop="alias" label="别名" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.alias }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建日期" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130px" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" @click="editDep(scope.row)" size="mini"/>
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="isLoading" type="primary" size="mini" @click="deleteDep(scope.row.id)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
              </el-popover>
            </template>
          </el-table-column>
        </TreeTable>
      </div>
    </el-card>
    <Form ref="form" @update="getTree"></Form>
  </div>
</template>

<script>
  import {getTreeApi, deleteApi} from '../../../api/permission'
  import {isEmpty} from "../../../utils/common";
  import TreeTable from '../../../components/tree-table/index'
  import Form from './form'

  export default {
    name: "permission",
    components: {TreeTable, Form},
    data() {
      return {
        loading: false,
        isLoading: false,
        permissionList: [],
        columns: [
          {
            text: '名称',
            value: 'name'
          }
        ],
        permissionText: '',
        expand: true
      }
    },
    created() {
      this.getTree()
    },
    methods: {
      // 获得
      getTree() {
        this.loading = true;
        let param = '';
        if (this.permissionText) param = this.permissionText;
        getTreeApi(param).then(result => {
          this.loading = false;
          this.permissionList = result.data.content
        })
      },
      // 搜索
      search() {
        this.getTree()
      },
      // 是否展开
      isExpand() {
        this.expand = !this.expand;
        this.getTree()
      },
      // 新增
      addDep() {
        let _this = this.$refs.form;
        _this.title = '新增';
        _this.dialogTableVisible = true
      },
      // 编辑
      editDep(row) {
        let _this = this.$refs.form;
        _this.title = '编辑';
        _this.id = row.id;
        _this.form = {
          name: row.name,
          alias: row.alias,
          pid: row.pid
        };
        _this.dialogTableVisible = true
      },
      // 删除
      deleteDep(id) {
        this.isLoading = true;
        deleteApi(id)
          .then(() => {
            this.isLoading = false;
            this.$refs[id].doClose();
            this.$refs.form.get();
            this.getTree()
          })
          .catch(() => {
            this.isLoading = false
          })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
