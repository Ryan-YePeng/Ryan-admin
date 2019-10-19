import {axiosd, axiosG, axiosK} from '../utils/http'

const getTreeUrl = 'api/permission/getPermission?keywords=';
export function getTreeApi(param) {
  return new Promise(resolve => {
    axiosG(getTreeUrl + param).then(result => {
      resolve(result)
    })
  })
}

const getUrl = 'api/permission/tree';
export function getApi() {
  return new Promise(resolve => {
    axiosG(getUrl).then(result => {
      resolve(result)
    })
  })
}

const addUrl = 'api/permission/addPermission';
export function addApi(data) {
  return new Promise(resolve => {
    axiosK(addUrl, data).then(result => {
      resolve(result)
    })
  })
}

const editUrl = 'api/permission/updatePermission';
export function editApi(data) {
  return new Promise(resolve => {
    axiosK(editUrl, data).then(result => {
      resolve(result)
    })
  })
}

const deleteUrl = 'api/permission/delPermission/';
export function deleteApi(param) {
  return new Promise(resolve => {
    axiosd(deleteUrl + param).then(result => {
      resolve(result)
    })
  })
}
