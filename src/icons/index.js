import Vue from 'vue'
import SvgIcon from '../components/svg_icon/index'// svg component

// register globally
Vue.component('svg-icon', SvgIcon);

const req = require.context('./svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req)