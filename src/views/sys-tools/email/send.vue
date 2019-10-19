<template>
  <div class="send">
    <el-form label-position="right" :rules="rules" label-width="110px" :model="form" size="mini" ref="form">
      <el-form-item label="邮件标题" prop="subject">
        <el-input v-model="form.subject" style="width: 40%"></el-input>
      </el-form-item>
      <el-form-item
        v-for="(domain, index) in tos"
        :label="'收件邮箱' + (index === 0 ? '': index)"
        :key="domain.key">
        <el-input v-model="domain.value" style="width: 31%"></el-input>
        <el-button icon="el-icon-plus" @click="addDomain"></el-button>
        <el-button style="margin-left:0px;" icon="el-icon-minus" @click.prevent="removeDomain(domain)"></el-button>
      </el-form-item>
      <div ref="editor" style="margin-bottom: 20px"></div>
      <el-button size="large" type="primary" @click="submit" :loading="btnLoading">发送邮件</el-button>
    </el-form>
  </div>
</template>

<script>
  import E from 'wangeditor'
  import {sendApi} from "../../../api/email";

  export default {
    name: "Send",
    data() {
      return {
        btnLoading: false,
        rules: {
          subject: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ]
        },
        tos: [{
          value: ''
        }],
        form: {
          subject: '',
          tos: [],
          content: ''
        },
      }
    },
    mounted() {
      let editor = new E(this.$refs.editor);
      editor.customConfig.onchange = (html) => {
        this.form.content = html
      };
      editor.create()
    },
    methods: {
      removeDomain(item) {
        let index = this.tos.indexOf(item);
        if (index !== -1 && this.tos.length !== 1) {
          this.tos.splice(index, 1)
        } else {
          this.$message({
            message: '请至少保留一位联系人',
            type: 'warning'
          })
        }
      },
      addDomain() {
        this.tos.push({
          value: '',
          key: Date.now()
        })
      },
      validatEmail(str) {
        const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        return reg.test(str)
      },
      submit() {
        this.$refs['form'].validate((valid) => {
          this.form.tos = [];
          if (valid) {
            let sub = false;
            this.tos.forEach(data => {
              if (data.value === '') {
                this.$warnMsg('收件邮箱不能为空');
                sub = true
              } else if (this.validatEmail(data.value)) {
                this.form.tos.push(data.value)
              } else {
                this.$warnMsg('收件邮箱格式错误');
                sub = true
              }
            });
            if (sub) {
              return false
            }
            this.btnLoading = true;
            sendApi(this.form)
              .then(() => {
                this.btnLoading = false
              })
              .catch(() => {
                this.btnLoading = false
              })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .send {
    box-sizing: content-box;
    position: relative;
    background-color: #fff;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
  }
</style>
