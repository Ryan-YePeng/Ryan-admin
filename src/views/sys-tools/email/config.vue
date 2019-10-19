<template>
  <el-form label-position="right" :rules="rule" label-width="110px" :model="form" size="mini" ref="form">
    <el-form-item label="发件人邮箱" prop="fromUser">
      <el-input v-model="form.fromUser" style="width: 40%"></el-input>
      <span class="tips">Sender mailbox</span>
    </el-form-item>
    <el-form-item label="发件用户名" prop="user">
      <el-input v-model="form.user" style="width: 40%"></el-input>
      <span class="tips">Sender usernamex</span>
    </el-form-item>
    <el-form-item label="邮箱密码" prop="pass">
      <el-input type="password" v-model="form.pass" style="width: 40%"></el-input>
      <span class="tips">email Password</span>
    </el-form-item>
    <el-form-item label="SMTP地址" prop="host">
      <el-input v-model="form.host" style="width: 40%"></el-input>
      <span class="tips">SMTP address</span>
    </el-form-item>
    <el-form-item label="SMTP端口" prop="port">
      <el-input v-model="form.port" style="width: 40%"></el-input>
      <span class="tips"> SMTP port</span>
    </el-form-item>
    <el-form-item label="">
      <el-button size="large" type="primary" @click="submit" :loading="btnLoading">保存配置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {getApi, configApi} from "../../../api/email"

  export default {
    name: "Config",
    data() {
      return {
        btnLoading: false,
        rule: {
          fromUser: {required: true, message: '请输入发件人邮箱', trigger: 'blur'},
          user: {required: true, message: '请输入发件用户名', trigger: 'blur'},
          pass: {required: true, message: '请输入邮箱密码', trigger: 'blur'},
          host: {required: true, message: '请输入SMTP地址', trigger: 'blur'},
          port: {required: true, message: '请输入SMTP端口', trigger: 'blur'}
        },
        form: {
          fromUser: '',
          user: '',
          pass: '',
          host: '',
          port: '',
        }
      }
    },
    created() {
      getApi().then(result => {
        for (let key in this.form) {
          this.form[key] = result.data[key]
        }
      })
    },
    methods: {
      submit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            configApi(this.form).then(() => {
              this.btnLoading = false
            })
          } else {
            this.$warnMsg('请正确输入信息！！');
            return false;
          }
        })
      }
    }
  }
</script>

<style scoped>
  .tips {
    color: rgb(192, 192, 192);
    margin-left: 10px;
  }
</style>
