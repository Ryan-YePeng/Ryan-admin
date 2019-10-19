import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

const type = {
  SET_USER: 'SET_USER',
  SET_TOKEN: 'SET_TOKEN',
  SET_MENU: 'SET_MENU',
  SET_ACTIVE: 'SET_ACTIVE',
  SET_TAGS: 'SET_TAGS',
  ADD_TAGS: 'ADD_TAGS',
  DELETE_TAGS: 'DELETE_TAGS',
  SET_BREADCRUMB: 'SET_BREADCRUMB',
  SET_ScrollTop: 'SET_ScrollTop',
  ClEAR: 'ClEAR'
};

const state = {
  user: {},
  token: '',
  menu: [],
  active: '首页',
  breadcrumb: [],
  tags: [{title: "首页", path: "home", index: []}],
  scrollTop: 0
};

const getters = {
  user: state => state.user,
  token: state => state.token,
  menu: state => state.menu,
  active: state => state.active,
  tags: state => state.tags,
  breadcrumb: state => state.breadcrumb,
  scrollTop: state => state.scrollTop
};

const mutations = {
  [type.SET_USER](state, user) {
    if (user) state.user = user;
    else state.user = {}
  },
  [type.SET_TOKEN](state, token) {
    if (token) state.token = token;
    else state.token = ''
  },
  [type.SET_MENU](state, menu) {
    if (menu) state.menu = menu;
    else state.menu = []
  },
  [type.SET_ACTIVE](state, active) {
    if (active) state.active = active;
    else state.active = '首页'
  },
  [type.SET_BREADCRUMB](state, breadcrumb) {
    if (breadcrumb) state.breadcrumb = breadcrumb;
    else state.breadcrumb = []
  },
  [type.SET_TAGS](state, tags) {
    if (tags) state.tags = tags;
    else state.tags = [{title: "首页", path: "home", index: []}]
  },
  [type.ADD_TAGS](state, tags) {
    let isExist = state.tags.some(item => {
      if (item.title === tags.title) {
        return true
      }
    });
    if (!isExist) state.tags.push(tags)
  },
  [type.DELETE_TAGS](state, index) {
    if (index) state.tags.splice(index, 1)
  },
  [type.SET_ScrollTop](state, scrollTop) {
    if (scrollTop) state.scrollTop = scrollTop;
    else state.scrollTop = 0
  },
  [type.ClEAR](state) {
    state.user = {};
    state.token = '';
    state.menu = [];
    state.active = '首页';
    state.breadcrumb = [];
    state.tags = [{title: "首页", path: "home", index: []}];
    state.scrollTop = 0
  }
};

const actions = {
  setUser: ({commit}, user) => {
    commit(type.SET_USER, user)
  },
  setToken: ({commit}, token) => {
    commit(type.SET_TOKEN, token)
  },
  setMenu: ({commit}, menu) => {
    commit(type.SET_MENU, menu)
  },
  setActive: ({commit}, active) => {
    commit(type.SET_ACTIVE, active)
  },
  setTags: ({commit}, tags) => {
    commit(type.SET_TAGS, tags)
  },
  addTags: ({commit}, tags) => {
    commit(type.ADD_TAGS, tags)
  },
  deleteTags: ({commit}, index) => {
    commit(type.DELETE_TAGS, index)
  },
  setBreadcrumb: ({commit}, breadcrumb) => {
    commit(type.SET_BREADCRUMB, breadcrumb)
  },
  setScrollTop: ({commit}, scrollTop) => {
    commit(type.SET_ScrollTop, scrollTop)
  },
  clear: ({commit}) => {
    commit(type.ClEAR)
  }
};

const plugins = [
  createPersistedState({
    key: 'adminMaster',
    storage: window.sessionStorage
  })
];

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins
})

