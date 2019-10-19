<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <span>字典详情</span>
      </div>
      <div v-if="flag">
        <div style="margin-bottom: 20px">
          <el-input
            clearable
            size="small"
            placeholder="输入字典标签"
            style="width: 180px"
            v-model="dictInfoText">
          </el-input>
          <el-button type="success" class="el-icon-search" @click="searchInfo" size="mini"> 搜索</el-button>
          <el-button type="primary" class="el-icon-plus" @click="addInfo" size="mini"> 新增</el-button>
        </div>
        <el-table
          v-loading="isLoadingInfo"
          :data="formInfoData"
          max-height="100%"
          style="width: 100%">
          <el-table-column label="所属字典">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="字典标签">
            <template slot-scope="scope">
              <span>{{ scope.row.label }}</span>
            </template>
          </el-table-column>
          <el-table-column label="字典值">
            <template slot-scope="scope">
              <span>{{ scope.row.value }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="排序">
            <template slot-scope="scope">
              <span>{{ scope.row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button type="primary" class="el-icon-edit" @click="editInfo(scope.row)" size="mini"></el-button>
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="buttonLoading" type="primary" size="mini"
                             @click.stop="deleteDictInfo(scope.row.id)">确定
                  </el-button>
                </div>
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" @click.stop/>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else class="dictTips">
        点击字典查看详情
      </div>
      <Pagination ref="pagination" @getNewData="getInfo"></Pagination>
    </el-card>
    <form-info ref="FormInfo" @update="getInfo"></form-info>
  </div>
</template>

<script>
  import {getInfoListApi, searchInfoApi, deleteInfoApi} from "../../../api/dict"
  import Pagination from '../../../components/pagination/index'
  import FormInfo from './formInfo'

  export default {
    components: {Pagination, FormInfo},
    data() {
      return {
        name: "TableInfo",
        isLoadingInfo: false,
        dictInfoText: '',
        formInfoData: [],
        currentId: null,
        buttonLoading: false,
        flag: false
      }
    },
    mounted() {
      this.$vueEventOn('dictCurrentId', id => {
        this.currentId = id;
        this.flag = true;
        this.getInfo();
      });
      this.$vueEventOn('dictDelete', () => {
        this.flag = false;
        this.$refs.pagination.pagination.total = 0
      })
    },
    methods: {
      getInfo() {
        this.isLoadingInfo = true;
        let pagination = this.$refs.pagination.pagination;
        let params = `page=${pagination.page}&size=${pagination.size}&dict_id=${this.currentId}`;
        getInfoListApi(params).then(result => {
          this.isLoadingInfo = false;
          this.formInfoData = result.data.dictDetailList;
          pagination.total = result.data.count
        })
      },
      searchInfo() {
        this.isLoadingInfo = true;
        let pagination = this.$refs.pagination.pagination;
        let params;
        this.dictInfoText
          ? params = `page=${pagination.page}&size=${pagination.size}&dict_id=${this.currentId}&keywords=${this.dictInfoText}`
          : params = `page=${pagination.page}&size=${pagination.size}&dict_id=${this.currentId}`;
        searchInfoApi(params).then(result => {
          this.isLoadingInfo = false;
          this.formInfoData = result.data.dictDetailList;
          pagination.total = result.data.count
        })
      },
      addInfo() {
        let _this = this.$refs.FormInfo;
        _this.dialogTableVisible = true;
        _this.title = '新增';
        _this.currentId = this.currentId
      },
      editInfo(row) {
        let _this = this.$refs.FormInfo;
        _this.dialogTableVisible = true;
        _this.title = '编辑';
        _this.id = row.id;
        _this.form.label = row.label;
        _this.form.sort = row.sort;
        _this.form.value = row.value;
      },
      deleteDictInfo(id) {
        this.buttonLoading = true;
        deleteInfoApi(id)
          .then(() => {
            this.buttonLoading = false;
            this.$refs[id].doClose();
            this.getInfo()
          })
          .catch(() => {
            this.buttonLoading = false;
            this.$refs[id].doClose()
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dictTips {
    padding: 15px;
    line-height: 20px;
    border-left: 3px solid #ddd;
    color: #333;
    font-family: Courier New;
    font-size: 12px;
  }
</style>
