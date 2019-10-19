import Axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import router from '../router/index'
import store from '../store/index'

let errorMsg = '';

Axios.defaults.timeout = 5000;
Axios.defaults.baseURL = process.env.BASE_API;
Axios.defaults.withCredentials = true;

Axios.interceptors.request.use( //请求拦截
  config => { //成功
    let token = store.getters.token;
    let url = config.url;
    let isAddToken = Boolean;
    url !== 'auth/login' && url !== 'api/emailActive' && url !== 'api/forgetPwd'
      ? isAddToken = true
      : isAddToken = false;
    if (isAddToken) {
      config.headers.Authorization = token
    }
    return config
  },
  error => { //错误
    Message.error('请求错误');
    return Promise.reject(error)
  }
);

Axios.interceptors.response.use( //响应拦截
  response => { //成功
    const {message} = response.data;
    if (message) Message.success(message);
    return response
  },
  error => { //错误
    let code = 0;
    try {
      code = error.response.status;
    }
    catch (e) {
      if (error.toString().includes('timeout')) {
        let msg = '网络请求超时！';
        if (msg === errorMsg) return Promise.reject(error);
        errorMsg = msg;
        Message.error(msg)
      }
      return Promise.reject(error)
    }
    const {message} = error.response.data;
    if (code === 504) {
      if (error.response.statusText === 'Gateway Timeout') {
        let msg = '网络错误！';
        if (msg === errorMsg) return;
        errorMsg = msg;
        Message.error(msg)
      }
    }
    else if (code === 401) {
      if (message.length < 15) {
        Message.error(message)
      } else {
        let msg = '登录状态已过期，您可以继续留在该页面，或者重新登录';
        if (errorMsg === msg) return;
        errorMsg = msg;
        MessageBox.confirm(
          '登录状态已过期，您可以继续留在该页面，或者重新登录',
          '系统提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          router.push({name: 'login'})
        }).catch(() => errorMsg = '')
      }
    }
    else if (code === 403) {
      if (router.path !== '/403') router.push({name: 'error403'})
    }
    else {
      if (message !== undefined) Message.error(message);
    }
    //console.log(error.response);
    return Promise.reject(error)
  }
);

export const axiosd = url => { //delete
  return Axios({
    method: 'delete',
    url: url
  })
};
export const axiosds = (url, params) => { //delete
  return Axios({
    method: 'delete',
    url: `${url}/${params.join(',')}`
  })
};
export const axiosDK = (url, params) => { //delete
  return Axios({
    method: 'delete',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [(data) => {
      let str = '';
      for (let key in data) {
        str = str + `${key}=${data[key]}&`;
      }
      return str.replace(/&$/, '')
    }]
  })
};
export const axiosK = (url, params) => { //键值对
  return Axios({
    method: 'post',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [(data) => {
      let str = '';
      for (let key in data) {
        str = str + `${key}=${data[key]}&`;
      }
      return str.replace(/&$/, '')
    }]
  })
};
export const axiosJ = (url, params) => { //JSON
  return Axios({
    method: 'post',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [(data) => {
      return JSON.stringify(data)
    }]
  })
};
export const axiosF = (url, params) => { //非同key文件
  return Axios({
    method: 'post',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    transformRequest: [(data) => {
      const formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key])
      }
      return formData
    }]
  })
};
export const axiosFs = (url, params) => { //同key文件
  return Axios({
    method: 'post',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    transformRequest: [(data) => {
      let index = 0;
      const formData = new FormData();
      if (data[1] instanceof Array === false) {
        formData.append(data[0], data[1]);
        index = 2
      }
      for (let i = index; i < data.length; i = i + 2) {
        data[i + 1].length === 0
          ? formData.append(data[i], '')
          : data[i + 1].map(item => formData.append(data[i], item))
      }
      return formData
    }]
  })
};
export const axiosG = (url) => { //get
  return Axios({
    method: 'get',
    url: url
  })
};
export const axiosL = (url) => { //get
  return Axios({
    method: 'get',
    url: url,
    responseType: 'blob'
  })
};
// downloadExcelApi().then(response => {
//   let blob = new Blob([response.data]);
//   let downloadElement = document.createElement('a');
//   let href = window.URL.createObjectURL(blob); //创建下载的链接
//   downloadElement.href = href;
//   downloadElement.download = '员工数据.xls'; //下载后文件名
//   document.body.appendChild(downloadElement);
//   downloadElement.click(); //点击下载
//   document.body.removeChild(downloadElement); //下载完成移除元素
//   window.URL.revokeObjectURL(href); //释放掉blob对象
// })
