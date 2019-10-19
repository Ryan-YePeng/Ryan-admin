<template>
  <el-dialog
    :title="title + '部门'"
    width="600px"
    append-to-body
    @close="cancel"
    :close-on-click-modal="false"
    :visible.sync="dialogTableVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="名称:" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="flag" label="状态:">
        <el-radio v-model="form.enabled" label="true">正常</el-radio>
        <el-radio v-model="form.enabled" label="false">停用</el-radio>
      </el-form-item>
      <el-form-item v-if="flag" label="上级部门:">
        <TreeSelect v-model="form.pid" :multiple="false" :options="tree" placeholder="请选择"></TreeSelect>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import TreeSelect from '@riophae/vue-treeselect'
  import {isEmpty} from '../../../utils/common'
  import {addApi, editApi, getTreeApi} from '../../../api/department'

  export default {
    data() {
      return {
        flag: true,
        title: '',
        tree: [],
        dialogTableVisible: false,
        form: {
          name: '',
          enabled: 'true',
          pid: null
        },
        id: null,
        rules: {
          name: {required: true, message: '名称不能为空', trigger: 'blur'}
        }
      }
    },
    components: {TreeSelect},
    created() {
      this.get()
    },
    methods: {
      // 获得部门树
      get() {
        getTreeApi().then(result => {
          this.tree = result.data
        })
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (isEmpty(this.form.pid)) {
              this.$warnMsg('上级部门不能为空');
              return
            }
            // 新增
            if (this.title === '新增') {
              addApi(this.form).then(() => {
                this.$emit('update');
                this.get();
                this.resetForm()
              })
            } else {
              // 编辑
              this.form.id = this.id;
              editApi(this.form).then(() => {
                this.$emit('update');
                this.get();
                this.resetForm()
              })
            }
          } else {
            this.$warnMsg('请正确输入信息');
            return false
          }
        });
      },
      cancel() {
        this.resetForm()
      },
      resetForm() {
        this.dialogTableVisible = false;
        this.$refs['form'].resetFields();
        this.form = {
          name: '',
          enabled: 'true',
          pid: null
        }
      }
    }

  }
</script>

<style scoped>

</style>
