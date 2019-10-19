<template>
  <el-dialog
    :title="title + '角色'"
    width="600px"
    append-to-body
    @close="cancel"
    :close-on-click-modal="false"
    :visible.sync="dialogTableVisible">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="120px"
      :hide-required-asterisk="true">
      <el-form-item label="用户名:" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="状态:" prop="enabled">
        <el-radio v-model="form.enabled" label="true">激活</el-radio>
        <el-radio v-model="form.enabled" label="false">锁定</el-radio>
      </el-form-item>
      <el-form-item label="电话:" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="部门:" prop="deptId">
        <TreeSelect v-model="form.deptId" :multiple="false" :options="tree" placeholder="请选择部门"></TreeSelect>
      </el-form-item>
      <el-form-item label="岗位:" prop="posId">
        <el-select v-model="form.posId" placeholder="请选择岗位">
          <el-option
            v-for="item in positionList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色:" prop="rolesIds">
        <el-select
          v-model="form.rolesIds"
          placeholder="请选择角色"
          multiple
          collapse-tags>
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
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
  import {isEmpty} from "../../../utils/common";
  import {getRolesApi, getPositionApi, addApi, editApi} from '../../../api/user'

  export default {
    components: {TreeSelect},
    data() {
      return {
        dialogTableVisible: false,
        title: '',
        rules: {
          username: {required: true, message: '不能为空', trigger: 'blur'},
          phone: {required: true, message: '不能为空', trigger: 'blur'},
          posId: {required: true, message: '不能为空', trigger: 'change'},
          rolesIds: {required: true, message: '不能为空', trigger: 'change'}
        },
        form: {
          username: '',
          enabled: 'true',
          phone: '',
          deptId: null,
          posId: null,
          rolesIds: [],
          roles: []
        },
        id: null,
        rolesList: [],
        positionList: []
      }
    },
    props: ['tree'],
    mounted() {
      getRolesApi().then(result => {
        this.rolesList = result.data
      });
      getPositionApi().then(result => {
        this.positionList = result.data
      })
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (isEmpty(this.form.deptId)) {
              this.$warnMsg('部门不能为空');
              return
            }
            let data = {};
            for (let key in this.form) {
              data[key] = this.form[key]
            }
            data.roles = [];
            this.form.rolesIds.forEach(id => {
              data.roles.push({id: id})
            });
            delete data.rolesIds;
            if (this.title === '新增') {
              //  新增
              addApi(data).then(() => {
                this.resetForm();
                this.$emit('update')
              });
            } else {
              //  编辑
              data.id = this.id;
              console.log(data)
              editApi(data).then(() => {
                this.resetForm();
                this.$emit('update')
              })
            }
          } else {
            this.$errorMsg('请正确填写信息！');
            return false;
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
          username: '',
          enabled: 'true',
          phone: '',
          deptId: null,
          posId: null,
          rolesIds: [],
          roles: []
        }
      }
    }
  }
</script>

<style scoped>

</style>
