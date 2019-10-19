<template>
  <div class="role">
    <el-row :gutter="20">
      <el-col :sm="24" :md="16">
        <el-card class="box-card" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <el-input
              clearable
              size="small"
              placeholder="输入角色名称"
              style="width: 180px"
              prefix-icon="el-icon-search"
              v-model="permissionText">
            </el-input>
            <el-button type="success" icon="el-icon-search" @click="getRoles" size="mini">搜索</el-button>
            <el-button type="primary" class="el-icon-plus" @click="add" size="mini">新增</el-button>
            <el-radio-group v-model="selectType" style="float: right" size="mini">
              <el-radio-button label="菜单分配"></el-radio-button>
              <el-radio-button label="权限分配"></el-radio-button>
            </el-radio-group>
          </div>
          <div>
            <el-table
              :data="rolesForm"
              v-loading="tableLoading"
              style="width: 100%"
              ref="roleTable"
              @row-click="getTreeChecked"
              :highlight-current-row="true">
              <el-table-column prop="name" label="名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="dataScope" label="数据权限">
                <template slot-scope="scope">
                  <span>{{ scope.row.dataScope }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="level" label="角色级别">
                <template slot-scope="scope">
                  <span>{{ scope.row.level }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="remark" :show-overflow-tooltip="true" label="描述">
                <template slot-scope="scope">
                  <span>{{ scope.row.remark }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" :show-overflow-tooltip="true" label="创建日期">
                <template slot-scope="scope">
                  <span>{{ scope.row.createTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="150">
                <template slot-scope="scope">
                  <el-button type="primary" class="el-icon-edit" @click.stop="editRole(scope.row)"
                             size="mini"></el-button>
                  <el-popover
                    :ref="scope.row.id"
                    placement="top"
                    width="180">
                    <p>确定删除本条数据吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                      <el-button :loading="buttonLoading" type="primary" size="mini" @click="deleteRole(scope.row.id)">
                        确定
                      </el-button>
                    </div>
                    <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" @click.stop/>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
            <Pagination ref="pagination" @getNewData="getRoles"></Pagination>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="24" :md="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="header">{{selectType}}</span>
            <el-button :loading="buttonLoading" style="float: right" class="el-icon-check" type="primary" size="mini"
                       @click="update" :disabled="isDisabled">保存
            </el-button>
          </div>
          <div>
            <el-tree
              :data="selectType === '菜单分配' ? menuTree : PermissionTree"
              show-checkbox
              ref="rolesTree"
              node-key="id"
              accordion
              :default-checked-keys="selectType === '菜单分配' ? menuIds : PermissionIds"
            >
            </el-tree>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <Form ref="roleDialog" :tree="departmentTree" @updateRoles="getRoles"></Form>
  </div>
</template>

<script>
  import {
    getRolesApi,
    getMenuApi,
    getPermissionApi,
    getDepartmentApi,
    deleteApi,
    updateMenuApi,
    updatePermissionApi,
    getRolesByIdApi
  } from '../../../api/role'
  import Form from './form'
  import Pagination from '../../../components/pagination'

  export default {
    name: "index",
    components: {Form, Pagination},
    data() {
      return {
        tableLoading: false,
        isDisabled: true,
        buttonLoading: false,
        selectType: '菜单分配',
        rolesForm: [],
        menuTree: [],
        PermissionTree: [],
        tree: [],
        menuIds: [],
        PermissionIds: [],
        id: null,
        departmentTree: [],
        permissionText: ''
      }
    },
    created() {

    },
    mounted() {
      this.getRoles();
      getMenuApi().then(result => {
        this.menuTree = result.data
      });
      getPermissionApi().then(result => {
        this.PermissionTree = result.data
      });
      getDepartmentApi().then(result => {
        this.departmentTree = result.data
      })
    },
    methods: {
      // 清除选中
      clearChecked() {
        this.$refs.rolesTree.setCheckedKeys([])
      },
      // 获得角色列表
      getRoles() {
        this.isDisabled = true;
        this.tableLoading = true;
        this.clearChecked();
        let pagination = this.$refs.pagination.pagination;
        let params;
        this.permissionText
          ? params = `page=${pagination.page}&size=${pagination.size}&keywords=${this.permissionText}`
          : params = `page=${pagination.page}&size=${pagination.size}`;
        getRolesApi(params).then(result => {
          this.rolesForm = result.data.roles;
          pagination.total = result.data.count;
          this.tableLoading = false
        })
      },
      // 获得角色已经分配到的权限和角色id
      getTreeChecked(row) {
        this.isDisabled = false;
        this.clearChecked();
        let menuList = [], permissionList = [];
        row.permissions.forEach(item => {
          permissionList.push(item.id);
        });
        row.menus.forEach(item => {
          menuList.push(item.id);
        });
        this.menuIds = menuList;
        this.PermissionIds = permissionList;
        this.id = row.id
      },
      //删除角色
      deleteRole(id) {
        this.buttonLoading = true;
        deleteApi(id)
          .then(() => {
            this.buttonLoading = false;
            this.$refs[id].doClose();
            this.getRoles()
          })
          .catch(() => {
            this.buttonLoading = false;
            this.$refs[id].doClose()
          })
      },
      //新增角色
      add() {
        const _this = this.$refs.roleDialog;
        _this.title = '新增';
        _this.dialogTableVisible = true
      },
      // 编辑角色
      editRole(row) {
        let deptList = [];
        row.depts.forEach(item => {
          deptList.push(item.id);
        });
        const _this = this.$refs.roleDialog;
        for (let key in _this.form) {
          _this.form[key] = row[key]
        }
        _this.deptIds = deptList;
        _this.title = '编辑';
        _this.id = row.id;
        _this.dialogTableVisible = true;
      },
      // 更新菜单分配或权限分配
      update() {
        this.buttonLoading = true;
        let idList = [];
        let id = this.id;
        this.$refs.rolesTree.getCheckedNodes().forEach(item => {
          idList.push(item.id)
        });
        this.selectType === '菜单分配'
          // 更新菜单分配
          ? updateMenuApi('rid', id, 'mids', idList)
            .then(() => {
              this.buttonLoading = false;
              this.updateOnlyRole(id)
            })
          // 更新权限分配
          : updatePermissionApi('rid', id, 'pids', idList)
            .then(() => {
              this.buttonLoading = false;
              this.updateOnlyRole(id)
            })
      },
      // 只更新一条数据
      updateOnlyRole(id) {
        getRolesByIdApi(id).then(result => {
          this.rolesForm.some((item, index) => {
            if (item.id === id) {
              this.rolesForm[index] = result.data;
              this.$refs.roleTable.setCurrentRow(this.rolesForm[index]);
              return true
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .item {
    margin-bottom: 18px;
  }

  .header {
    position: relative;
    font-size: 1rem;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
