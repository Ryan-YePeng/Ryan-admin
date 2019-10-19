<template>
  <el-row :gutter="20">
    <el-col :md="6" :sm="24">
      <el-card class="box-card" style="margin-bottom: 20px">
        <div slot="header" class="clearfix">
          <el-input
            clearable
            size="small"
            placeholder="输入部门名称"
            prefix-icon="el-icon-search"
            style="width: 100%;"
            v-model="departmentText">
          </el-input>
        </div>
        <div>
          <el-tree
            :data="tree"
            ref="departmentTree"
            @node-click="searchByDepartment"
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            node-key="id">
          </el-tree>
        </div>
      </el-card>
    </el-col>
    <el-col :md="18" :sm="24">
      <el-card class="box-card" style="margin-bottom: 20px">
        <div slot="header" class="clearfix">
          <el-input
            clearable
            size="small"
            placeholder="输入用户名"
            style="width: 180px"
            v-model="usernameText">
          </el-input>
          <el-select v-model="optionsValue" placeholder="状态" clearable style="width: 90px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button class="el-icon-search" type="success" size="mini" @click="optionSearch"> 搜索</el-button>
          <el-button class="el-icon-plus" type="primary" size="mini" @click="add"> 新增</el-button>
        </div>
        <div>
          <el-table v-loading="loading" :data="userData" max-height="100%" style="width: 100%">
            <el-table-column prop="username" label="用户名" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.username }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="电话" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.email }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="departments[0].name" label="部门" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.departments[0].name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="positions[0].name" label="岗位" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.positions[0].name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="enabled" align="center" label="状态" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-tag :type="scope.row.enabled ? 'primary' : 'danger'">
                  {{ scope.row.enabled ? '激活' : '锁定' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建日期" width="140px">
              <template slot-scope="scope">
                <span>{{ scope.row.create_time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" class="el-icon-edit" @click="edit(scope.row)" size="mini"></el-button>
                <el-popover
                  :ref="scope.row.id"
                  placement="top"
                  width="180">
                  <p>确定删除本条数据吗？</p>
                  <div style="text-align: right; margin: 0;">
                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                    <el-button :loading="isLoading" type="primary" size="mini" @click.stop="deleteUser(scope.row.id)">
                      确定
                    </el-button>
                  </div>
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" @click.stop/>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <Pagination ref="pagination" @getNewData="getUsers"></Pagination>
          <Form ref="form" @update="getUsers" :tree="tree"></Form>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import Pagination from '../../../components/pagination'
  import {getUsersApi, deleteApi, getTreeApi} from '../../../api/user'
  import {isEmpty} from "../../../utils/common";
  import Form from './form'

  export default {
    name: "user",
    components: {Pagination, Form},
    data() {
      return {
        usernameText: '',
        departmentText: '',
        options: [
          {
            value: 'true',
            label: '激活'
          }, {
            value: 'false',
            label: '锁定'
          }
        ],
        optionsValue: '',
        isLoading: false,
        loading: false,
        userData: [],
        tree: []
      }
    },
    created() {
      getTreeApi().then(result => {
        this.tree = result.data
      });
    },
    mounted() {
      this.getUsers()
    },
    watch: {
      departmentText(val) {
        this.$refs.departmentTree.filter(val);
      },
      optionsValue() {
        this.optionSearch()
      }
    },
    methods: {
      getUsers(url) {
        this.loading = true;
        let pagination = this.$refs.pagination.pagination;
        let param;
        isEmpty(url)
          ? param = `page=${pagination.page}&size=${pagination.size}`
          : param = `page=${pagination.page}&size=${pagination.size}` + url;
        getUsersApi(param).then(result => {
          this.loading = false;
          this.userData = result.data.userList;
          pagination.total = result.data.total
        })
      },
      //  按部门查询信息
      searchByDepartment(obj) {
        let url = '&deptName=' + obj.label;
        this.getUsers(url)
      },
      // 条件搜索
      optionSearch() {
        let url;
        let usernameText = this.usernameText;
        let optionsValue = this.optionsValue;
        if (usernameText === '' && optionsValue === '' ) {
          url = ''
        } else if (usernameText === '' && optionsValue !== '') {
          url = '&state=open&enabled=' + optionsValue;
        } else if (usernameText !== '' && optionsValue === '') {
          url = '&name=' + usernameText;
        } else {
          url = `&name=${usernameText}&state=open&enabled=${optionsValue}`;
        }
        this.getUsers(url)
      },
      // 过滤节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 新增用户
      add() {
        const _this = this.$refs.form;
        _this.title = '新增';
        _this.dialogTableVisible = true;
      },
      // 修改用户
      edit(row) {
        const _this = this.$refs.form;
        _this.title = '编辑';
        _this.dialogTableVisible = true;
        _this.id = row.id;
        _this.form = {
          username: row.username,
          enabled: row.enabled.toString(),
          phone: row.phone,
          deptId: row.deptId,
          posId: row.posId,
          rolesIds: [],
          roles: []
        };
        row.roles.forEach(item => {
          _this.form.rolesIds.push(item.id)
        })
      },
      // 删除
      deleteUser(id) {
        this.isLoading = true;
        deleteApi(id)
          .then(() => {
            this.isLoading = false;
            this.$refs[id].doClose();
            this.getUsers()
          })
          .catch(() => {
            this.isLoading = false;
            this.$refs[id].doClose()
          })
      }
    }
  }
</script>

<style scoped lang="scss">
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
