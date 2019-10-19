<template>
  <el-dialog
    :title="title + '岗位'"
    width="500px"
    append-to-body
    @close="cancel"
    :close-on-click-modal="false"
    :visible.sync="dialogTableVisible">
    <el-form :model="form" :rules="rules" ref="formDialog" label-width="120px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序:" prop="sort">
        <el-input-number v-model="form.sort" controls-position="right" style="width: 340px" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="状态:">
        <el-radio v-model="form.enabled" :label="boolean.TRUE">正常</el-radio>
        <el-radio v-model="form.enabled" :label="boolean.FALSE">停用</el-radio>
      </el-form-item>
      <el-form-item label="所属部门:">
        <TreeSelect v-model="form.deptId" :multiple="false" :options="tree" placeholder="请选择"></TreeSelect>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitForm('formDialog')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import TreeSelect from '@riophae/vue-treeselect'
  import {getTreeApi, addApi, editApi} from "../../../api/position"
  import {isEmpty} from '../../../utils/common'

  export default {
    components: {TreeSelect},
    data() {
      return {
        title: '',
        tree: [],
        dialogTableVisible: false,
        boolean: {
          TRUE: true,
          FALSE: false
        },
        id: null,
        form: {
          name: '',
          sort: 0,
          enabled: true,
          deptId: null
        },
        rules: {
          name: {required: true, message: '请输入名称', trigger: 'blur'},
          sort: {required: true, message: '不能为空', trigger: 'blur'}
        }
      }
    },
    created() {
      getTreeApi().then(result => {
        this.tree = result.data
      })
    },
    methods: {
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (isEmpty(this.form.deptId)) {
              this.$warnMsg('所属部门不能为空');
              return
            }
            // 新增
            if (this.title === '新增') {
              addApi(this.form).then(() => {
                this.$emit('update');
                this.resetForm()
              })
            } else {
              // 编辑
              this.form.id = this.id;
              editApi(this.form).then(() => {
                this.$emit('update');
                this.resetForm()
              })
            }
          } else {
            this.$errorMsg('请正确输入信息！');
            return false
          }
        });
      },
      // 取消
      cancel() {
        this.resetForm();
      },
      // 重置表单
      resetForm() {
        this.dialogTableVisible = false;
        this.$refs['formDialog'].resetFields();
        this.form = {
          name: '',
          sort: 0,
          enabled: true,
          deptId: null
        }
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
