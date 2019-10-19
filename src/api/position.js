import {axiosd, axiosG, axiosK} from '../utils/http'

const getTreeUrl = 'api/dept/tree';
export function getTreeApi() {
  return new Promise(resolve => {
    axiosG(getTreeUrl).then(result => {
      resolve(result)
    })
  })
}

const getUrl = 'api/pos/getPos?';
export function getApi(param) {
  return new Promise(resolve => {
    axiosG(getUrl + param).then(result => {
      resolve(result)
    })
  })
}

const addUrl = 'api/pos/addPos';
export function addApi(data) {
  return new Promise(resolve => {
    axiosK(addUrl, data).then(result => {
      resolve(result)
    })
  })
}

const deleteUrl = 'api/pos/delPos/';
export function deleteApi(param) {
  return new Promise((resolve, reject) => {
    axiosd(deleteUrl + param).then(result => {
      resolve(result)
    }).catch(error => {
      reject(error)
    })
  })
}

const editUrl = 'api/pos/updatePos';
export function editApi(data) {
  return new Promise(resolve => {
    axiosK(editUrl, data).then(result => {
      resolve(result)
    })
  })
}

const getAllUrl = 'api/pos/all';
export function getAllApi() {
  return new Promise(resolve => {
    axiosG(getAllUrl).then(result => {
      resolve(result)
    })
  })
}
