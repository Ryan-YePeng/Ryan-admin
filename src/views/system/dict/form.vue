<template>
  <el-dialog
    :title="title + '字典'"
    width="500px"
    append-to-body
    @close="cancel"
    :close-on-click-modal="false"
    :visible.sync="dialogTableVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="字典名称:" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="描述:" prop="remark">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogTableVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {addApi, editApi} from '../../../api/dict'

  export default {
    data() {
      return {
        title: '',
        dialogTableVisible: false,
        form: {
          name: '',
          remark: ''
        },
        id: null,
        rules: {
          name: {required: true, message: '名称不能为空', trigger: blur}
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.title === '新增') {
              addApi(this.form).then(() => {
                this.$emit('update');
                this.resetForm()
              })
            }
            else {
              let data = {};
              data.name = this.form.name;
              data.remark = this.form.remark;
              data.id = this.id;
              editApi(data).then(() => {
                this.$emit('update');
                this.$vueEventEmit('dictCurrentId', this.id);
                this.resetForm()
              })
            }
          } else {
            this.$warnMsg('请正确输入信息!!');
            return false
          }
        })
      },
      cancel() {
        this.resetForm();
      },
      resetForm() {
        this.dialogTableVisible = false;
        this.$refs['form'].resetFields();
        this.form.name = '';
        this.form.remark = ''
      }
    }
  }
</script>

<style scoped>

</style>
