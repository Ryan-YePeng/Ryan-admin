<template>
  <div class="person">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5">
        <el-card class="box-card" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div style="text-align: center; margin-bottom: 20px">
            <el-upload
              :show-file-list="false"
              :on-success="handleSuccess"
              :on-error="handleError"
              :headers="headers"
              :action="base + 'api/picture/user'"
              class="avatar-uploader">
              <el-avatar shape="circle" :size="120" :src="`http://ylhy.online:8030/temp/${user.picture}`">
                <img src="https://myinterface.xuanzai.top/getPicture?type=error"/>
              </el-avatar>
            </el-upload>
          </div>
          <ul class="personInfo">
            <li>
              <span>用户名称</span>
              <span>{{user.username}}</span>
            </li>
            <li>
              <span>手机号码</span>
              <span>{{user.phone}}</span>
            </li>
            <li>
              <span>用户邮箱</span>
              <span>{{user.email}}</span>
            </li>
            <li>
              <span>所属部门</span>
              <span>{{department}}</span>
            </li>
            <li>
              <span>创建日期</span>
              <span>{{user.create_time}}</span>
            </li>
            <li>
              <span>安全设置</span>
              <span>
                <a style="color: #317ef3; cursor: pointer" @click="changePassword">修改密码</a>
                <a style="color: #317ef3; cursor: pointer" @click="changeEmail">修改邮箱</a>
              </span>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>操作日志</span>
            <i style="float: right; padding: 3px 0; cursor: pointer" @click="update"
               :class="isLoading ? 'el-icon-loading':'el-icon-refresh'"></i>
          </div>
          <div>
            <el-table v-loading="loading" :data="logData" style="width: 100%">
              <el-table-column prop="description" label="行为">
                <template slot-scope="scope">
                  <span>{{ scope.row.description }}</span>
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
            <Pagination ref="pagination" @getNewData="getLog"></Pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <PasswordDialog ref="passwordDialogForm"></PasswordDialog>
    <EmailDialog ref="emailDialogForm"></EmailDialog>
  </div>
</template>

<script>
  import {getLogApi, get} from '../../api/person'
  import Pagination from '../../components/pagination/index'
  import PasswordDialog from './passwordDialog'
  import EmailDialog from './emailDialog'

  export default {
    components: {Pagination, PasswordDialog, EmailDialog},
    name: 'person',
    data() {
      return {
        isLoading: false,
        loading: false,
        logData: []
      }
    },
    mounted() {
      this.getLog()
    },
    computed: {
      'headers': function () {
        return {'Authorization': this.$store.getters.token}
      },
      'user': function () {
        return this.$store.getters.user
      },
      'department': function () {
        let list = this.user.departments;
        let string = '';
        list.forEach((item, index) => {
          index === 0
            ? string = string + `${item.name}`
            : string = string + `/${item.name}`
        });
        return string
      },
      'base': function () {
        return process.env.BASE_API
      }
    },
    methods: {
      // 上传失败
      handleError(e) {
        const msg = JSON.parse(e.message);
        this.$errorMsg(msg)
      },
      // 上传成功
      handleSuccess() {
        this.$successMsg('头像修改成功');
        this.updateAvatarApi()
      },
      // 更新照片
      updateAvatarApi() {
        get().then(result => {
          this.$store.dispatch('setUser', result.data)
        })
      },
      // 更新操作日志
      update() {
        this.isLoading = true;
        this.getLog();
      },
      // 获得个人操作日志
      getLog() {
        this.loading = true;
        let pagination = this.$refs.pagination.pagination;
        let param = `page=${pagination.page}&size=${pagination.size}`;
        getLogApi(param).then(result => {
          this.loading = false;
          this.isLoading = false;
          this.logData = result.data.logs;
          pagination.total = result.data.count
        })
      },
      // 修改密码
      changePassword() {
        const _this = this.$refs.passwordDialogForm;
        _this.passwordDialogVisible = true
      },
      // 修改邮箱
      changeEmail() {
        const _this = this.$refs.emailDialogForm;
        _this.emailDialogVisible = true
      }
    }
  }
</script>

<style lang="scss">
  .person {
    .personInfo li {
      border-bottom: 1px solid #f0f3f4;
      border-top: 1px solid #f0f3f4;
      padding: 11px 0;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
    }
    .el-avatar>img {
      width: 100%;
    }
  }
</style>
