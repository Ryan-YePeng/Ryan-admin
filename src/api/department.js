import {axiosd, axiosG, axiosK} from '../utils/http'

const getDeptUrl = 'api/dept/getDept?';
export function getDeptApi(param) {
  return new Promise(resolve => {
    axiosG(getDeptUrl + param).then(result => {
      resolve(result)
    })
  })
}

const getTreeUrl = 'api/dept/tree';
export function getTreeApi() {
  return new Promise(resolve => {
    axiosG(getTreeUrl).then(result => {
      resolve(result)
    })
  })
}

const addUrl = 'api/dept/addDept';
export function addApi(data) {
  return new Promise(resolve => {
    axiosK(addUrl, data).then(result => {
      resolve(result)
    })
  })
}

const editUrl = 'api/dept/updateDept';
export function editApi(data) {
  return new Promise(resolve => {
    axiosK(editUrl, data).then(result => {
      resolve(result)
    })
  })
}

const deleteUrl = 'api/dept/delDept/';
export function deleteApi(param) {
  return new Promise((resolve, reject) => {
    axiosd(deleteUrl + param)
      .then(result => {
        resolve(result)
      })
      .catch(error => {
        reject(error)
      })
  })
}


