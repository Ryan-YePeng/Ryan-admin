<template>
  <el-dialog
    :title="title + '角色'"
    width="500px"
    append-to-body
    @close="cancel"
    :close-on-click-modal="false"
    :visible.sync="dialogTableVisible">
    <el-form :model="form" :rules="rules" ref="formDialog" label-width="120px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="角色级别:">
        <el-input-number v-model="form.level" controls-position="right" style="width: 340px" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="数据范围:">
        <el-select v-model="form.dataScope" style="width: 340px">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据权限:" v-if="form.dataScope === '自定义'">
        <TreeSelect v-model="deptIds" :multiple="true" :options="tree" placeholder="请选择"></TreeSelect>
      </el-form-item>
      <el-form-item label="描述信息：">
        <el-input type="textarea" rows="3" v-model="form.remark"></el-input>
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
  import {addApi, updateRolesApi} from '../../../api/role'

  export default {
    components: {TreeSelect},
    props: ['tree'],
    data() {
      return {
        title: '',
        dialogTableVisible: false,
        form: {
          name: '',
          level: 1,
          dataScope: '本级',
          remark: ''
        },
        deptIds: [],
        id: null,
        options: ['全部', '本级', '自定义'],
        rules: {
          name: {required: true, message: '请输入名称', trigger: 'blur'}
        }
      }
    },
    methods: {
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = this.form;
            let depts = [];
            if (data.dataScope === '自定义') {
              this.deptIds.map(item => {
                depts.push({id: item})
              });
              data.depts = depts;
            }
            if (this.title === '编辑') data.id = this.id;
            if (this.title === '新增') {
              addApi(data).then(() => {
                this.$emit('updateRoles');
                this.resetForm()
              })
            } else {
              updateRolesApi(data).then(() => {
                this.$emit('updateRoles');
                this.resetForm()
              });
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
          level: 1,
          dataScope: '本级',
          remark: ''
        };
        this.deptIds = []
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
