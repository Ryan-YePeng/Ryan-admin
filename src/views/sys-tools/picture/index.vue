<template>
  <div class="picture">
    <el-card class="box-card">
      <div slot="header">
        <el-input
          clearable
          size="small"
          placeholder="输入文件名"
          style="width: 180px;margin-left: 15px"
          v-model="searchText">
        </el-input>
        <el-button type="success" class="el-icon-search" @click="get" size="mini">搜索</el-button>
        <el-button type="primary" class="el-icon-plus" @click="dialog = true" size="mini">上传</el-button>
        <el-button :disabled="isDisabled" type="danger" class="el-icon-delete" @click="deletePictures" size="mini">删除
        </el-button>
      </div>
      <div>
        <el-table
          v-loading="loading"
          :data="formData"
          @selection-change="handleSelectionChange"
          max-height="100%"
          style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="filename" label="文件名" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.filename }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="上传者">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="微缩图">
            <template slot-scope="scope">
              <div @click="open(scope.row.url)">
                <el-avatar shape="square" style="cursor: pointer" :size="60" :src="scope.row.url">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="文件大小">
            <template slot-scope="scope">
              <span>{{ scope.row.size }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="height" label="高度">
            <template slot-scope="scope">
              <span>{{ scope.row.height }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="width" label="宽度">
            <template slot-scope="scope">
              <span>{{ scope.row.width }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建日期" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80" fixed="right">
            <template slot-scope="scope">
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="isLoading" type="primary" size="mini" @click.stop="deletePicture(scope.row.id)">
                    确定
                  </el-button>
                </div>
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" @click.stop/>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <!--上传图片-->
        <el-dialog :visible.sync="dialog" append-to-body width="600px" @close="close">
          <el-upload
            ref="uploadPicture"
            :headers="headers"
            :action="base + 'api/picture/upload'"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-error="handleError"
            list-type="picture-card">
            <i class="el-icon-plus"/>
          </el-upload>
          <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
            <img :src="dialogImageUrl" width="100%" alt="图片">
          </el-dialog>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="close">确认</el-button>
          </div>
        </el-dialog>
        <Pagination ref="pagination" @getNewData="get"></Pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {getApi, deleteApi, deletesApi} from '../../../api/picture'
  import Pagination from '../../../components/pagination/index'

  export default {
    components: {Pagination},
    name: 'photo',
    data() {
      return {
        loading: false,
        isLoading: false,
        formData: [],
        dialog: false,
        dialogVisible: false,
        dialogImageUrl: '',
        pictureList: [],
        deleteList: [],
        searchText: '',
        isDisabled: true
      }
    },
    mounted() {
      this.get()
    },
    computed: {
      'headers': function () {
        return {'Authorization': this.$store.getters.token}
      },
      'base': function () {
        return process.env.BASE_API
      }
    },
    methods: {
      // 获得图片数据列表
      get() {
        this.loading = true;
        let pagination = this.$refs.pagination.pagination;
        let params;
        this.searchText
          ? params = `page=${pagination.page}&size=${pagination.size}&keywords=${this.searchText}`
          : params = `page=${pagination.page}&size=${pagination.size}`;
        getApi(params).then(result => {
          this.loading = false;
          this.formData = result.data.pictures;
          pagination.total = result.data.count
        })
      },
      // 浏览图片
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true
      },
      // 移除图片
      handleRemove(file) {
        let uid = file.uid;
        this.pictureList.some(item => {
          if (item.uid === uid) {
            deleteApi(item.id);
            return true
          }
        })
      },
      // 上传失败
      handleError(response) {
        const msg = JSON.parse(response.message);
        this.$errorMsg(msg)
      },
      // 上传成功
      handleSuccess(response, file) {
        let uid = file.uid;
        let id = response.data.id;
        this.pictureList.push({uid, id})
      },
      // 删除数据
      deletePicture(id) {
        this.isLoading = true;
        deleteApi(id).then(() => {
          this.deleteOnlyOne(id);
          this.isLoading = false;
          this.$refs[id].doClose();
        })
      },
      // 删除单条数据
      deleteOnlyOne(id) {
        this.formData.some((item, index) => {
          if (item.id === id) {
            this.formData.splice(index, 1);
            return true
          }
        })
      },
      // 关闭上传窗口
      close() {
        if (this.pictureList.length !== 0) this.get();
        this.pictureList = [];
        this.$refs['uploadPicture'].clearFiles();
        this.dialog = false;
      },
      // 新窗口打开图片
      open(url) {
        window.open(url)
      },
      handleSelectionChange(val) {
        this.deleteList = val;
        this.deleteList.length !== 0
          ? this.isDisabled = false
          : this.isDisabled = true;
      },
      // 删除多张图片
      deletePictures() {
        this.$msgBox('确定删除选中的图片吗？').then(() => {
          let list = [];
          this.deleteList.forEach(item => {
            list.push(item.id)
          });
          deletesApi(list).then(() => {
            this.get()
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  .picture {
    .el-avatar>img {
      width: 100%;
    }
  }
</style>
