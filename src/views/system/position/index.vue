<template>
  <div class="position">
    <el-card class="box-card">
      <div slot="header">
        <el-input
          clearable
          size="small"
          placeholder="输入岗位名称"
          style="width: 180px"
          v-model="nameText">
        </el-input>
        <el-select v-model="optionsValue" placeholder="状态" clearable style="width: 90px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button class="el-icon-search" type="success" size="mini" @click="get"> 搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="add" size="mini">新增</el-button>
      </div>
      <div>
        <el-table v-loading="loading" :data="positionList" max-height="100%" style="width: 100%">
          <el-table-column prop="name" label="名称">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column  label="所属部门">
            <template slot-scope="scope">
              <span>{{scope.row.superDeptName ? scope.row.superDeptName + '/' : ''}}{{ scope.row.dept.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序">
            <template slot-scope="scope">
              <span>{{ scope.row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="enabled" align="center" label="状态">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabled ? 'primary' : 'info'" size="mini">
                {{scope.row.enabled ? '正常' : '停用'}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建日期">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="140">
            <template slot-scope="scope">
              <el-button type="primary" class="el-icon-edit" @click="edit(scope.row)" size="mini"></el-button>
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="buttonLoading" type="primary" size="mini" @click.stop="deletePosition(scope.row.id)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" @click.stop/>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <Pagination ref="pagination" @getNewData="get"></Pagination>
      </div>
    </el-card>
    <Form ref="form" @update="get"></Form>
  </div>
</template>

<script>
  import {getApi, deleteApi} from '../../../api/position'
  import Form from './form'
  import Pagination from '../../../components/pagination'

  export default {
    name: "position",
    components: {Pagination, Form},
    data() {
      return {
        loading: false,
        buttonLoading: false,
        positionList: [],
        options: [
          {
            value: 'true',
            label: '正常'
          }, {
            value: 'false',
            label: '停用'
          }
        ],
        optionsValue: '',
        nameText: ''
      }
    },
    watch: {
      optionsValue() {
        this.get()
      }
    },
    mounted() {
      this.get()
    },
    methods: {
      // 获得岗位
      get() {
        this.loading = true;
        let pagination = this.$refs.pagination.pagination;
        let params;
        let nameText = this.nameText;
        let optionsValue = this.optionsValue;
        if (optionsValue && !nameText) {
          params = `page=${pagination.page}&size=${pagination.size}&state=open&enabled=${optionsValue}`
        }
        else if (!optionsValue && nameText) {
          params = `page=${pagination.page}&size=${pagination.size}&name=${nameText}`
        }
        else if (optionsValue && nameText) {
          params = `page=${pagination.page}&size=${pagination.size}&name=${nameText}&state=open&enabled=${optionsValue}`
        }
        else {
          params = `page=${pagination.page}&size=${pagination.size}`
        }
        getApi(params).then(result => {
          this.loading = false;
          this.positionList = result.data.posList;
          pagination.total = result.data.total
        })
      },
      // 新增岗位
      add() {
        const _this = this.$refs.form;
        _this.title = '新增';
        _this.dialogTableVisible = true
      },
      // 编辑岗位
      edit(row) {
        const _this = this.$refs.form;
        _this.title = '编辑';
        _this.form = {
          name: row.name,
          sort: row.sort,
          enabled:  row.enabled,
          deptId:  row.deptId,
        };
        _this.id = row.id;
        _this.dialogTableVisible = true
      },
      // 删除
      deletePosition(id) {
        this.buttonLoading = true;
        deleteApi(id)
          .then(() => {
            this.buttonLoading = false;
            this.get();
            this.$refs[id].doClose()
          })
          .catch(() => {
            this.buttonLoading = false;
          })
      }
    }
  }
</script>

<style scoped>

</style>
