<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="tag in tags"
        ref="tag"
        :class="isActive(tag.path) ? 'active' : ''"
        :key="tag.path"
        :to='{name: tag.path}'
        tag="span"
        class="tags-view-item"
        @click.native="tabsClick(tag)"
      >
        {{ tag.title }}
        <span v-if="tag.title !== '首页'" class="el-icon-close" @click.prevent.stop="tabsRemove(tag)"></span>
      </router-link>
    </scroll-pane>
  </div>
</template>

<script>
  import ScrollPane from '../scrollpane/index';

  export default {
    components: {ScrollPane},
    computed: {
      'tags': function () {
        return this.$store.getters.tags
      }
    },
    watch: {
      '$route.path': function () {
        this.moveToCurrentTag()
      }
    },
    methods: {
      // 移动到被选中的标签
      moveToCurrentTag() {
        const tags = this.$refs.tag;
        this.$nextTick(() => {
          for (const tag of tags) {
            if (this.$route.path.endsWith(tag.to.name)) {
              this.$refs.scrollPane.moveToTarget(tag);
              break
            }
          }
        })
      },
      // 高亮标签
      isActive(path) {
        return this.$route.path.endsWith(path)
      },
      // 点击标签改变激活菜单和面包屑
      tabsClick(tag) {
        this.$store.dispatch('setBreadcrumb', tag.index);
        this.$store.dispatch('setActive', tag.title);
      },
      tabsRemove(obj) {
        let title = obj.title;
        // 找到将被删除的标签索引
        let index = this.tags.findIndex(item => {
          if (item.title === title) return true
        });
        // 获取当前激活菜单
        let active = this.$store.getters.active;
        if (active !== title) {
          // 删除
          this.$store.dispatch('deleteTags', index);
          return
        }
        let nextIndex;
        index === this.tags.length - 1
          ? nextIndex = index - 1
          : nextIndex = index + 1;
        let nextObj = this.tags[nextIndex];
        this.$router.push({name: nextObj.path});
        // 改变激活菜单
        this.$store.dispatch('setActive', nextObj.title);
        // 改变面包屑
        this.$store.dispatch('setBreadcrumb', nextObj.index);
        // 删除
        this.$store.dispatch('deleteTags', index)
      },
      // 初始化当前滚动高度
      initialScrollTop(isIntial = false) {
        isIntial
          ? document.querySelector('.top').scrollTop = this.$store.getters.scrollTop
          : setTimeout(() => {
            document.querySelector('.top').scrollTop = 0
          }, 700)
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tags-view-container {
    height: 34px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
    .tags-view-wrapper {
      .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        padding: 0 8px;
        font-size: 12px;
        margin-left: 5px;
        margin-top: 4px;
        &:first-of-type {
          margin-left: 15px;
        }
        &:last-of-type {
          margin-right: 15px;
        }
        &.active {
          background-color: #409eff;
          color: #fff;
          border-color: #409eff;
          &::before {
            content: '';
            background: #fff;
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            position: relative;
            margin-right: 2px;
          }
        }
      }
    }
    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 100;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {
    .tags-view-item {
      user-select: none;
      .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        &:before {
          transform: scale(.6);
          display: inline-block;
          vertical-align: -3px;
        }
        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
</style>
