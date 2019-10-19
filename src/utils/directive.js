import Vue from 'vue'

Vue.filter("formatDate", value => {
  let date = new Date(value);
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = (date.getDate()).toString().padStart(2, '0');
  return `${year}-${month}-${day}`
});

Vue.filter("formatDateTime", value => {
  let date = new Date(value);
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = (date.getDate()).toString().padStart(2, '0');
  let hours = (date.getHours()).toString().padStart(2, '0');
  let minutes = (date.getMinutes()).toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`
});

Vue.directive('title', {
  // 第一种方式  v-title="'haha'"  这样使用---传参方法
  bind(el, binding, vunode) {
    document.title = binding.value
  },

  //第二种方式 v-title data-title="所需要的标题"  这样使用
  inserted: function (el) {
    document.title = el.dataset.title
  }
});

