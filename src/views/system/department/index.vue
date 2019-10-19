<template>
  <div class="department">
    <el-card class="box-card">
      <div slot="header">
        <el-input
          clearable
          size="small"
          placeholder="输入部门名称"
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
        <el-button class="el-icon-search" type="success" size="mini" @click="getDept"> 搜索</el-button>
        <el-button type="primary" class="el-icon-plus" @click="addDep" size="mini"> 新增</el-button>
        <el-button type="warning" @click="isExpand" size="mini">{{expand ? '··· 收起' : '··· 展开'}}</el-button>
      </div>
      <div>
        <TreeTable :expand-all="expand" :data="departmentList" :columns="columns" size="big">
          <el-table-column prop="enabled" align="center" label="状态" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabled ? 'primary' : 'info'">{{ scope.row.enabled ? '正常' : '停用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建日期" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130px" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" @click="editDep(scope.row)" size="small"/>
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
    <Form ref="form" @update="getDept"></Form>
  </div>
</template>

<script>
  import {getDeptApi, deleteApi} from '../../../api/department'
  import TreeTable from '../../../components/tree-table/index'
  import Form from './form'

  export default {
    name: 'department',
    components: {TreeTable, Form},
    data() {
      return {
        isLoading: false,
        departmentList: [],
        columns: [
          {
            text: '名称',
            value: 'name'
          }
        ],
        expand: true,
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
    created() {
      this.getDept()
    },
    watch: {
      optionsValue() {
        this.getDept()
      }
    },
    methods: {
      // 获得
      getDept() {
        let params;
        let nameText = this.nameText;
        let optionsValue = this.optionsValue;
        if (optionsValue && !nameText) {
          params = `state=open&enabled=${optionsValue}`
        }
        else if (!optionsValue && nameText) {
          params = `keywords=${nameText}`
        }
        else if (optionsValue && nameText) {
          params = `keywords=${nameText}&state=open&enabled=${optionsValue}`
        }
        else {
          params = ``
        }
        getDeptApi(params).then(result => {
          this.departmentList = result.data.content
        })
      },
      // 是否展开
      isExpand() {
        this.expand = !this.expand;
        this.getDept()
      },
      // 新增
      addDep() {
        let _this = this.$refs.form;
        _this.title = '新增';
        _this.flag = true;
        _this.dialogTableVisible = true
      },
      // 编辑
      editDep(row) {
        let _this = this.$refs.form;
        row.name === this.departmentList[0].name
          ? _this.flag = false
          : _this.flag = true;
        _this.title = '编辑';
        _this.id = row.id;
        _this.form = {
          name: row.name,
          enabled: row.enabled.toString(),
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
            this.getDept()
          })
          .catch(() => {
            this.isLoading = false
          })
      }
    }
  }
</script>

<style scoped>

</style>
