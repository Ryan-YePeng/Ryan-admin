import Vue from 'vue'
// 引用路由
import router from './router/index'
// 引用vuex
import store from './store/index'
// 引用ElementUI
import ElementUI from 'element-ui';
// 引用ElementUI样式
import 'element-ui/lib/theme-chalk/index.css';
// 引用过滤器
import './utils/directive'
// 引用样式初始化
import './styles/initialization.css'
//引用本地存储
import Storage from './utils/storage'
// 引用操作弹出的Msg
import Tips from './utils/tips'
// 引用组件传值
import VueEvent from './utils/vueEvent'
// 引用jquery
import $ from 'jquery'
// 引用图标库
import './styles/iconfont.css'
// 引用vue粒子线
import VueParticles from 'vue-particles'
// 引用选择树样式
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// 引用svg
import './icons/index'
// 阻止事件的默认行为
import 'default-passive-events'
// 引用App
import App from './App'

// 阻止启动生产消息
Vue.config.productionTip = false;

// 使用element-ui
Vue.use(ElementUI, {size: 'small'});
// 使用vue粒子线
Vue.use(VueParticles);

// 使用element-ui的message
Vue.prototype.$successMsg = Tips.successMsg;
Vue.prototype.$errorMsg = Tips.errorMsg;
Vue.prototype.$infoMsg = Tips.infoMsg;
Vue.prototype.$warnMsg = Tips.warnMsg;
Vue.prototype.$successNotify = Tips.successNotify;
Vue.prototype.$errorNotify = Tips.errorNotify;
Vue.prototype.$infoNotify = Tips.infoNotify;
Vue.prototype.$warnNotify = Tips.warnNotify;
Vue.prototype.$msgBox = Tips.msgBox;

// 本地储存
Vue.prototype.$setLocalStorage = Storage.setLocalStorage;
Vue.prototype.$getLocalStorage = Storage.getLocalStorage;
Vue.prototype.$removeLocalStorage = Storage.removeLocalStorage;
Vue.prototype.$clearLocalStorage = Storage.clearLocalStorage;
Vue.prototype.$setSessionStorage = Storage.setSessionStorage;
Vue.prototype.$getSessionStorage = Storage.getSessionStorage;
Vue.prototype.$removeSessionStorage = Storage.removeSessionStorage;
Vue.prototype.$clearSessionStorage = Storage.clearSessionStorage;

// 组件传值
Vue.prototype.$vueEventEmit = VueEvent.$emit;
Vue.prototype.$vueEventOn = VueEvent.$on;

// jquery
Vue.prototype.$$ = $;

new Vue({
  el: '#app',
  router: router,
  store,
  components: {App},
  template: '<App/>'
});
