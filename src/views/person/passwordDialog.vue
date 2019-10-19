<template>
  <el-dialog
    title="修改密码"
    width="450px"
    :visible.sync="passwordDialogVisible"
    append-to-body
    @close="cancel"
    :close-on-click-modal="false">
    <el-form :model="passwordForm" :rules="rules" ref="passwordForm" label-width="120px">
      <el-form-item label="旧密码:" prop="password">
        <el-input type="password" v-model="passwordForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码:" prop="repassword">
        <el-input type="password" v-model="passwordForm.repassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码:" prop="checkrepassword">
        <el-input type="password" v-model="passwordForm.checkrepassword" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitPasswordForm('passwordForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {changePasswordApi} from '../../api/person'

  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'))
        } else if (value !== this.passwordForm.repassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      };
      return {
        passwordDialogVisible: false,
        passwordForm: {
          password: '',
          repassword: '',
          checkrepassword: ''
        },
        rules: {
          password: {required: true, message: '请输入旧密码', trigger: 'blur'},
          repassword: {required: true, message: '请输入新密码', trigger: 'blur'},
          checkrepassword: {required: true, validator: validatePass, trigger: 'blur'}
        }
      }
    },
    methods: {
      // 提交密码表单
      submitPasswordForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              password: this.passwordForm.password,
              repassword: this.passwordForm.repassword
            };
            changePasswordApi(data).then(() => {
              this.$infoMsg('请重新登录！');
              this.$router.push('/login')
            })
          } else {
            this.$errorMsg('输入有误！');
            return false;
          }
        })
      },
      // 取消
      cancel() {
        this.resetForm();
      },
      // 重置表单
      resetForm() {
        this.passwordDialogVisible = false;
        this.$refs['passwordForm'].resetFields();
        for (let key in this.passwordForm) {
          this.passwordForm.key = ''
        }
      }
    }
  }
</script>

<style scoped>

</style>
