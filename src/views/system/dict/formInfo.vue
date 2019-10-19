<template>
  <el-dialog
    :title="title + '字典'"
    width="500px"
    append-to-body
    @close="cancel"
    :close-on-click-modal="false"
    :visible.sync="dialogTableVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="字典标签:" prop="label">
        <el-input v-model="form.label"></el-input>
      </el-form-item>
      <el-form-item label="字典值:" prop="value">
        <el-input v-model="form.value"></el-input>
      </el-form-item>
      <el-form-item label="排序:" prop="sort">
        <el-input-number v-model="form.sort" controls-position="right" :min="0" :max="99"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogTableVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {addInfoApi, editInfoApi} from '../../../api/dict'

  export default {
    name: 'FormInfo',
    data() {
      return {
        title: '',
        dialogTableVisible: false,
        form: {
          label: '',
          sort: 0,
          value: ''
        },
        id: null,
        currentId: null,
        rules: {
          label: {required: true, message: '请输入字典标签', trigger: blur},
          sort: {required: true, message: '请输入序号', trigger: blur}
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {};
            for(let key in this.form) {
              data[key] = this.form[key]
            }
            if (this.title === '新增') {
              data.dictId = this.currentId;
              addInfoApi(data).then(() => {
                this.$emit('update');
                this.resetForm()
              })
            } else {
              data.id = this.id;
              editInfoApi(data).then(() => {
                this.$emit('update');
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
        this.form.label = '';
        this.form.sort = 0;
        this.form.value = ''
      }
    }
  }
</script>

<style scoped>

</style>
