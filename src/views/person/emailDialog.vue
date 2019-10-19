<template>
  <el-dialog
    title="修改邮箱"
    width="500px"
    :visible.sync="emailDialogVisible"
    append-to-body
    @close="cancel"
    :close-on-click-modal="false">
    <el-form :model="emailForm" :rules="rules" ref="emailForm" label-width="80px">
      <el-form-item label="新邮箱:" prop="email">
        <el-input style="width: 213px" type="email" v-model="emailForm.email" autocomplete="off"></el-input>
        <el-button :loading="isLoading" :disabled="!isEmail" @click="getCode">{{buttonText}}</el-button>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input type="password" v-model="emailForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="验证码:" prop="code">
        <el-input type="code" v-model="emailForm.code" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitEmailForm('emailForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {changeEmailApi, get, getCodeApi} from '../../api/person'

  export default {
    data() {
      let validateEmail = (rule, value, callback) => {
        let regExp = new RegExp(/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/);
        if (regExp.test(value)) {
          this.isEmail = true;
          callback()
        } else {
          this.isEmail = false;
          callback(new Error('请正确输入邮箱'))
        }
      };
      return {
        isLoading: false,
        buttonText: '获取验证码',
        isEmail: false,
        emailDialogVisible: false,
        emailForm: {
          email: '',
          password: '',
          code: ''
        },
        rules: {
          email: {required: true, validator: validateEmail, trigger: 'change'},
          password: {required: true, message: '请输入密码', trigger: 'blur'},
          code: {required: true, message: '请输入验证码', trigger: 'blur'},
        }
      }
    },
    methods: {
      // 获取验证码
      getCode() {
        this.isLoading = true;
        this.buttonText = '验证码发送中';
        getCodeApi({email: this.emailForm.email}).then(() => {
          let time = 60;
          let interval = setInterval(() => {
            this.buttonText = `${time}秒后重新发送`;
            time--;
            if (time < 0) {
              clearInterval(interval);
              this.isLoading = false;
              this.buttonText = '获取验证码'
            }
          }, 1000)
        })
      },
      // 提交表单
      submitEmailForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            changeEmailApi(this.emailForm)
              .then(() => {
                return get()
              })
              .then(result => {
                this.$store.dispatch('setUser', result.data);
                this.resetForm()
              })
          } else {
            this.$errorMsg('输入有误！');
            return false;
          }
        })
      },
      cancel() {
        this.resetForm()
      },
      resetForm() {
        this.emailDialogVisible = false;
        this.$refs['emailForm'].resetFields();
        for (let key in this.emailForm) {
          this.emailForm.key = ''
        }
      }
    }
  }
</script>

<style scoped>

</style>
